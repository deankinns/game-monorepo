import {system, System} from "@lastolivegames/becsy";
import {Render} from "./Render";
import {Object3DComponent} from "../components/Obect3D";
import {PhysicsBodyComponent} from "../components/PhysicsBody";
import {SceneManagerSystem} from "./SceneManager";
import {ProjectComponent} from "../components/Scene";

@system(s => s.before(Render).after(SceneManagerSystem))
export class PhysicsSystem extends System {

    init = this.query(q => q.with(Object3DComponent).without(PhysicsBodyComponent).current.write)
    bodies = this.query(q => q.with(PhysicsBodyComponent).added.removed.write)

    project = this.singleton.read(ProjectComponent);

    execute() {
        for (const entity of this.init.current) {
            const obj = entity.read(Object3DComponent).object
            if (!entity.has(PhysicsBodyComponent) && obj.body) {
                entity.add(PhysicsBodyComponent, {body: obj.body});
            }
        }

        for (const entity of this.bodies.added) {
            if (entity.has(Object3DComponent)) {
                const obj = entity.read(Object3DComponent).object
                if (!obj.body) {
                    this.project.project.physics.add.existing(obj.body)
                }
            }
            // if ()
        }

        this.accessRecentlyDeletedData(true)

        for (const entity of this.bodies.removed) {
            const body = entity.read(PhysicsBodyComponent).body
            this.project.project.physics.destroy(body)
        }
    }
}