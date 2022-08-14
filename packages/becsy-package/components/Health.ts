import { component, field, Type } from "@lastolivegames/becsy";

@component
export class Health {
  @field({ type: Type.int8, default: 50 }) declare health: number;
  @field({ type: Type.int8, default: 100 }) declare maxHealth: number;
}

@component
export class Healing {
  @field({ type: Type.int8, default: 50 }) declare amount: number;
}
