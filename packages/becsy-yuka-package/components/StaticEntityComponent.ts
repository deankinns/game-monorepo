import { GameEntity, MovingEntity, Vehicle } from "yuka-package";
import { component, field, Type } from "@lastolivegames/becsy";
import { Vector3 } from "yuka";

// const v3Type = Type.vector(Type.float64, ['x', 'y', 'z'], Vector3);

@component
export class StaticEntityComponent {
  // @field.object declare entity: GameEntity;
}

@component
export class MovingEntityComponent {
  // @field.object declare entity: MovingEntity;
}

@component
export class VehicleEntityComponent {
  // @field.object declare entity: Vehicle;
}
