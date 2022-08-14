import { GoalEvaluator } from "yuka";
import { AttackGoal } from "../goals/AttackGoal";
import { Feature } from "../core/Feature";
import { Vehicle } from "../entities/Vehicle";
import { GameEntity } from "../entities";
import { componentRegistry } from "../entities/Components";
// import {BrainComponent, Target} from "../../becsy/components";
// import {Soldier} from "../../becsy/systems";
/**
 * Class for representing the attack goal evaluator. Can be used to compute a score that
 * represents the desirability of the respective top-level goal.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
class AttackEvaluator extends GoalEvaluator<Vehicle> {
  private tweaker;

  /**
   * Constructs a new attack goal evaluator.
   *
   * @param {Number} characterBias - Can be used to adjust the preferences of the enemy.
   * @param props
   */
  constructor(characterBias = 1) {
    super(characterBias);

    this.tweaker = 1; // value used to tweak the desirability
  }

  /**
   * Calculates the desirability. It's a score between 0 and 1 representing the desirability
   * of a goal.
   *
   * @param {Vehicle} owner - The owner of this goal evaluator.
   * @return {Number} The desirability.
   */
  calculateDesirability(owner: Vehicle) {
    let desirability = 0;

    // const target = owner.entity.has(Target);

    // if (owner.targetSystem?.hasTarget()) {
    if (owner.components.has(componentRegistry.Target)) {
      const target = owner.components.read(componentRegistry.Target).value;
      if (!target) {
        owner.components.remove(componentRegistry.Target);
      } else {
        if (target.has("Soldier")) {
          desirability =
            this.tweaker *
            Feature.totalWeaponStrength(owner) *
            Feature.health(owner);
        }
      }
    }
    return desirability;
  }

  /**
   * Executed if this goal evaluator produces the highest desirability.
   *
   * @param {Vehicle} owner - The owner of this goal evaluator.
   */
  setGoal(owner: Vehicle) {
    const brain = owner.components.read(
      componentRegistry.BrainComponent
    ).object;

    const currentSubgoal = brain.currentSubgoal();

    if (currentSubgoal instanceof AttackGoal === false) {
      brain.clearSubgoals();

      brain.addSubgoal(new AttackGoal(owner));
    }
  }
}

export { AttackEvaluator };
