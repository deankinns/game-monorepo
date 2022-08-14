import { component, field, Type } from "@lastolivegames/becsy";
import { MainScene } from "enable3d-package";
import { Scene } from "three";

@component
export class SceneComponent {
  @field(Type.object) declare scene: Scene;
  @field(Type.dynamicString(20)) declare name: string;
}
