import {Entity} from "@lastolivegames/becsy";
import {RigidBody} from "@react-three/rapier";
import {Box} from "@react-three/drei";
import React from "react";
import {GameEntityComponent} from "becsy-yuka-package";

export const Rifle = (props: { entity: Entity; onClick: any; position?: any }) => {
    const gameEntity = props.entity.read(GameEntityComponent).entity;

    return <RigidBody
        position={[
            gameEntity.position.x,
            gameEntity.position.y,
            gameEntity.position.z,
        ]}
    >
        <Box args={[0.1, 0.1, 0.8]} onClick={props.onClick}>
            <meshStandardMaterial color={"orange"}/>
        </Box>
    </RigidBody>
}