import {component, field, Type} from "@lastolivegames/becsy";

// export class Vector3 {
//     x: number = 0;
//     y: number = 0;
//     z: number = 0;
//
//     // add(that: Vector3): void {
//     //     this.x += that.x;
//     //     this.y += that.y;
//     //     this.z += that.z;
//     // }
//
//     // toJSON() {
//     //     return this.x + ', ' + this.y + ', ' + this.z;
//     // }
// }

// export const v3Type = Type.vector(Type.float64, ["x", "y", "z"], Vector3);

@component
export class PositionComponent {
    @field.float64.vector(['x', 'y', 'z'])
    declare position: [number, number, number] & { x: number, y: number, z: number };
    @field.float64.vector(['x', 'y', 'z', 'w'])
    declare rotation: [number, number, number, number] & { x: number, y: number, z: number, w: number };

    setPosition(x: number, y: number, z: number) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    setRotation(x: number, y: number, z: number, w: number) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
        this.rotation.w = w;
    }
}

@component
export class VelocityComponent {
    @field.float64.vector(['x', 'y', 'z'])
    declare velocity: [number, number, number] & { x: number, y: number, z: number };
    @field.float64.vector(['x', 'y', 'z'])
    declare angularVelocity: [number, number, number] & { x: number, y: number, z: number };

    setVelocity(x: number, y: number, z: number) {
        this.velocity.x = x;
        this.velocity.y = y;
        this.velocity.z = z;
    }

    setAngularVelocity(x: number, y: number, z: number) {
        this.angularVelocity.x = x;
        this.angularVelocity.y = y;
        this.angularVelocity.z = z;
    }
}
