import {Physics, RigidBody, Debug, BallCollider, RigidBodyApi} from "@react-three/rapier";
import {MarchingCube, MarchingCubes, MarchingCubesProps, MarchingPlane, Sphere, Plane} from "@react-three/drei";
import {Color, Group, Vector3} from 'three'
import * as React from "react";
import {useControls} from "leva";
import {useFrame} from "@react-three/fiber";

import {PointOctree, OctreeHelper, Node, PointOctant} from "sparse-octree";

import {MarchingCubes as MarchingCubesObj} from "three/examples/jsm/objects/MarchingCubes";
import {useEffect, useRef} from "react";
// import {Octree} from "three/examples/jsm/math/Octree";

const worldPosToRelative = (pos: Vector3, center: Vector3, scale: Vector3, toVector: Vector3) => {

    const top = new Vector3().addVectors(center, scale);
    const left = new Vector3().subVectors(center, scale);

    toVector.set(
        (pos.x - left.x) / (top.x - left.x),
        (pos.y - left.y) / (top.y - left.y),
        (pos.z - left.z) / (top.z - left.z)
    )

    return toVector;
}

export const MarchingCubeTree = ({node, root}: { node: PointOctant<any>, root: PointOctree<any> }) => {

    // useFrame(({clock}) => {
    //     console.log(node)
    // })
    if (!node) return null

    const center = new Vector3(
        // (node.min.x + node.max.x) / 2,
        // (node.min.y + node.max.y) / 2,
        // (node.min.z + node.max.z) / 2
    )
    node.getCenter(center)
    const scale = new Vector3(
        (node.max.x - node.min.x) / 1.75,
        (node.max.y - node.min.y) / 1.75,
        (node.max.z - node.min.z) / 1.75
    )

    const points = root.findPoints(center, scale.x * 5, true);

    return (node ? <group position={center}>
        {
            node?.children?.map((child, i) => <MarchingCubeTree key={i} node={child as PointOctant<any>} root={root}/>)
            ??
            node?.data?.points.map((point, i) => <Sphere key={i} position={point} args={[0.1]}/>) ??
            null
        }
        {!node.children ? <MarchingCubes
            // position={center}
           scale={scale}
        >
            {/*<MarchingPlane planeType="x"/>*/}
            <MarchingPlane planeType="y"/>
            {points.map((point, i) =>
                <MarchingCube
                    key={i}
                    position={worldPosToRelative(point.point, center, scale, new Vector3())}
                    color={new Color('#f0f')}
                    strength={1/scale.x}
                />)}
            {/*<MarchingPlane planeType="z"/>*/}
        </MarchingCubes> : null}
    </group> : null)
}

export const MarchingCubeRoot = ({root}: { root: PointOctree<any> }) => {

    const [node, setNode] = React.useState<PointOctant<any>>(null!)

    useFrame(({clock}) => {
        setNode(root?.findNodesByLevel(0).pop() as PointOctant<any>)
    })

    return <MarchingCubeTree node={node} root={root}/>
}


