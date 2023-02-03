import { ComponentType, Entity, system, System} from "@lastolivegames/becsy";
import {Keyboard, Mouse} from "../components";
import {GameWorld} from "../GameWorld";

@system((s) => s.beforeWritersOf(Mouse, Keyboard))
export class EventSystem extends System {
  component: any;
  entities = this.query((q) => q.usingAll.write);
  //@ts-ignore
  gameWorld: { actions: any[] };

  private actions: any[] = [];

  initialize() {
    window.addEventListener("message", (event) => {
      if (event.source !== window) {
        return;
      }
      const message = event.data;
      if (
          message.type === "enqueueAction" &&
          typeof message.data === "object"
      ) {
        this.actions.push(message.data);
      }
    });
  }

  execute() {
    // for (const action of this.gameWorld.actions) {
    if (this.gameWorld) {
      const action = this.gameWorld.actions.shift();
      if (action) {
        action.action(this, action.entity, action.data);
      }
    }
    // this.gameWorld.actions = [];

    //
    for (const action of this.actions) {
        action.action(this, action.entity, action.data);
    //     // refresh = true;
    }
    this.actions = [];
  }

  createAndHold(components: (ComponentType<any> | Record<string, unknown>)[], setEntity: any) {
    // const entity = this.createEntity(...components);
    // setEntity(entity.hold());
    // this.actions.push()
    this.enqueueAction((system, e, data) => {
      const entity = system.createEntity(...data.components);
      data.setEntity(entity.hold());
    }, undefined, {components, setEntity});
  }

  enqueueAction(
      action: (system: System, entity?: Entity, data?: any) => any,
      entity?: Entity,
      data?: any
  ) {
    this.actions.push({action, entity, data});
  }
}
