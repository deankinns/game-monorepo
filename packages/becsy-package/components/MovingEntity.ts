import {component, field, Type} from "@lastolivegames/becsy";

class Vector3 {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    add(that: Vector3): void {
        this.x += that.x;
        this.y += that.y;
        this.z += that.z;
    }
}

const v3Type = Type.vector(Type.float64, ['x', 'y', 'z'], Vector3);

@component export class MovingEntity {
    @field(v3Type) declare position: Vector3;
    @field(v3Type) declare velocity: Vector3;
}