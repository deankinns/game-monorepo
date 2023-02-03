import {Entity} from "@lastolivegames/becsy";
import React, {useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {GameEntityComponent} from "becsy-yuka-package";
import {Vector3ToThree,QuaternionToThree} from "three-package";
import {Sphere} from "@react-three/drei";

export const GameEntityHelper = ({e}: { e: Entity }) => {
    const ref = useRef<THREE.Group>(null!);
    const gameEntity = e.read(GameEntityComponent).entity;

    useFrame(() => {
        if (e.__valid && e.alive && e.has(GameEntityComponent)) {
            // const gameEntity = e.read(GameEntityComponent).entity;
            // const {position, rotation} = e.read(PositionComponent);
            Vector3ToThree(gameEntity.position, ref.current.position);
            QuaternionToThree(gameEntity.rotation, ref.current.quaternion);
        }
    })

    return <group
        ref={ref}
    >
        <axesHelper
            key={e.__id}
            args={[10]}
        />
        <Sphere args={[gameEntity.boundingRadius]} >
            <meshBasicMaterial color={'red'} wireframe={true}/>
        </Sphere>
        <Sphere args={[gameEntity.neighborhoodRadius]} >
            <meshBasicMaterial color={'green'} wireframe={true}/>
        </Sphere>
    </group>
}