import {component, field, Type} from "@lastolivegames/becsy";
import {MainScene} from "enable3d-package";
import {Project} from "enable3d";

@component
export class ProjectComponent{
    @field.object declare project: Project;
}

@component
export class SceneComponent{
    @field(Type.object) declare scene: MainScene;
    @field(Type.dynamicString(20)) declare name: string;
}