import {component, Entity, field, system, System} from "@lastolivegames/becsy";

import {
    Keyboard,
    Mouse, RenderComponent,
} from "../components";
import {Healing} from "./Health";


@component
export class Packed {
    @field.ref declare holder: Entity;
}

@component
export class Inventory {
    @field.backrefs(Packed, 'holder') declare contents: Entity[];
}

@component
export class Equipped {
    @field.ref declare item: Entity;
}

@component
export class Collectible {

}

@system(s => s.afterWritersOf(Inventory, Equipped, Collectible))
export class InventorySystem extends System {


    inventories = this.query(q => q.current.with(Inventory).current.write);


    makeHealthPack(point: any) {


        this.createEntity(
            Healing, Collectible, RenderComponent
        )
    }
}
