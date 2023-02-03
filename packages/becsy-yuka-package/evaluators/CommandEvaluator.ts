import {GameEntity, GoalEvaluator, Think, Vector3} from "yuka";
import {MoveCommandGoal} from "../goals/MoveCommandGoal";
import {Vehicle} from "../entities";
import {PositionComponent, Target} from "becsy-package";
import {GameEntityComponent} from "../systems";
import {Vector3ToYuka} from "yuka-package";

export class CommandEvaluator extends GoalEvaluator<Vehicle> {
    constructor(characterBias = 1, private brain: Think<GameEntity>) {
        super(characterBias);
    }

    calculateDesirability(owner: Vehicle) {

        if (!owner.components.has(Target)) return 0
        const target = owner.components.read(Target).value
        if (target?.has(GameEntityComponent)) return 0
        return 1;
    }

    setGoal(owner: Vehicle) {
        const brain = this.brain
        const currentSubgoal = brain.currentSubgoal();
        if (!owner.components.has(Target)) return;
        const target = owner.components.read(Target).value
        const position = Vector3ToYuka(target.read(PositionComponent).position)

        if (!(currentSubgoal instanceof MoveCommandGoal) || !currentSubgoal.target.equals(position)) {
            brain.clearSubgoals();

            brain.addSubgoal(new MoveCommandGoal(owner, new Vector3(position.x, position.y, position.z)));
        }
    }
}