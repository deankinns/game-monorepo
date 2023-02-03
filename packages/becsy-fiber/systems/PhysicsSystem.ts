import {RigidBodyComponent} from "../components";
import {co, Entity, system, System} from "@lastolivegames/becsy";
import {RigidBodyApi} from "@react-three/rapier";
import {Deleter, PositionComponent, ToBeDeleted} from "becsy-package";
import {GameEntityComponent} from "becsy-yuka-package";

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

        if (entity.has(RigidBodyComponent)) {
            entity.write(RigidBodyComponent).body = body;
        }  else{
            entity.add(RigidBodyComponent, {body});
        }

        yield co.waitForFrames(1);
    }

    @co *removeBody(entity: Entity) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();
        co.cancelIfComponentMissing(RigidBodyComponent);

        if (!entity || !entity.__valid || !entity.alive) return co.cancel();
        if (!entity.has(RigidBodyComponent)) return co.cancel();

        entity.remove(RigidBodyComponent);
        yield co.waitForFrames(1);
    }
}

