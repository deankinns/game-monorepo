import {System, system, component, field, Type} from "@lastolivegames/becsy";
import {Inventory, InventorySystem, Packed} from "./Inventory";


@component
export class Health {
    @field({type: Type.int8, default: 50}) declare health: number;
    @field({type: Type.int8, default: 100}) declare maxHealth: number;
}

@component
export class Healing {
    @field({type: Type.int8, default: 50}) declare amount: number;
}

@system(s => s.beforeWritersOf(Healing, Health))
export class HealthSystem extends System {

    entities = this.query(q => q.current.with(Health).current.read);
    canHeal = this.query(q => q.current.with(Health, Inventory).current.write)


    execute() {
        for (const entity of this.canHeal.current) {
            const inventory = entity.read(Inventory).contents
            const health = entity.write(Health)

            if (health.health < health.maxHealth) {
                let toHeal = health.maxHealth - health.health;
                for (const item of inventory) {
                    if (item.has(Healing)) {
                        const healingItem = item.write(Healing);

                        if (healingItem.amount <= toHeal) {
                            toHeal = healingItem.amount;
                        }

                        health.health += toHeal;
                        healingItem.amount -= toHeal;

                        if (healingItem.amount === 0) {
                            item.delete();
                        }
                    }
                }
            }
        }
    }
}
