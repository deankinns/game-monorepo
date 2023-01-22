import {
    component,
    Entity,
    field,
    system,
    System,
} from "@lastolivegames/becsy";

import {Healing, Keyboard, Mouse, RenderComponent, Target} from "../components";
import {Render} from "./Render";

// import {Healing} from "./Health";

@component
export class Packed {
    @field.ref declare holder: Entity;
}

@component
export class Inventory {
    @field.backrefs(Packed, "holder", true) declare contents: Entity[];
}

@component
export class Equipped {
    @field.ref declare item: Entity;
}

@component
export class Collectable {
}

@system((s) => s.afterWritersOf(Inventory, Equipped, Collectable).before(Render))
export class InventorySystem extends System {
    inventories = this.query((q) => q.current.with(Inventory).current.write);
    packed = this.query((q) => q.current.with(Packed).current.added.write.using(RenderComponent, Target).write);

    makeHealthPack(point: any) {
        this.createEntity(Healing, Collectable, RenderComponent);
    }

    execute() {
        for (const packed of this.packed.added) {
            if (packed.has(RenderComponent)) {
                packed.remove(RenderComponent);
            }
        }
    }
}
