import { GameEntity, GoalEvaluator, Think } from "yuka";
import { ExploreGoal } from "../goals/ExploreGoal";
// import {Navigator} from '../goals/ExploreGoal'
import { Vehicle } from "../entities";
import { componentRegistry } from "../entities/Components";
// import {BrainComponent} from "./AttackEvaluator";

// import {BrainComponent} from "../../becsy/components";
//
// type Thinker = Vehicle & {
//     brain: Think<Thinker>,
// } & Navigator

/**
 * Class for representing the explore goal evaluator. Can be used to compute a score that
 * represents the desirability of the respective top-level goal.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
class ExploreEvaluator extends GoalEvaluator<Vehicle> {
  /**
   * Constructs a new explore goal evaluator.
   *
   * @param {Number} characterBias - Can be used to adjust the preferences of the enemy.
   */
  constructor(characterBias = 1) {
    super(characterBias);
  }

  /**
   * Calculates the desirability. It's a score between 0 and 1 representing the desirability
   * of a goal.
   *
   * @param {Enemy} owner - The owner of this goal evaluator.
   * @return {Number} The desirability.
   */
  calculateDesirability(/* owner */) {
    return 0.1;
  }

  /**
   * Executed if this goal evaluator produces the highest desirability.
   *
   * @param {Enemy} owner - The owner of this goal evaluator.
   */
  setGoal(owner: Vehicle) {
    const brain = owner.components.read(
      componentRegistry.BrainComponent
    ).object;
    const currentSubgoal = brain.currentSubgoal();

    // const brain = owner.entity.read(BrainComponent).object;
    // const currentSubgoal = brain.currentSubgoal();

    if (currentSubgoal instanceof ExploreGoal === false) {
      brain.clearSubgoals();

      brain.addSubgoal(new ExploreGoal(owner));
    }
  }
}

export { ExploreEvaluator };
