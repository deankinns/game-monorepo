import {system, System, Entity} from "@lastolivegames/becsy";
import {
    BrainComponent,
    PathComponent,
    PathRequestComponent,
    VehicleEntityComponent,
    VisionComponent,
} from "../components";
import {Regulator, Think} from "yuka";
import {Inventory, InventorySystem, Packed, Render, Selected, State, Target, Collectable, Health} from "becsy-package";

import {EntityManagerSystem, GameEntityComponent,} from "./GameEntitySystem";
import {FindHealthSystem} from "./FindHealthSystem";
import {CombatSystem} from "./CombatSystem";
import {ExploreEvaluator} from "../evaluators/ExploreEvaluator";
import {CommandEvaluator} from "../evaluators/CommandEvaluator";


@system((s) => s.after(EntityManagerSystem).before(FindHealthSystem,CombatSystem, Render).inAnyOrderWith(InventorySystem))
export class ThinkSystem extends System {
    thinkers = this.query(
        (q) => q.with(BrainComponent, GameEntityComponent).added.current.write
    );

    checkable = this.query((q) => q.usingAll.read);
    writable = this.query(
        (q) =>
            q.using(
                Target,
                Selected,
                PathComponent,
                PathRequestComponent,
                Packed,
                Inventory,
                State,
                Collectable,
                Health,
                VehicleEntityComponent,
                VisionComponent
            ).write
    );

    execute() {
        for (const entity of this.thinkers.added) {
            const gameEntity = entity.read(GameEntityComponent);
            const think = new Think(gameEntity.entity);
            think.addEvaluator(new ExploreEvaluator(1, think))
            think.addEvaluator(new CommandEvaluator(1, think))
            entity.write(BrainComponent).object = think
            entity.write(BrainComponent).regulator = new Regulator(1);
        }

        for (const entity of this.thinkers.current) {
            const {object, regulator} = entity.read(BrainComponent);

            if (object.evaluators.length > 0) {
                if (regulator.ready()) {
                    object.arbitrate();
                }
                object.execute();
            }
        }
    }
}

