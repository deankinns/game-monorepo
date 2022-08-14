import {system, System} from "@lastolivegames/becsy";
import {
    BrainComponent,
    StaticEntityComponent,
    MovingEntityComponent,
    VehicleEntityComponent,
    PathComponent,
    PathRequestComponent,
} from "../components";
import {Think, Regulator} from "yuka";
import {
    Healing,
    Health,
    Render,
    Target,
    Deleter,
    Packed,
    Selected,
    PositionComponent,
    Inventory,
    InventorySystem,
    State
} from "becsy-package";
import {GetHealthEvaluator} from "yuka-package";
import {
    EntityManagerSystem,
    GameEntityComponent,
    // EntityManagerSystem,
    // StaticEntitySystem,
    // VehicleEntitySystem
} from "./GameEntitySystem";

@system((s) => s.after(EntityManagerSystem).before(HealthSystem, Render).inAnyOrderWith(InventorySystem))
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
            entity.write(BrainComponent).object = new Think(gameEntity.entity);
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

// @system(s => s.before(EntityManagerSystem, ThinkSystem, HealthSystem))
@system((s) => s.after(ThinkSystem).afterWritersOf(BrainComponent))
export class HealthSystem extends System {
    entities = this.query(
        (q) =>
            q.with(BrainComponent, Health, GameEntityComponent, PositionComponent)
                .added.read
    );

    checkable = this.query((q) => q.using(Healing, Target).read);

    execute() {
        for (const entity of this.entities.added) {
            const brain = entity.read(BrainComponent).object;
            brain.addEvaluator(new GetHealthEvaluator(1, Healing));
        }
    }
}
