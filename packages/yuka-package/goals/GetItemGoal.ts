import {CompositeGoal, Vector3, Goal, Regulator, Vehicle, GameEntity} from 'yuka';
import {FindPathGoal} from './FindPathGoal';
import {FollowPathGoal} from './FollowPathGoal';
import {CONFIG} from '../core/Config.js';
// import {CollectableComponent, Target} from "../../becsy/components";
import {SeekToPositionGoal} from "./SeekToPositionGoal";
import {PickUpCollectibleGoal} from "./PickUpCollectibleGoal";
import {InWorld, PathPlanner, TYPE_COLLECTIBLE} from "../core";
import _ from "lodash";
// import {Packed} from "../../becsy/systems";

const result = {distance: Infinity, item: null};

export type Searcher = Vehicle & {
    data: { GetItemGoal: { target?: GameEntity } }
    // entity: {has: any, add: any, remove: any}
} & InWorld
type Collectible = GameEntity & {
    // entity: {has: any, add: any}
    type: any[]
}

/**
 * Goal to get an item of the given item type.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
class GetItemGoal extends CompositeGoal<Searcher> {
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
    constructor(owner: Searcher, itemType: any, item = null) {
        _.defaultsDeep(owner, {data: {GetItemGoal: {}}})
        super(owner);

        this.itemType = itemType;
        this.item = item;

        this.regulator = new Regulator(CONFIG.BOT.GOAL.ITEM_VISIBILITY_UPDATE_FREQUENCY);

    }

    activate() {
        if (!this.owner) {
            return this.status = Goal.STATUS.FAILED;
        }

        const owner = this.owner;

        // if this goal is reactivated then there may be some existing subgoals that must be removed

        this.clearSubgoals();

        // if (owner.entity.has(Target)) {
        //   owner.entity.remove(Target)
        // }

        // get closest available item of the given type

        // owner.world.getClosestItem( owner, this.itemType, result );

        // this.item = result.item;
        this.item = this.getClosestCollectable(this.owner)

        if (this.item) {
            if (!this.owner.data.GetItemGoal.target) {
                // owner.entity.add('Target', {value: this.item.entity})
                this.owner.data.GetItemGoal.target = this.item
            }

            // if an item was found, try to pick it up

            const from = new Vector3().copy(owner.position);
            const to = new Vector3().copy(this.item.position);

            // setup subgoals

            this.addSubgoal(new FindPathGoal(owner, from, to));
            this.addSubgoal(new FollowPathGoal(owner));
            // this.addSubgoal(new SeekToCollectibleGoal(owner, this.item))

            this.addSubgoal(new PickUpCollectibleGoal(owner, this.item));
        } else {
            if (this.owner.data.GetItemGoal.target) {
                // owner.entity.remove('Target')
                delete this.owner.data.GetItemGoal.target
            }
            // if no item was returned, there is nothing to pick up.
            // mark the goal as failed

            this.status = Goal.STATUS.FAILED;

            // ensure the bot does not look for this type of item for a while

            // owner.ignoreItem(this.itemType);

        }

    }

    getClosestCollectable(owner: Searcher) {
        let result = null;
        const entities = (owner.manager?.entities ?? []) as (GameEntity & { type: any[], packed?: any })[];
        let minDistance = Infinity;

        for (const entity of entities) {
            // if (entity !== owner && entity instanceof Collectible && !entity.pickedUp) {


            if (_.difference([TYPE_COLLECTIBLE, this.itemType], entity.type).length === 0 && !entity.packed) {
                const squaredDistance = owner.position.squaredDistanceTo(entity.position);
                if (squaredDistance < minDistance) {
                    minDistance = squaredDistance;
                    // owner.data.GetItemGoal.target = entity;
                    result = entity;
                }
            }

            // if (entity.entity.has('CollectableComponent') && !entity.entity.has('Packed') && entity.entity.has(this.itemType)) {
            //     const squaredDistance = owner.position.squaredDistanceTo(entity.position);
            //     if (squaredDistance < minDistance) {
            //         minDistance = squaredDistance;
            //         // owner.data.currentTarget = entity;
            //         result = entity;
            //     }
            // }
        }

        return result;
    }

    execute() {

        const owner = this.owner as Searcher;

        if (this.active()) {

            // only check the availability of the item if it is visible for the enemy

            if (this.regulator.ready()/* && this.owner.vision.visible(this.item.position)*/) {

                // if it was picked up by somebody else, mark the goal as failed

                // if (this.item.active === false) {
                if (
                    !this.item ||
                    !this.item.active ||
                    this.item.data?.packed) {

                    this.status = Goal.STATUS.FAILED;
                    // owner.entity.remove('Target');
                    delete owner.data.GetItemGoal.target;
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
