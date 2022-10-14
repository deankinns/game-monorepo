import React, {useContext, useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {PointerLockControls} from "@react-three/drei";

import {Target, PositionComponent} from "becsy-package";
import {VehicleEntityComponent, Vehicle, GameEntityComponent,Vector3ToYuka,QuaternionToYuka } from "becsy-yuka-package";
import {PlayerContext} from "./PlayerContext";
import {usePersonControls} from "fiber-package";

export const FirstPersonControls = () => {
    const firstPersonRef = useRef<{ camera: THREE.Camera } | any>(null!);
    const {forward, backward, left, right, jump} = usePersonControls()
    const player = useContext(PlayerContext);
    useFrame((state) => {
        if (player.player?.has(Target)) {
            const selected = player.player.read(Target).value
            const position = selected.read(PositionComponent).position;
            // @ts-ignore
            firstPersonRef.current?.camera.position.set(position.x, position.y, position.z);

            if (selected.has(VehicleEntityComponent)) {
                const vehicle = selected.read(GameEntityComponent).entity as Vehicle;
                // const movement = selected.read(MovingEntity).velocity;
                const dir = new THREE.Vector3();
                state.camera.getWorldDirection(dir)
                // const left = dir.cross(new THREE.Vector3(0, 1, 0)).normalize();
                const strafe = new THREE.Vector3(0, 1, 0).cross(dir).normalize().multiplyScalar((left ? 1 : right ? -1 : 0) * 10);

                dir.multiplyScalar((forward ? 1 : backward ? -1 : 0) * 10)

                dir.add(strafe);

                // (right ? 1 : left ? -1 : 0) * dir.x,
                // (backward ? 1 : forward ? -1 : 0) * dir.y,
                // (left ? 1 : right ? -1 : 0) *  dir.z

                // vehicle.velocity.set(
                //     dir.x, dir.y, dir.z
                // );
                Vector3ToYuka(dir, vehicle.velocity);

                QuaternionToYuka(firstPersonRef.current.camera.getWorldQuaternion(new THREE.Quaternion()), vehicle.rotation);
                // vehicle.lookAt(forward)
                // const position = vehicle.read(PositionComponent).position;
                // firstPersonRef.current?.camera.position.set(position.x, position.y, position.z);

            }
        }

        state.camera.near = 1;
    })
    return <PointerLockControls ref={firstPersonRef}/>
}