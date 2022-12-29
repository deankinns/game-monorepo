import {Entity} from "@lastolivegames/becsy";
import React, {useRef} from "react";
import {RigidBody, RigidBodyApi} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {Box} from "@react-three/drei";

import {GameEntityComponent} from 'becsy-yuka-package';
import {Vector3ToYuka, QuaternionToYuka} from 'yuka-package'


export const HealthPack = (props: {
    entity: Entity;
    onClick: any;
    position?: any;
}) => {
    const bodyRef = useRef<RigidBodyApi>(null);
    const gameEntity = props.entity.read(GameEntityComponent).entity;

    useFrame(() => {
        if (bodyRef.current) {
            Vector3ToYuka(bodyRef.current?.translation(), gameEntity.position)
            QuaternionToYuka(bodyRef.current?.rotation(), gameEntity.rotation);
        }
    })

    return <RigidBody
        ref={bodyRef}
        position={[
            gameEntity.position.x,
            gameEntity.position.y,
            gameEntity.position.z,
        ]}
        ccd={true}
    >
        <Box args={[1, 0.5, 0.8]} onClick={props.onClick}>
            <meshStandardMaterial color={"orange"}/>
        </Box>
    </RigidBody>

};