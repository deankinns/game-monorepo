import { MovingEntity, Vehicle as YukaVehicle } from "yuka";
import { GameEntity as YukaGameEntity } from "yuka/src/core/GameEntity";
import { componentWrapperInterface } from "./Components";
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
}

// applyMixins(Vehicle, [YukaVehicle, componentWrapper])
