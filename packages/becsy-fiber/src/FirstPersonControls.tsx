import React, {useContext, useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {PointerLockControls} from "@react-three/drei";

import {Target, PositionComponent} from "becsy-package";
import {VehicleEntityComponent, Vehicle, GameEntityComponent,Vector3ToYuka,QuaternionToYuka } from "becsy-yuka-package";
// import {PlayerContext} from "./PlayerContext";
import {usePersonControls} from "fiber-package";
import {RefComponent, useEcsStore} from "react-becsy";
import {RigidBodyApi} from "@react-three/rapier";
import {Entity} from "@lastolivegames/becsy";


class ThirdPersonCamera {
    private _params: any;
    private _camera: any;
    private _currentPosition: THREE.Vector3;
    private _currentLookat: THREE.Vector3;
    constructor(params: { camera: any; target?: RigidBodyApi; }) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }

    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-1.5, 2.0, -3.0);
        idealOffset.applyQuaternion(this._params.target.rotation());
        idealOffset.add(this._params.target.translation());
        return idealOffset;
    }

    _CalculateIdealLookat(yOffset = 0.0) {
        const idealLookat = new THREE.Vector3(0, 1.0 + yOffset, 5.0);
        idealLookat.applyQuaternion(this._params.target.rotation());
        idealLookat.add(this._params.target.translation());
        return idealLookat;
    }

    Update(timeElapsed: number, yOffset = 0.0) {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookat = this._CalculateIdealLookat(yOffset);

        //const t = 1;
        const t = 4.0 * timeElapsed;
        // const t = 1.0 - Math.pow(0.001, timeElapsed);

        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}

export const FirstPersonControls = ({entity}: {entity: Entity}) => {
    const firstPersonRef = useRef<{ camera: THREE.Camera } | any>(null!);
    const {forward, backward, left, right, jump} = usePersonControls()
    // const player = useContext(PlayerContext);
    // const selected = useEcsStore(state => state.selectedEntity);
    const selected = entity

    // const thirdPersonCamera = useRef<ThirdPersonCamera>();

    useFrame((state, delta) => {
        // if (!thirdPersonCamera.current && selected) {
        //     const r = selected.read(RefComponent).ref.current;
        //
        //     thirdPersonCamera.current = new ThirdPersonCamera({
        //         camera:state.camera, target: r.body
        //     })
        // }
        //
        // thirdPersonCamera.current?.Update(delta, 0);


        if (selected) {
            // const selected = player.player.read(Target).value
            const position = selected.read(PositionComponent).position;
            // @ts-ignore

            firstPersonRef.current?.camera.position.set(position.x, position.y+2, position.z);

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
                const rot = new THREE.Quaternion();
                state.camera.getWorldQuaternion(rot);

                rot.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI))

                Vector3ToYuka(dir, vehicle.velocity);



                QuaternionToYuka(rot, vehicle.rotation);
                // vehicle.lookAt(forward)
                // const position = vehicle.read(PositionComponent).position;
                // firstPersonRef.current?.camera.position.set(position.x, position.y, position.z);

            }
        }

        state.camera.near = .9;
    })
    return <PointerLockControls ref={firstPersonRef}/>
}