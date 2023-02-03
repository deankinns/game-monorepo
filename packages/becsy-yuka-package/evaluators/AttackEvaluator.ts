import { GoalEvaluator} from "yuka";
import { AttackGoal } from "../goals/AttackGoal";
import { Feature } from "../Feature";
import {Vehicle, GameEntity, MovingEntity} from "../entities";
import {Target} from "becsy-package";
import {BrainComponent, VehicleEntityComponent} from "../components";
import {GameEntityComponent} from "../systems";
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
  target?:GameEntity|MovingEntity|Vehicle;

  /**
   * Calculates the desirability. It's a score between 0 and 1 representing the desirability
   * of a goal.
   *
   * @param {Vehicle} owner - The owner of this goal evaluator.
   * @return {Number} The desirability.
   */
  calculateDesirability(owner: Vehicle) {
    let desirability = 0;

    if (owner.components.has(Target)) {
      const target = owner.components.read(Target).value;
      if (!target) {
        owner.components.remove(Target);
      } else {
        if (target.has(VehicleEntityComponent)) {
          this.target = target.read(GameEntityComponent).entity;
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
      BrainComponent
    ).object;

    const currentSubgoal = brain.currentSubgoal();
    // const target = owner.components.read(Target).value;

    if (!(currentSubgoal instanceof AttackGoal) && this.target) {
      brain.clearSubgoals();

      brain.addSubgoal(new AttackGoal(owner, this.target));
    }
  }
}

export { AttackEvaluator };
