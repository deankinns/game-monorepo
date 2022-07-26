import {CompositeGoal, Vector3, Goal, Regulator} from 'yuka';
import {FindPathGoal} from './FindPathGoal';
import {FollowPathGoal} from './FollowPathGoal';
import {CONFIG} from '../core/Config.js';
// import {CollectableComponent, Target} from "../../becsy/components";
import {SeekToPositionGoal} from "./SeekToPositionGoal";
import {PickUpCollectibleGoal} from "./PickUpCollectibleGoal";
// import {Packed} from "../../becsy/systems";

const result = {distance: Infinity, item: null};

/**
 * Goal to get an item of the given item type.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
class GetItemGoal extends CompositeGoal<any> {
  private itemType: any;
  private item: any;
  private regulator: Regulator;

  /**
   * Constructs a new GetItemGoal with the given values.
   *
   * @param owner - The owner of this goal.
   * @param itemType - The type of the item.
   * @param item - The exact item to get.
   */
  constructor(owner, itemType, item = null) {

    super(owner);

    this.itemType = itemType;
    this.item = item;

    this.regulator = new Regulator(CONFIG.BOT.GOAL.ITEM_VISIBILITY_UPDATE_FREQUENCY);

  }

  activate() {

    const owner = this.owner;

    // if this goal is reactivated then there may be some existing subgoals that must be removed

    this.clearSubgoals();

    // if (owner.entity.has(Target)) {
    //   owner.entity.remove(Target)
    // }

    // get closest available item of the given type

    // owner.world.getClosestItem( owner, this.itemType, result );

    // this.item = result.item;
    this.item = this.getClosestCollectable(owner)

    if (this.item) {
      if (!owner.entity.has('Target')) {
        owner.entity.add('Target', {value: this.item.entity})
      }

      // if an item was found, try to pick it up

      const from = new Vector3().copy(owner.position);
      const to = new Vector3().copy(this.item.position);

      // setup subgoals

      this.addSubgoal(new FindPathGoal(owner, from, to));
      this.addSubgoal(new FollowPathGoal(owner));
      // this.addSubgoal(new SeekToCollectibleGoal(owner, this.item))

      this.addSubgoal(new PickUpCollectibleGoal(owner));
    } else {
      if (owner.entity.has('Target')) {
        owner.entity.remove('Target')
      }
      // if no item was returned, there is nothing to pick up.
      // mark the goal as failed

      this.status = Goal.STATUS.FAILED;

      // ensure the bot does not look for this type of item for a while

      // owner.ignoreItem(this.itemType);

    }

  }

  getClosestCollectable(owner) {
    let result = null;
    const entities = owner.manager.entities;
    let minDistance = Infinity;

    for (const entity of entities) {
      // if (entity !== owner && entity instanceof Collectible && !entity.pickedUp) {
      //   const squaredDistance = owner.position.squaredDistanceTo(entity.position);
      //   if (squaredDistance < minDistance) {
      //     minDistance = squaredDistance;
      //     owner.data.currentTarget = entity;
      //   }
      // }

      if (entity.entity.has('CollectableComponent') && !entity.entity.has('Packed') && entity.entity.has(this.itemType)) {
        const squaredDistance = owner.position.squaredDistanceTo(entity.position);
        if (squaredDistance < minDistance) {
          minDistance = squaredDistance;
          // owner.data.currentTarget = entity;
          result = entity;
        }
      }
    }

    return result;
  }

  execute() {

    if (this.active()) {

      // only check the availability of the item if it is visible for the enemy

      if (this.regulator.ready()/* && this.owner.vision.visible(this.item.position)*/) {

        // if it was picked up by somebody else, mark the goal as failed

        // if (this.item.active === false) {
        if (
          !this.item ||
          !this.item.active ||
          !this.item.entity ||
          this.item.entity.has('Packed')) {

          this.status = Goal.STATUS.FAILED;
          this.owner.entity.remove('Target');

        } else {

          this.status = this.executeSubgoals();

        }

      } else {

        this.status = this.executeSubgoals();

      }

      // replan the goal means the bot tries to find another item of the same type

      this.replanIfFailed();

    }

  }

  terminate() {

    this.clearSubgoals();

  }

}

export {GetItemGoal};