export const MarchingCubesScene = ({resolution, maxPolyCount, planeX, planeY, planeZ}: {
    resolution: number,
    maxPolyCount: number,
    planeX: boolean,
    planeY: boolean,
    planeZ: boolean,
}) => {
    const cubeRefOne = React.useRef<Group>()
    const cubeRefTwo = React.useRef<Group>()

    const {strength, subtract, ypos, _planeX, _planeY, _planeZ, usePhysics} = useControls("MarchingCubes", {
        strength: {min: -10, max: 10, step: 0.1, value: 0},
        subtract: {min: 0, max: 10, step: 0.1, value: 0},
        ypos: {min: 0, max: 100, step: 0.1, value: 0},
        _planeX: planeX,
        _planeY: planeY,
        _planeZ: planeZ,
        usePhysics: false
    })

    const bodyRef = React.useRef<RigidBodyApi>(null)
    const cubeRef = React.useRef<MarchingCubesObj>(null)
    const helperRef = React.useRef<OctreeHelper>()
    const octreeRef = React.useRef<PointOctree<any> | null>(null)
    const [octree, setOctree] = React.useState<PointOctree<any>>(null!)

    const [f, setF] = React.useState<number>(0)

    useFrame(({clock}) => {
        setF(clock.getElapsedTime())
    })
    //
    // useFrame(() => {
    //     if (!cubeRefOne.current || !bodyRef.current || !cubeRef.current) return
    //     const position = bodyRef.current.translation()
    //     const cubePos = cubeRef.current.position
    //
    //     worldPosToRelative(position, cubePos, cubeRef.current.scale, cubeRefOne.current.position)
    // })


    const currentPos = React.useRef<Vector3 | null>(null!)
    useFrame(({clock}) => {
        if (!octreeRef.current || !bodyRef.current || !helperRef.current) return

        // octree.current.set(bodyRef.current.translation(), bodyRef.current)

        if (!currentPos.current) {
            const newPos = bodyRef.current.translation()
            // octree.current.remove(currentPos.current)
            // currentPos.current = newPos
            // currentPos.current = bodyRef.current.translation()
            octreeRef.current.set(newPos, bodyRef.current)
            currentPos.current = newPos
        } else {
            const newPos = bodyRef.current.translation()
            const current = octreeRef.current.get(currentPos.current)
            if (current) {
                octreeRef.current.move(currentPos.current, newPos)
                currentPos.current = newPos
                // console.log('update')
            } else {
                currentPos.current = null
            }
            const depth = octreeRef.current.getDepth()
            helperRef.current.update()
        }
    })


    useFrame(({scene}) => {
        if (!octreeRef.current) return

        if (!helperRef.current) {
            helperRef.current = new OctreeHelper(octreeRef.current)
            scene.add(helperRef.current)
        }

        helperRef.current?.update()
    })

    const pos = useRef([0, 0, 0]);
    useControls("dave", {
        position: {
            value: [0, 0, 0], onChange: (value) => {
                if (!octree) return
                octree.move(new Vector3(...pos.current), new Vector3(...value));
                pos.current = value;

                // setOctree(octree)
            }
        },
    }, [octree]);

    useEffect(() => {
        const octree = new PointOctree(
            new Vector3(-10, -10, -10),
            new Vector3(10, 10, 10),
            1, 1
        )

        octree.set(new Vector3(...pos.current), 'dave')
        octree.set(new Vector3(0, 2, 3), 'thing')
        octree.set(new Vector3(0, 0, 3), 'thing')

        setOctree(octree)
        octreeRef.current = octree
    }, [])

    return (
        <>
            {usePhysics ? <RigidBody ref={bodyRef} position={[0, 1, 0]} colliders={"ball"}>
                {/*<BallCollider args={[.1]}/>*/}

                <Sphere args={[.1]} onClick={({camera}) => {
                    bodyRef.current?.applyImpulse(camera.getWorldDirection(new Vector3).multiplyScalar(.01))
                }}/>
            </RigidBody> : null}
            <MarchingCubeRoot root={octree}/>
            {/*<MarchingCubes*/}
            {/*    position={[0, ypos, 0]}*/}

            {/*    ref={cubeRef}*/}
            {/*    resolution={resolution}*/}
            {/*    maxPolyCount={maxPolyCount}*/}
            {/*    enableColors={true}*/}
            {/*>*/}

            {/*    <MarchingCube ref={cubeRefOne} color={new Color('#f0f')}/>*/}
            {/*    <MarchingCube ref={cubeRefTwo} color={new Color('#ff0')} position={[0.5, ypos, 0.5]}*/}
            {/*                  strength={strength}*/}
            {/*                  subtract={subtract}*/}
            {/*    />*/}


            {/*    {_planeX && <MarchingPlane planeType="x"/>}*/}
            {/*    {_planeY && <>*/}
            {/*        <MarchingPlane planeType="y"/>*/}
            {/*        <RigidBody lockTranslations={true} lockRotations={true}>*/}
            {/*            <Plane args={[100, 100, 1, 1]} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}/>*/}
            {/*        </RigidBody>*/}
            {/*    </>}*/}
            {/*    {_planeZ && <MarchingPlane planeType="z"/>}*/}

            {/*    <meshPhongMaterial specular={0xffffff} shininess={2} vertexColors={true}/>*/}
            {/*</MarchingCubes>*/}
        </>
    )
}