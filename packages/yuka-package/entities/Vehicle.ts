import {Vehicle as YukaVehicle} from "yuka";
// import {Entity} from "@lastolivegames/becsy";
// import {Manager} from "../../becsy";

export class Vehicle extends YukaVehicle {
  entity ?: any;
  controlled = false;
  data: any;
  // manager: Manager;
}
