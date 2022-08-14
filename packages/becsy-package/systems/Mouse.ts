import { system, System } from "@lastolivegames/becsy";
import { Mouse, Mouse as MouseComponent } from "../components";
import { EventSystem } from "./EventSystem";

@system((s) => s.beforeReadersOf(MouseComponent).after(EventSystem))
export class MouseSystem extends System {
  // private readonly mouse = this.query(q => q.with(MouseComponent).added.removed.write);

  mouse = this.singleton.write(Mouse);

  initialize() {
    this.mouse.initialize();
  }

  execute(): void {
    // for (const entity of this.mouse.added) {
    //     entity.write(MouseComponent).initialize();
    // }
    // this.accessRecentlyDeletedData(true)
    // for (const entity of this.mouse.removed) {
    //     entity.write(MouseComponent).reset();
    // }
  }
}
