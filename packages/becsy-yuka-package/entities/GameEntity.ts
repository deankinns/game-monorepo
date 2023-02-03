import {GameEntity as BaseGameEntity, Quaternion, Vector3} from "yuka";
import {Entity} from "@lastolivegames/becsy";
import {PositionComponent} from "becsy-package";
import {Vector3ToYuka, QuaternionToYuka} from "yuka-package";

export class GameEntity extends BaseGameEntity {
    constructor(public components: Entity) {
        super();
    }

    pos: Vector3 = new Vector3();

    handleMessage(telegram: {
        message: any;
        sender: any;
        receiver: any;
    }): boolean {
        return telegram.message(telegram.sender, telegram.receiver);
    }

    // // @ts-ignore
    // get position(): Vector3 {
    //     if (!this.components.has(PositionComponent)) {
    //         this.components.add(PositionComponent);
    //     }
    //
    //     return Vector3ToYuka(this.components.read(PositionComponent).position, this.pos);
    // }
    //
    // set position(value: Vector3) {
    //     this.components?.write(PositionComponent).setPosition( value.x, value.y, value.z );
    // }

    // get rotation(): Quaternion {
    //     if (!this.components.has(PositionComponent)) {
    //         this.components.add(PositionComponent);
    //     }
    //
    //     return QuaternionToYuka(this.components.read(PositionComponent).rotation);
    // }
    //
    // set rotation(value: Quaternion) {
    //     this.components?.write(PositionComponent).setRotation( value.x, value.y, value.z, value.w );
    // }
}
