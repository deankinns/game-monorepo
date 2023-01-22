import {RigidBodyComponent} from "../components";
import {Entity, System, system, co} from "@lastolivegames/becsy";
import {RigidBodyApi} from "@react-three/rapier";
import {PositionComponent, ToBeDeleted,Deleter} from "becsy-package";
import {GameEntityComponent, VehicleEntityComponent, EntityManagerSystem, Vehicle, CombatSystem} from "becsy-yuka-package";
import * as THREE from "three";
import {Quaternion} from "three";
import {QuaternionToThree} from "three-package";

@system(s => s.afterWritersOf(RigidBodyComponent).inAnyOrderWith(Deleter))
export class PhysicsSystem extends System {
    bodies = this.query(q => q.with(RigidBodyComponent, PositionComponent).current.write
        .using(ToBeDeleted, GameEntityComponent).write
    );

    execute() {
        for (const entity of this.bodies.current) {
            this.updatePosition(entity);
        }
    }

    updatePosition(entity: Entity) {
        const body = entity.read(RigidBodyComponent).body;
        const position = entity.write(PositionComponent);
        const translation = body.translation();

        position.position.x = translation.x;
        position.position.y = translation.y;
        position.position.z = translation.z;

        const rotation = body.rotation();
        position.rotation.x = rotation.x;
        position.rotation.y = rotation.y;
        position.rotation.z = rotation.z;
        position.rotation.w = rotation.w;

        if (position.position.y < -10) {
            entity.add(ToBeDeleted);
        }
    }

    @co *addBody(entity: Entity, body: RigidBodyApi) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();
        entity.add(RigidBodyComponent, {body});
        yield co.waitForFrames(1);
    }
}

const UP_AXIS = new THREE.Vector3(0, 1, 0);

@system(s => s.after(EntityManagerSystem).before(PhysicsSystem))
export class RobotSystem extends System {
    robots = this.query(q => q.with(RigidBodyComponent, GameEntityComponent, VehicleEntityComponent).current.write);


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

        body.setAngvel({x: 0, y: dot * (turnSpeed < maxTurnSpeed ? 10 : .1), z: 0})
    }
}