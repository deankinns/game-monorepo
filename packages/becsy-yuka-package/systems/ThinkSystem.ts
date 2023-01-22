import {system, System, Entity} from "@lastolivegames/becsy";
import {BrainComponent, PathComponent, PathRequestComponent,} from "../components";
import {Regulator, Think} from "yuka";
import {Inventory, InventorySystem, Packed, Render, Selected, State, Target} from "becsy-package";
import {ExploreEvaluator, CommandEvaluator} from "yuka-package";
import {EntityManagerSystem, GameEntityComponent,} from "./GameEntitySystem";
import {HealthSystem} from "./HealthSystem";
import {CombatSystem} from "./CombatSystem";
//
// // @ts-ignore
// class Think<T extends Entity> extends ThinkY<T> {
//     constructor(owner: T) {
//         super(owner);
//     }
// }


@system((s) => s.after(EntityManagerSystem).before(HealthSystem,CombatSystem, Render).inAnyOrderWith(InventorySystem))
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
                State
            ).write
    );

    execute() {
        for (const entity of this.thinkers.added) {
            const gameEntity = entity.read(GameEntityComponent);
            const think = new Think(gameEntity.entity);
            think.addEvaluator(new ExploreEvaluator())
            think.addEvaluator(new CommandEvaluator())
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

