import { component, field, Type } from "@lastolivegames/becsy";

export class Vector3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  // add(that: Vector3): void {
  //     this.x += that.x;
  //     this.y += that.y;
  //     this.z += that.z;
  // }

  // toJSON() {
  //     return this.x + ', ' + this.y + ', ' + this.z;
  // }
}

export const v3Type = Type.vector(Type.float64, ["x", "y", "z"], Vector3);

@component
export class PositionComponent {
  @field.float64.vector(['x', 'y', 'z'])
  declare position: [number, number, number] & {x: number, y: number, z: number} & Vector3;
  @field.float64.vector(['x', 'y', 'z', 'w'])
  declare rotation: [number, number, number, number] & {x: number, y: number, z: number, w: number};
}

@component
export class MovingEntity {
  @field.float64.vector(['x', 'y', 'z'])
  declare velocity:  [number, number, number] & {x: number, y: number, z: number};
  @field.float64.vector(['x', 'y', 'z'])
  declare angularVelocity: [number, number, number] & {x: number, y: number, z: number};
}
