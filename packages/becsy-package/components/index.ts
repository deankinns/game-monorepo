import { component, field } from "@lastolivegames/becsy";

export * from "./MovingEntity";
export * from "./Mouse";
export * from "./Keyboard";
export * from "./Selected";
export * from "./Health";
export * from "./State";

@component
export class RenderComponent {
  @field.dynamicString(20) declare name: string;
}

@component
export class ToBeDeleted {}
