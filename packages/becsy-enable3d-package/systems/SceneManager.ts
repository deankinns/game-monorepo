import {Entity, system, System, co} from "@lastolivegames/becsy";
import {Project, Scene3D} from "enable3d";
import {ProjectComponent, SceneComponent} from "../components/Scene";
import {Render} from "./Render";
import {CameraComponent} from "../components";
import {Object3DComponent} from "../components/Obect3D";

@system(s => s.before(Render).beforeReadersOf(ProjectComponent, SceneComponent))
export class SceneManagerSystem extends System {
    //@ts-ignore
    projectObject: Project;

    scenes = this.query(q => q.with(SceneComponent).usingAll.current.write)

    initialize() {
        this.singleton.write(ProjectComponent).project = this.projectObject;

        // @ts-ignore
        for (const scene of this.projectObject.scenes) {
            this.createEntity(SceneComponent, {name: scene[0], scene: scene[1]});
        }

        this.createEntity(
            CameraComponent, {camera: this.projectObject.camera},
            // RenderComponent
        )
    }

    execute() {
        for (const entity of this.scenes.current) {
            this.updateSceneChildren(entity.hold())
        }
    }

    @co *updateSceneChildren(entity: Entity) {
        yield;
        co.scope(entity);  // scope ourselves to our very own zombie
        // co.cancelIfComponentMissing(entity);  // cancel if our zombie gets better
        co.cancelIfCoroutineStarted();
        const scene = entity.read(SceneComponent).scene.scene

        scene.traverse(e => {
            if (!e.userData.entity) {
                e.userData.entity = this.createEntity(Object3DComponent, {object: e})
            }
        })
        yield
    }
}