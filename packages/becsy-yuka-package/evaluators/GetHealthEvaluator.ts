import {
  GameEntity,
  GoalEvaluator,
  MathUtils,
  MemorySystem,
  Think,
} from "yuka";
import { Feature } from "../Feature";
import { GetItemGoal } from "../goals/GetItemGoal";
// import { Vehicle } from "../../yuka-package/entities/Vehicle";
import _ from "lodash";
import {Vehicle} from "../entities";
import {Health} from "becsy-package";
import {MemoryComponent} from "../components";
// import { componentRegistry } from "../../yuka-package/entities/Components";
// import {Health} from "../core/Types";
// import {BrainComponent} from "./AttackEvaluator";
// import {Health} from "../../becsy/systems";
// import {BrainComponent} from "../../becsy/components";
// type Health = {
//     data: {health: number, maxHealth: number},
// }

// type GoalSubject = Vehicle & Health ;
/**
 * Class for representing the get-health goal evaluator. Can be used to compute a score that
 * represents the desirability of the respective top-level goal.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
export class GetHealthEvaluator extends GoalEvaluator<any> {
  private itemType: any;
  private tweaker: number;
  private item?: GameEntity;

  /**
   * Constructs a new get health goal evaluator.
   *
   * @param {Number} characterBias - Can be used to adjust the preferences of the enemy.
   * @param {Number} itemType - The item type.
   * @param healthInterface
   * @param brainInterface
   * @param packedInterface
   */
  constructor(
    characterBias = 1,
    itemType: any,
    private brain: Think<GameEntity>,
    // private healthInterface: any = componentRegistry.Health,
    // private brainInterface: any = BrainComponent,
    // private packedInterface: any = Packed
  ) {
    super(characterBias);

    this.itemType = itemType;
    this.tweaker = 0.2; // value used to tweak the desirability
  }

  /**
   * Calculates the desirability. It's a score between 0 and 1 representing the desirability
   * of a goal.
   *
   * @param {Vehicle} owner - The owner of this goal evaluator.
   * @return {Number} The desirability.
   */
  calculateDesirability(owner: Vehicle) {
    // const defaultHealth = {Health: {health: 50, maxHealth: 100}};
    // _.defaultsDeep(owner, defaultHealth)
    let desirability = 0;
    if (!owner.components.has(Health)) {
      owner.components.add(Health, {
        health: 50,
        maxHealth: 100,
      });
    }

    const { health, maxHealth } = owner.components.read(
      Health
    );

    // if ( owner.isItemIgnored( this.itemType ) === false && owner.health < owner.maxHealth ) {
    if (health < maxHealth) {
      const memorySystem = owner.components.read(
        MemoryComponent
      ).system as MemorySystem;

      //@TODO look for closest item in memory
      const distanceScore = Feature.distanceToItem(owner, this.itemType);
      const healthScore = Feature.health(owner);

      desirability = (this.tweaker * (1 - healthScore)) / distanceScore.score;

      this.item = distanceScore.result as GameEntity;

      desirability = MathUtils.clamp(desirability, 0, 1);
    }

    return desirability;
  }

  /**
   * Executed if this goal evaluator produces the highest desirability.
   *
   * @param {Enemy} owner - The owner of this goal evaluator.
   */
  setGoal(owner: Vehicle) {
    // const brain = owner.components.read(
    //   BrainComponent
    // ).object;
    const brain = this.brain;

    const currentSubgoal = brain.currentSubgoal() as GetItemGoal;

    if (currentSubgoal instanceof GetItemGoal === false) {
      brain.clearSubgoals();

      brain.addSubgoal(new GetItemGoal(owner, this.itemType, this.item));
    } else if(currentSubgoal?.item && this.item) {
      if (currentSubgoal.item.position.distanceTo(owner.position) > this.item.position.distanceTo(
        owner.position
      ) && this.item !== currentSubgoal.item) {
        brain.clearSubgoals();

        brain.addSubgoal(new GetItemGoal(owner, this.itemType, this.item));
      }

    }
  }
}

// export { GetHealthEvaluator };
