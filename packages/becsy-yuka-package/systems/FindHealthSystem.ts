
import {System, system} from "@lastolivegames/becsy";
import {BrainComponent} from "../components";
import {GameEntityComponent} from "./GameEntitySystem";
import {ThinkSystem} from "./ThinkSystem";
import {PositionComponent, Health, Healing, Target} from "becsy-package";
import {GetHealthEvaluator} from "../evaluators/GetHealthEvaluator";

@system((s) => s.after(ThinkSystem).afterWritersOf(BrainComponent))
export class FindHealthSystem extends System {
    entities = this.query(
        (q) =>
            q.with(BrainComponent, Health, GameEntityComponent, PositionComponent)
                .added.read
    );

    checkable = this.query((q) => q.using(Healing, Target).read);

    execute() {
        for (const entity of this.entities.added) {
            const brain = entity.read(BrainComponent).object;
            brain.addEvaluator(new GetHealthEvaluator(1, Healing, brain));
        }
    }
}