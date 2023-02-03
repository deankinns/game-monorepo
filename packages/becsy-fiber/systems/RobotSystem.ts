import * as THREE from "three";
import {Entity, System, system} from "@lastolivegames/becsy";
import {RigidBodyComponent} from "../components";
import {PhysicsSystem} from "./PhysicsSystem";
import {EntityManagerSystem, GameEntityComponent, Vehicle, VehicleEntityComponent} from "becsy-yuka-package";
import {QuaternionToThree} from "three-package";
import {Inventory, PositionComponent, State, VelocityComponent} from "becsy-package";
import {Vector3} from "three";

export const UP_AXIS = new THREE.Vector3(0, 1, 0);

@system(s => s.after(EntityManagerSystem).before(PhysicsSystem))
export class RobotSystem extends System {
    robots = this.query(q => q
        .using(PositionComponent, Inventory, State, VelocityComponent).write
        .with(RigidBodyComponent, GameEntityComponent, VehicleEntityComponent).current.write);


    execute() {
        for (const entity of this.robots.current) {
            this.updateForces(entity);
        }
    }

    updateForces(entity: Entity) {
        const vehicle = entity.read(GameEntityComponent).entity as Vehicle;
        const body = entity.read(RigidBodyComponent).body;
        const airborne = false;

        const currentVel = body.linvel();
        const newImpulse = new THREE.Vector3(
            vehicle.velocity.x * (airborne ? 0.1 : 1),
            currentVel.y,
            vehicle.velocity.z * (airborne ? 0.1 : 1)
        )
        newImpulse.sub(currentVel)
        newImpulse.clampLength(-1, 1)

        body.applyImpulse(newImpulse)

        const v1 = new THREE.Vector3(0, 0, 1);
        v1.applyQuaternion(body.rotation())

        const v2 = new THREE.Vector3(0, 0, 1);
        v2.applyQuaternion(QuaternionToThree(vehicle.rotation))

        const currentDir = v1.normalize().cross(UP_AXIS);
        const targetDir = v2.normalize();
        const dot = currentDir.dot(targetDir) * -1;

        const turnSpeed = body.angvel().length()
        const maxTurnSpeed = vehicle.maxTurnRate;

        // console.log("turn",{x: 0, y: dot * (turnSpeed < maxTurnSpeed ? 10 : .1), z: 0}, {x,y,z})

        body.setAngvel({x: 0, y: dot * (turnSpeed < maxTurnSpeed ? 10 : .1), z: 0})
        // body.resetTorques()

        // body.addTorque(t)
        // body.setAngvel(t)
    }
}