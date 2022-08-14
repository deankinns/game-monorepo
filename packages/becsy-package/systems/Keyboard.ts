import { system, System } from "@lastolivegames/becsy";
import { Keyboard } from "../components";
import { EventSystem } from "./EventSystem";

@system((s) => s.beforeReadersOf(Keyboard).after(EventSystem))
export class KeyboardSystem extends System {
  // private readonly mouse = this.query(q => q.with(Keyboard).added.removed.write);

  keyboard = this.singleton.write(Keyboard);
  initialize() {
    this.keyboard.initialize();
  }

  // execute(): void {
  //     for (const entity of this.mouse.added) {
  //         entity.write(Keyboard).initialize();
  //     }
  //     for (const entity of this.mouse.removed) {
  //         entity.write(Keyboard).reset();
  //     }
  // }
}
