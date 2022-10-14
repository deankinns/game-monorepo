import {BufferAttribute, Vector3} from "three";
import React, {Suspense, useEffect, useRef, useState} from "react";
import {HeightfieldCollider, RigidBody} from "@react-three/rapier";
import WireframeMaterial from "./materials/WireframeMaterial";
import MountainMaterial from "./materials/MountainMaterial";

export const TerrainChunk = ({wireframe = true, width = 1, offset = {x: 0, y: 0}, resolution = 1, noise}: any) => {
    const size = new Vector3(width, 1, width);
    const ref = useRef<any>(null);
    const [physics, setPhysics] = useState(false);
    const [points, setPoints] = useState<number[]>(Array.from({length: resolution ** 2}, () => 0));

    const GenerateHeight = (v: Vector3) => {

        const heightPairs = [];
        let normalization = 0;
        let z = 0;
        for (let gen of [noise, {Get: (x: number, y: number) => [0, 1]}]) {
            heightPairs.push(gen.Get(v.x + offset.x, -v.y + offset.y));
            normalization += heightPairs[heightPairs.length - 1][1];
        }

        if (normalization > 0) {
            for (let h of heightPairs) {
                z += h[0] * h[1] / normalization;
            }
        }

        return z;
    }

    useEffect(() => {
        if (ref.current) {

            const p = [];
            const vertices = ref.current.geometry.getAttribute('position') as BufferAttribute;
            const columsRows = new Map();
            for (let i = 0, j = 0; i < (resolution + 1) ** 2; i++) {
                // @ts-ignore
                vertices.array[i * 3 + 2] = GenerateHeight(new Vector3(vertices.array[i * 3], vertices.array[i * 3 + 1], 0));
                if (i % (resolution + 1) === 0) {
                    j++;
                }
                if (!columsRows.get(j - 1)) {
                    columsRows.set(j - 1, new Map());
                }
                columsRows.get(j - 1).set(i - ((j - 1) * (resolution + 1)), vertices.array[i * 3 + 2]);
            }

            ref.current.geometry.setAttribute("position", vertices);
            //
            ref.current.geometry.attributes.position.needsUpdate = true;
            ref.current.geometry.computeVertexNormals();
            // store height data into column-major-order matrix array
            for (let i = 0; i <= resolution; ++i) {
                for (let j = 0; j <= resolution; ++j) {
                    p.push(columsRows.get(j).get(i));
                }
            }
            setPoints(p);
            setPhysics(true)
        }
    }, [width, noise, offset, resolution]);

    // useControls('Terrain', {
    //     physics: button(() => setPhysics(true)),
    // })
    //
    // useEffect(() => {
    //     setPhysics(true)
    // }, [physics])

    return <>
        {/*{console.log('render')}*/}
        <RigidBody type={'fixed'} colliders={false} position={[offset.x, 0, offset.y]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} ref={ref}>
                <planeGeometry args={[size.x, size.z, resolution, resolution]}/>
                <Suspense fallback={<WireframeMaterial/>}>
                    {wireframe ? <WireframeMaterial/> : <MountainMaterial/>}
                </Suspense>
            </mesh>
            {physics && width < 1000 ? <HeightfieldCollider args={[
                resolution, resolution, points, size
            ]}/> : null}
        </RigidBody>
    </>
}