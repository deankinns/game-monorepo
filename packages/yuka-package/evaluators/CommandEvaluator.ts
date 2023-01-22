import {GoalEvaluator, Vector3} from "yuka";
import {componentRegistry, Vehicle} from "../entities";
import {ExploreGoal} from "../goals";
import {MoveCommandGoal} from "../goals/MoveCommandGoal";

export class CommandEvaluator extends GoalEvaluator<Vehicle> {
    constructor(characterBias = 1) {
        super(characterBias);
    }

    calculateDesirability(owner: Vehicle) {

        if (!owner.components.has(componentRegistry.Target)) return 0
        const target = owner.components.read(componentRegistry.Target).value
        if (target?.has(componentRegistry.GameEntityComponent)) return 0
        return 1;
    }

    setGoal(owner: Vehicle) {
        const brain = owner.components.read(componentRegistry.BrainComponent).object;
        const currentSubgoal = brain.currentSubgoal();
        if (!owner.components.has(componentRegistry.Target)) return;
        const target = owner.components.read(componentRegistry.Target).value
        const position = target.read(componentRegistry.PositionComponent).position

        if (!(currentSubgoal instanceof MoveCommandGoal) || !currentSubgoal.target.equals(position)) {
            brain.clearSubgoals();

            brain.addSubgoal(new MoveCommandGoal(owner, new Vector3(position.x, position.y, position.z)));
        }
    }
}