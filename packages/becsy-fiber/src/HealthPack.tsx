import {Entity} from "@lastolivegames/becsy";
import React, {useEffect, useRef} from "react";
import {RigidBody, RigidBodyApi} from "@react-three/rapier";
import {Box} from "@react-three/drei";
import {PhysicsSystem} from "../systems";
import {useEcsStore, useSystem} from "react-becsy";
import {PositionComponent} from "becsy-package";
import {QuaternionToThree} from "three-package";
import {useObject3dComponent, useRigidBodyComponent} from "./useRigidBodyComponent";


export const HealthPack = (props: {
    entity: Entity;
}) => {
    const bodyRef = useRef<RigidBodyApi>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);
    const selectEntity = useEcsStore((state) => state.selectEntity);
    // const physicsSystem = useSystem(PhysicsSystem) as PhysicsSystem;
    //
    // useEffect(() => {
    //     if (bodyRef.current) {
    //         bodyRef.current.setTranslation(props.entity.read(PositionComponent).position);
    //         bodyRef.current.setRotation(QuaternionToThree(props.entity.read(PositionComponent).rotation));
    //         physicsSystem.addBody(props.entity, bodyRef.current);
    //     }
    // },[physicsSystem, props.entity])
    useRigidBodyComponent(props.entity, bodyRef)
    useObject3dComponent(props.entity, meshRef)

    return <RigidBody
        ref={bodyRef}
    >
        <Box
            ref={meshRef}
            args={[1, 0.5, 0.8]}
            onClick={ev => {
                selectEntity(props.entity);
                ev.stopPropagation();
            }}>
            <meshStandardMaterial color={"orange"}/>
        </Box>
    </RigidBody>

};