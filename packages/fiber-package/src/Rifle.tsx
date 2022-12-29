import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
// import {GLBLoader} from 'three/examples/jsm/loaders/GLBLoader'
import {useGraph, useLoader} from '@react-three/fiber'
import * as React from "react";
import {useTexture, useFBX, useGLTF} from "@react-three/drei";
import {useEffect, useMemo} from "react";
import {Mesh} from 'three';


// const modelUrl = new URL(`../../../assets/models/AssaultRifle_01.obj`, import.meta.url).toString()
// const modelUrl = new URL(`../../../assets/models/MK14.fbx`, import.meta.url).toString()
const modelUrl = new URL(`../../../assets/models/Assault Rifle.glb`, import.meta.url).toString()
// const textureUrl = new URL(`../../../assets/models/AssaultRifle_01.mtl`, import.meta.url).toString()
// @ts-ignore
// useFBX.preload(modelUrl)
// useLoader.preload(MTLLoader, textureUrl)
useGLTF.preload(modelUrl)

export const Rifle = ({onClick = () => null}) => {
    const obj = useGLTF(modelUrl)
    const model = useMemo(() => obj.scene.clone(), [obj])

    useEffect(() => {
        model.scale.set(0.5, 0.5, 0.5);
        model.rotateY(Math.PI);
    }, [])
    return <primitive object={model} onClick={onClick}/>
    // const obj = useLoader(OBJLoader, modelUrl)
    // const materials = useLoader(MTLLoader, textureUrl)

    // const geometry = useMemo(() => {
    //     let g;
    //     obj.traverse((c) => {
    //         if (c.type === "Mesh") {
    //             const _c = c as Mesh;
    //             g = _c.geometry;
    //         }
    //     });
    //     return g;
    // }, [obj]);
    // const object = useLoader(OBJLoader, modelUrl, loader => {
    //     materials.preload()
    //     loader.setMaterials(materials)
    // })
    // return <primitive object={object} />

    //
    // const material = useLoader(MTLLoader, textureUrl)
    // const object = useLoader(OBJLoader, modelUrl, loader => {
    //     material.preload()
    //     loader.setMaterials(material)
    // })
    // const { nodes, materials } = useGraph(object)
    // // const m = materials.undefined[1]
    // return <mesh
    //     onClick={onClick}
    //     geometry={nodes['AssaultRIfle_01_Cube.002']?.geometry}>
    //     <meshPhongMaterial copy={materials.undefined[0]} />
    //     <meshPhongMaterial copy={materials.undefined[1]} />
    //     <meshPhongMaterial copy={materials.undefined[2]} />
    // </mesh>

    //
    // const materialLoader = new MTLLoader().setPath('./model/').load(textureUrl);
    // const objLoader = new OBJLoader().setMaterials(materialLoader).load(modelUrl);
    // return <primitive object={objLoader} />;
}