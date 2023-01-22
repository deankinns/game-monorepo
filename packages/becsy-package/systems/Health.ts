import { System, system, component, field, Type } from "@lastolivegames/becsy";
import { Collectable, Inventory, InventorySystem, Packed } from "./Inventory";
import { Healing, Health } from "../components/Health";
import { EventSystem } from "./EventSystem";
import { Deleter } from "./Deleter";
import {PositionComponent, ToBeDeleted} from "../components";

@system((s) =>
  s.beforeWritersOf(Healing, Health).after(EventSystem).before(Deleter)
)
export class HealthSystem extends System {
  entities = this.query((q) => q.without(ToBeDeleted).with(Health).current.read);
  canHeal = this.query((q) => q.with(Health, Inventory).current.write);
  healing = this.query((q) => q.using(PositionComponent).read.with(Healing).current.added.removed.write);

  writeable = this.query(
    (q) => q.usingAll.write
  );

  execute() {
    for (const entity of this.canHeal.current) {
      const inventory = entity.read(Inventory).contents;
      const health = entity.write(Health);

      if (health.health < health.maxHealth) {
        let toHeal = health.maxHealth - health.health;
        for (const item of inventory) {
          if (item.has(Healing)) {
            const healingItem = item.write(Healing);
            if (!item.alive) continue

            if (healingItem.amount <= toHeal) {
              toHeal = healingItem.amount;
            }

            health.health += toHeal;
            healingItem.amount -= toHeal;

            if (healingItem.amount === 0) {
              item.add(ToBeDeleted);
            }
          }
        }
      }

      this.accessRecentlyDeletedData(true)
    }
  }
}
