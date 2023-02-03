import {co, Entity, system, System} from "@lastolivegames/becsy";
import {Object3DComponent} from "../components";
import {Object3D} from "three";
import {PhysicsSystem} from "./PhysicsSystem";
import {Inventory, PositionComponent, State, Target} from "becsy-package";
import {GameEntityComponent, MemoryComponent} from "becsy-yuka-package";

@system(s => s.afterWritersOf(Object3DComponent).inAnyOrderWith(PhysicsSystem))
export class Object3DSystem extends System {

    objects = this.query(q => q
        .using(Target, PositionComponent, MemoryComponent, GameEntityComponent, Inventory, State).read
        .with(Object3DComponent).current.write
    );

    execute() {
        // console.log('Object3DSystem');
        // for (const entity of this.objects.current) {
        //     // console.log('Object3DSystem', entity);
        // }
    }

    @co *addObject3d(entity: Entity, current: Object3D) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();

        if (entity.has(Object3DComponent)) {
            entity.write(Object3DComponent).object = current;
        } else {
            entity.add(Object3DComponent, {object: current});
        }

        yield co.waitForFrames(1);
    }

    @co *removeObject3d(entity: Entity) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();

        if (!entity.__valid || !entity.alive) return co.cancel();
        if (!entity.has(Object3DComponent)) return co.cancel();

        entity.remove(Object3DComponent);
        yield co.waitForFrames(1);
    }
}