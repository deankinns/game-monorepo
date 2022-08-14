import { component, Entity, field } from "@lastolivegames/becsy";
import { v3Type, Vector3 } from "./MovingEntity";

@component
export class Target {
  @field.ref declare value: Entity;
  @field(v3Type) declare position: Vector3;
}

@component
export class Selected {
  @field.backrefs(Target, "value") declare by: Entity[];
}
