import { system, System } from "@lastolivegames/becsy";
import { StaticEntityComponent } from "becsy-yuka-package";
import { PhysicsBodyComponent } from "becsy-enable3d-package";

@system((s) => s.afterWritersOf(StaticEntityComponent))
export class GameEntitySystem extends System {
  entities = this.query(
    (q) => q.with(StaticEntityComponent, PhysicsBodyComponent).current.write
  );

  execute() {
    for (const entity of this.entities.current) {
      const { x, y, z } = entity.read(PhysicsBodyComponent).body.position;
      entity.write(StaticEntityComponent).entity.position.set(x, y, z);
    }
  }
}
