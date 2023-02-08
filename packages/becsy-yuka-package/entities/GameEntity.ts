import {GameEntity as BaseGameEntity, Quaternion, Vector3} from "yuka";
import {Entity} from "@lastolivegames/becsy";
import {PositionComponent} from "becsy-package";
import {Vector3ToYuka, QuaternionToYuka} from "yuka-package";

const tempVector = new Vector3();
const tempQuaternion = new Quaternion();

export class GameEntity extends BaseGameEntity {
    constructor(public components: Entity) {
        super();
    }

    // pos: Vector3 = new Vector3();
    // rot: Quaternion = new Quaternion();

    handleMessage(telegram: {
        message: any;
        sender: any;
        receiver: any;
    }): boolean {
        return telegram.message(telegram.sender, telegram.receiver);
    }

    // public position = () => this.pos;


    // // @ts-ignore
    // get position(): Vector3 {
    //     if (!this.components.__valid || !this.components.alive) return tempVector
    //
    //     if (!this.components.has(PositionComponent)) {
    //         this.components.add(PositionComponent);
    //     }
    //
    //     return Vector3ToYuka(this.components.read(PositionComponent).position, tempVector);
    // }
    //
    // set position(value: Vector3) {
    //     this.components?.write(PositionComponent).setPosition( value.x, value.y, value.z );
    // }
    //
    // // @ts-ignore
    // get rotation(): Quaternion {
    //     if (!this.components.__valid || !this.components.alive) return tempQuaternion
    //
    //     if (!this.components.has(PositionComponent)) {
    //         this.components.add(PositionComponent);
    //     }
    //
    //     return QuaternionToYuka(this.components.read(PositionComponent).rotation, tempQuaternion);
    // }
    //
    // set rotation(value: Quaternion) {
    //     this.components?.write(PositionComponent).setRotation( value.x, value.y, value.z, value.w );
    // }
}
