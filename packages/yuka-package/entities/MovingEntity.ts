import { MovingEntity as YukaMovingEntity } from "yuka";
import { componentWrapperInterface } from "./Components";

export class MovingEntity extends YukaMovingEntity implements YukaMovingEntity {
  constructor(private _components: componentWrapperInterface) {
    super();
  }

  get components() {
    return this._components;
  }

  handleMessage(telegram: {
    message: any;
    sender: any;
    receiver: any;
  }): boolean {
    return telegram.message(telegram.sender, telegram.receiver);
  }
}
