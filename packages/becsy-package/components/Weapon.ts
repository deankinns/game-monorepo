import {component, field, Type} from "@lastolivegames/becsy";

@component
export class Weapon {
    @field({type: Type.dynamicString(32), default: "Weapon"}) declare name: string;
    @field({type: Type.dynamicString(32), default: "Weapon"}) declare type: string;

    @field({type: Type.dynamicString(32), default: "ready"}) declare state: string;

    @field({type: Type.float32, default: 1}) declare damage: number;

    @field({type: Type.float32, default: 1}) declare ammo: number;
    @field({type: Type.float32, default: 1}) declare maxAmmo: number;

    @field({type: Type.float32, default: 0.1}) declare warmUp: number;
    @field({type: Type.float32, default: .5}) declare coolDown: number;

    @field({type: Type.float32, default: 2.5}) declare reloadTime: number;

    // @field({type: Type.object, default: false}) declare fire: () => void;
    // @field({type: Type.object, default: false}) declare reload: () => void;
}

@component
export class Projectile {
    @field({type: Type.dynamicString(32), default: "Projectile"}) declare name: string;
    @field({type: Type.dynamicString(32), default: "Projectile"}) declare type: string;

    @field({type: Type.float32, default: 1}) declare damage: number;
}