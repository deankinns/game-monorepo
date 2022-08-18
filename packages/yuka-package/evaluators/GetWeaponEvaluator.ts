import {GameEntity, GoalEvaluator, MathUtils} from "yuka";
import { Feature } from "../core/Feature";
import { GetItemGoal } from "../goals/GetItemGoal";
import {componentRegistry, Vehicle} from "../entities";
// import {BrainComponent} from "../../becsy/components";

/**
 * Class for representing the get-weapon goal evaluator. Can be used to compute a score that
 * represents the desirability of the respective top-level goal.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
class GetWeaponEvaluator extends GoalEvaluator<any> {
  private itemType: any;
  private tweaker: number;
  private item?: GameEntity;

  /**
   * Constructs a new get weapon goal evaluator.
   *
   * @param {Number} characterBias - Can be used to adjust the preferences of the enemy.
   * @param {Number} itemType - The item type.
   */
  constructor(characterBias = 1, itemType = null) {
    super(characterBias);

    this.itemType = itemType;
    this.tweaker = 0.15; // value used to tweak the desirability
  }

  /**
   * Calculates the desirability. It's a score between 0 and 1 representing the desirability
   * of a goal.
   *
   * @param {Enemy} owner - The owner of this goal evaluator.
   * @return {Number} The desirability.
   */
  calculateDesirability(owner: Vehicle) {
    let desirability = 0;

    //if ( owner.isItemIgnored( this.itemType ) === false ) {

    const distanceScore = Feature.distanceToItem(owner, this.itemType);
    const weaponScore = Feature.individualWeaponStrength(owner, this.itemType);
    const healthScore = Feature.health(owner);

    desirability =
      (this.tweaker * (1 - weaponScore) * healthScore) / distanceScore.score;

    desirability = MathUtils.clamp(desirability, 0, 1);
    this.item = distanceScore.result as GameEntity;

    //}

    return desirability;
  }

  /**
   * Executed if this goal evaluator produces the highest desirability.
   *
   * @param {Enemy} owner - The owner of this goal evaluator.
   */
  setGoal(owner: Vehicle) {
    const brain = owner.components.read(componentRegistry.BrainComponent).object;

    const currentSubgoal = brain.currentSubgoal();

    if (currentSubgoal instanceof GetItemGoal === false) {
      brain.clearSubgoals();

      brain.addSubgoal(new GetItemGoal(owner, this.itemType, this.item));
    }
  }
}

export { GetWeaponEvaluator };
