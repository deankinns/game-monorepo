import { system, System } from "@lastolivegames/becsy";
import { Keyboard, Mouse } from "../components";
import {GameWorld} from "../GameWorld";

@system((s) => s.beforeWritersOf(Mouse, Keyboard))
export class EventSystem extends System {
  component: any;
  entities = this.query((q) => q.usingAll.write);
  //@ts-ignore
  gameWorld: GameWorld;

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
    const action = this.gameWorld.actions.shift();
    if (action) {
      action.action(this, action.entity, action.data);
    }
    // this.gameWorld.actions = [];

    //
    // for (const action of this.actions) {
    //     action.action(this, action.entity, action.data);
    //     // refresh = true;
    // }
    // this.actions = [];
  }
}
