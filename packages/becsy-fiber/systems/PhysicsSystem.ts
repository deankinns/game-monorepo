import {RigidBodyComponent} from "../components";
import {co, Entity, system, System} from "@lastolivegames/becsy";
import {RigidBodyApi} from "@react-three/rapier";
import {Deleter, PositionComponent, ToBeDeleted} from "becsy-package";
import {GameEntityComponent} from "becsy-yuka-package";
import {useRapier} from "@react-three/rapier";

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

        if (body.raw().isSleeping()) return;

        const translation = body.translation();
        if (translation.length() === 0) return;

        if (translation.y < -100) {
            body.setTranslation({
                x: translation.x,
                y: 100,
                z: translation.z
            });
        }


        position.position.x = translation.x;
        position.position.y = translation.y;
        position.position.z = translation.z;

        const rotation = body.rotation();
        position.rotation.x = rotation.x;
        position.rotation.y = rotation.y;
        position.rotation.z = rotation.z;
        position.rotation.w = rotation.w;
    }

    @co *addBody(entity: Entity, body: RigidBodyApi) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();

        if (entity.has(RigidBodyComponent)) {
            entity.write(RigidBodyComponent).body = body;
        }  else{
            entity.add(RigidBodyComponent, {body});
        }
        if (entity.has(PositionComponent)) {
            body.setTranslation(entity.read(PositionComponent).position);
        }


        yield co.waitForFrames(1);
    }

    @co *removeBody(entity: Entity) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();
        co.cancelIfComponentMissing(RigidBodyComponent);

        if (!entity || !entity.__valid || !entity.alive) return co.cancel();
        if (!entity.has(RigidBodyComponent)) return co.cancel();

        const body = entity.read(RigidBodyComponent).body;
        body.raw().sleep();

        entity.remove(RigidBodyComponent);
        yield co.waitForFrames(1);
    }
}

