import {Physics, RigidBody, Debug, BallCollider, RigidBodyApi} from "@react-three/rapier";
import {MarchingCube, MarchingCubes, MarchingCubesProps, MarchingPlane, Sphere, Plane} from "@react-three/drei";
import {Color, Group, Vector3} from 'three'
import * as React from "react";
import {useControls} from "leva";
import {useFrame} from "@react-three/fiber";


import {MarchingCubes as MarchingCubesObj} from "three/examples/jsm/objects/MarchingCubes";
// import {Octree} from "three/examples/jsm/math/Octree";

export const MarchingCubeTree = ({scale}: { scale: number }) => {

    return (<>
        <MarchingCubeTree scale={scale/2} key={'[0,0,0]'}/>
        <MarchingCubeTree scale={scale/2} key={'[1,0,0]'}/>
        <MarchingCubeTree scale={scale/2} key={'[0,1,0]'}/>
        <MarchingCubeTree scale={scale/2} key={'[1,1,0]'}/>
        <MarchingCubeTree scale={scale/2} key={'[0,0,1]'}/>
        <MarchingCubeTree scale={scale/2} key={'[1,0,1]'}/>
        <MarchingCubeTree scale={scale/2} key={'[0,1,1]'}/>
        <MarchingCubeTree scale={scale/2} key={'[1,1,1]'}/>
    </>)
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

    useFrame(({clock}) => {
        if (!cubeRefOne.current || !cubeRefTwo.current) return
        const time = clock.getElapsedTime()
        // cubeRefOne.current.position.set(0.5, Math.sin(time * 0.4) * 0.5 + 0.5, 0.5)
        // cubeRefTwo.current.position.set(0.5, Math.cos(time * 0.4) * 0.5 + 0.5, 0.5)
    })

    let {strength, subtract, ypos, _planeX, _planeY, _planeZ, usePhysics} = useControls("MarchingCubes", {
        strength: {min: -10, max: 10, step: 0.1, value: 0},
        subtract: {min: 0, max: 10, step: 0.1, value: 0},
        ypos: {min: 0, max: 100, step: 0.1, value: 19},
        _planeX: planeX,
        _planeY: planeY,
        _planeZ: planeZ,
        usePhysics: false
    })

    const bodyRef = React.useRef<RigidBodyApi>(null)
    const cubeRef = React.useRef<MarchingCubesObj>(null)


    const worldPosToRelative = (pos: Vector3, center: Vector3, scale: Vector3, toVector: Vector3) => {
        // const top = center.clone().multiply(scale)
        // const left = center.clone().multiply(scale).multiplyScalar(-1)
        const top = new Vector3().addVectors(center, scale)//.multiplyScalar(.5).add(pos);
        const left = new Vector3().subVectors(center, scale);

        // const relative = new Vector3().addVectors(pos, top)
        // relative.divideScalar(scale)

        toVector.set(
            (pos.x - left.x) / (top.x - left.x),
            (pos.y - left.y) / (top.y - left.y),
            (pos.z - left.z) / (top.z - left.z)
        )

        return toVector;
        //  const relative = new Vector3()
        //
        // const min = 10;
        // const max = 20;
        //
        // const point = 12;
        //
        // const rel = (point - min) / (max- min);
        //
        //
        //  return top
    }

    useFrame(({clock}) => {
        if (!cubeRefOne.current || !bodyRef.current || !cubeRef.current) return
        const position = bodyRef.current.translation()
        const cubePos = cubeRef.current.position

        const v = new Vector3();


        // cubeRefOne.current.getWorldPosition(v);

        // const cell = cubeRef.current.getCell(10, 1, 1)
        // const time = clock.getElapsedTime()
        // cubeRefOne.current.position.set(cubePos.x-position.x, cubePos.y-position.y, cubePos.z-position.z)
        // cubeRefOne.current.position.set(position.x - cubePos.x, position.y - cubePos.y, position.z - cubePos.z)
        worldPosToRelative(position, cubePos, cubeRef.current.scale, cubeRefOne.current.position)
        // cubeRefOne.current.position.copy()
    })

    return (
        <>
            {usePhysics ? <RigidBody ref={bodyRef} position={[0, 1, 0]} colliders={"ball"}>
                {/*<BallCollider args={[.1]}/>*/}

                <Sphere args={[.1]} onClick={({camera}) => {
                    bodyRef.current?.applyImpulse(camera.getWorldDirection(new Vector3).multiplyScalar(.01))
                }}/>
            </RigidBody> : null}
            <MarchingCubes
                position={[0, ypos, 0]}
                scale={20}
                ref={cubeRef}
                resolution={resolution}
                maxPolyCount={maxPolyCount}
                enableColors={true}
            >

                <MarchingCube ref={cubeRefOne} color={new Color('#f0f')}/>
                <MarchingCube ref={cubeRefTwo} color={new Color('#ff0')} position={[0.5, ypos, 0.5]}
                              strength={strength}
                              subtract={subtract}
                />


                {_planeX && <MarchingPlane planeType="x"/>}
                {_planeY && <>
                    <MarchingPlane planeType="y"/>
                    <RigidBody lockTranslations={true} lockRotations={true}>
                        <Plane args={[100, 100, 1, 1]} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}/>
                    </RigidBody>
                </>}
                {_planeZ && <MarchingPlane planeType="z"/>}

                <meshPhongMaterial specular={0xffffff} shininess={2} vertexColors={true}/>
            </MarchingCubes>
        </>
    )
}