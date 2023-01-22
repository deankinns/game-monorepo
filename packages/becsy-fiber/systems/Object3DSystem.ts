import {co, Entity, system, System} from "@lastolivegames/becsy";
import {Object3DComponent, RigidBodyComponent} from "../components";
import {Object3D} from "three";
import {PhysicsSystem} from "./PhysicsSystem";

@system(s => s.afterWritersOf(Object3DComponent).inAnyOrderWith(PhysicsSystem))
export class Object3DSystem extends System {

    objects = this.query(q => q.with(Object3DComponent).current.write);

    execute() {
        // console.log('Object3DSystem');
        // for (const entity of this.objects.current) {
        //     // console.log('Object3DSystem', entity);
        // }
    }

    @co *addObject3d(entity: Entity, current: Object3D) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();
        entity.add(Object3DComponent, {object: current});
        yield co.waitForFrames(1);
    }
}