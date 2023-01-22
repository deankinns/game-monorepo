import {ArriveBehavior, MovingEntity, Vehicle as YukaVehicle} from "yuka";
import {GameEntity as YukaGameEntity} from "yuka/src/core/GameEntity";
import {componentRegistry, componentWrapperInterface} from "./Components";
// import {Entity} from "@lastolivegames/becsy";
// import {Manager} from "../../becsy";

export class Vehicle extends YukaVehicle implements YukaVehicle {
    data: any = {};

    constructor(private _components: componentWrapperInterface) {
        super();
    }

    get components(): componentWrapperInterface {
        return this._components;
    }

    prevUpdate: any = undefined;

    handleMessage(telegram: {
        message: any;
        sender: any;
        receiver: any;
    }): boolean {
        return telegram.message(telegram.sender, telegram.receiver);
    }


    // update(delta: number): this {
    //
    //     // // new ArriveBehavior();
    //     // let behavior = null;
    //     // let activeBehavior = false;
    //     // for (let i = 0; i < this.steering.behaviors.length; i++) {
    //     //     if (this.steering.behaviors[i] instanceof ArriveBehavior) {
    //     //         behavior = this.steering.behaviors[i] as ArriveBehavior;
    //     //     }
    //     //     activeBehavior = activeBehavior || this.steering.behaviors[i].active;
    //     // }
    //     // if (!behavior) {
    //     //     behavior = new ArriveBehavior(this.position, 3, 1);
    //     //     this.steering.add(behavior);
    //     // }
    //     //
    //     // if (this._components.has(componentRegistry.Target)) {
    //     //     const target = this._components.read(componentRegistry.Target).value;
    //     //     if (target && target.has(componentRegistry.GameEntityComponent) && behavior && !activeBehavior) {
    //     //         const targetEntity = target.read(componentRegistry.GameEntityComponent).entity;
    //     //         //
    //     //         // this.rotateTo(targetEntity.position, delta*1000);
    //     //         if (behavior.target.squaredDistanceTo(targetEntity.position) > (this.boundingRadius * this.boundingRadius)) {
    //     //             behavior.target.copy(targetEntity.position);
    //     //             behavior.active = true;
    //     //         }
    //     //     }
    //     // }
    //     super.update(delta);
    //     return this;
    // }
}

// applyMixins(Vehicle, [YukaVehicle, componentWrapper])
