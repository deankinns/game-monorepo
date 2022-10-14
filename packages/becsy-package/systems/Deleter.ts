import { System, system } from "@lastolivegames/becsy";
import { ToBeDeleted } from "../components";
import { Render } from "./index";

@system((s) => s.afterWritersOf(ToBeDeleted).after(Render))
export class Deleter extends System {
  // Note the usingAll.write below, which grants write entitlements on all component types.
  entities = this.query((q) => q.current.with(ToBeDeleted).usingAll.write);

  execute() {
    for (const entity of this.entities.current) {
      const del = entity.read(ToBeDeleted);
      if (!del.condition || del.condition(entity)) {
        entity.delete();
      }
    }
  }
}
