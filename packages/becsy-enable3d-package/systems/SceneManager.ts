import { Entity, system, System, co } from "@lastolivegames/becsy";

import { SceneComponent } from "../components/Scene";
// import {Render} from "./Render";
import { CameraComponent } from "../components";
import { Object3DComponent } from "../components/Obect3D";
import { HealthSystem, Render } from "becsy-package";
import { Scene } from "three";

@system((s) =>
  s.before(Render).beforeReadersOf(SceneComponent).after(HealthSystem)
)
export class SceneManagerSystem extends System {
  //@ts-ignore
  sceneObject: Scene;

  scene = this.singleton.write(SceneComponent);

  objects = this.query((q) => q.usingAll.read.with(Object3DComponent).write);

  initialize() {
    this.scene.scene = this.sceneObject;
  }

  execute() {
    // for (const scene of this.projectObject.scenes) {
    //     const currentScene = this.scene;
    //     if (scene[1] !== currentScene.scene && scene[1].isRunning()) {
    //         this.scene.scene = scene[1]
    //     }
    // }

    this.updateSceneChildren();
  }

  //@ts-ignore
  @co *updateSceneChildren() {
    const sceneObj = this.scene?.scene;
    yield;
    co.cancelIfCoroutineStarted();
    co.cancelIf(() => !sceneObj);

    sceneObj?.traverse((e) => {
      if (
        e.userData.entity &&
        e.userData.entity.alive &&
        !e.userData.entity.has(Object3DComponent)
      ) {
        // e.userData.entity = this.createEntity(Object3DComponent, {object: e}).hold()
        e.userData.entity.add(Object3DComponent, { object: e });
      }
    });
    yield co.waitForFrames(100);
  }
}
