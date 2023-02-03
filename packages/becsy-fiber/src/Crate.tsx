import {Entity} from "@lastolivegames/becsy";
import React, {useRef} from "react";
import {RigidBody, RigidBodyApi} from "@react-three/rapier";
import * as THREE from "three";
import {Box} from "@react-three/drei";
import {Obstacle} from "becsy-yuka-package";
import {PositionComponent} from "becsy-package";
import {useEcsStore} from "react-becsy";
import {useRigidBodyComponent, useObject3dComponent} from 'becsy-fiber'

export const Crate = ({entity}: { entity: Entity }) => {
    const {height, width, depth} = entity.read(Obstacle);
    const {x, y, z} = entity.read(PositionComponent).position;
    const selectEntity = useEcsStore((state) => state.selectEntity);
    const bodyRef = useRef<RigidBodyApi>(null!);
    const meshRef = useRef<THREE.Object3D>(null!);

    useRigidBodyComponent(entity, bodyRef)
    useObject3dComponent(entity, meshRef)

    return <RigidBody
        position={[x, y, z]}
        ref={bodyRef}
    ><Box
        ref={meshRef}
        onClick={(ev: any) => {
            selectEntity(entity);
            ev.stopPropagation();
        }}
        args={[width, height, depth]}
    /></RigidBody>
}