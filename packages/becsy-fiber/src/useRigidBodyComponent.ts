import {useSystem} from "react-becsy";
import {PhysicsSystem} from "../systems";
import {MutableRefObject, Ref, useEffect} from "react";
import {Entity} from "@lastolivegames/becsy";
import {RigidBodyApi} from "@react-three/rapier";
import {PositionComponent} from "becsy-package";
import {QuaternionToThree} from "three-package";
import {Object3D} from "three";
import {Object3DSystem} from "../systems/Object3DSystem";

export const useRigidBodyComponent = (entity: Entity, body: MutableRefObject<RigidBodyApi>) => {
    const physicsSystem = useSystem(PhysicsSystem) as PhysicsSystem;

    useEffect(() => {
        if (body.current) {
            body.current.setTranslation(entity.read(PositionComponent).position);
            body.current.setRotation(QuaternionToThree(entity.read(PositionComponent).rotation));
            physicsSystem.addBody(entity, body.current);
        }
    }, [entity, physicsSystem, body])
}

export const useObject3dComponent = (entity: Entity, object3d: MutableRefObject<Object3D>) => {
    const object3dSystem = useSystem(Object3DSystem) as Object3DSystem;

    useEffect(() => {
        if (object3d.current) {
            object3dSystem.addObject3d(entity, object3d.current);
        }
    } , [entity, object3dSystem, object3d])
}