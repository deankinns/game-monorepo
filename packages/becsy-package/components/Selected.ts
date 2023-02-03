import { component, Entity, field } from "@lastolivegames/becsy";
// import { v3Type, Vector3 } from "./MovingEntity";

@component
export class Target {
  @field.ref declare value: Entity;
  @field.float64.vector(['x', 'y', 'z'])
  declare position: [number, number, number] & { x: number, y: number, z: number };
}

@component
export class Selected {
  @field.backrefs(Target, "value") declare by: Entity[];
}
