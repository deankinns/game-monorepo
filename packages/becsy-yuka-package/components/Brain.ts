import { component, field, Type } from "@lastolivegames/becsy";
import { Regulator, Think } from "yuka";
import { GameEntity, MovingEntity, Vehicle } from "yuka-package";

@component
export class BrainComponent {
  @field(Type.object) declare object: Think<
    GameEntity | MovingEntity | Vehicle
  >;
  @field(Type.object) declare regulator: Regulator;
}
