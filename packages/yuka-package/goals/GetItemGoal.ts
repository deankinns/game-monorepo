import {CompositeGoal, Vector3, Goal, Regulator} from "yuka";
import {FindPathGoal} from "./FindPathGoal";
import {FollowPathGoal} from "./FollowPathGoal";
import {CONFIG, Vector3ToYuka} from "../core";
// import {CollectableComponent, Target} from "../../becsy/components";
import {SeekToPositionGoal} from "./SeekToPositionGoal";
import {PickUpCollectibleGoal} from "./PickUpCollectibleGoal";
import {InWorld, PathPlanner, TYPE_COLLECTIBLE} from "../core";
import _ from "lodash";
import {
    componentRegistry,
    componentWrapper,
    GameEntity, PathComponent,
    Vehicle,
} from "../entities";
import {Feature} from "../core/Feature";
// import {Packed} from "../../becsy/systems";

const result = {distance: Infinity, item: null};

export type Searcher = Vehicle & {
    data: { GetItemGoal: { target?: GameEntity } };
    // entity: {has: any, add: any, remove: any}
} & InWorld;
// type Collectible = GameEntity & {
//     // entity: {has: any, add: any}
//     type: any[]
// }

const {Target} = componentRegistry;

/**
 * Goal to get an item of the given item type.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
class GetItemGoal extends CompositeGoal<Vehicle> {
    private itemType: any;
    item?: GameEntity | null;
    private regulator: Regulator;

    /**
     * Constructs a new GetItemGoal with the given values.
     *
     * @param owner - The owner of this goal.
     * @param itemType - The type of the item.
     * @param item - The exact item to get.
     */
    constructor(owner: Vehicle, itemType: any, item: any = null) {
        // _.defaultsDeep(owner, {data: {GetItemGoal: {}}})
        super(owner);

        this.itemType = itemType;
        this.item = item;

        this.regulator = new Regulator(
            CONFIG.BOT.GOAL.ITEM_VISIBILITY_UPDATE_FREQUENCY
        );
    }

    activate(): void {
        const owner = this.owner;

        if (!owner) {
            this.status = Goal.STATUS.FAILED;
            return
        }
        // if this goal is reactivated then there may be some existing subgoals that must be removed

        this.clearSubgoals();

        // if (owner.entity.has(Target)) {
        //   owner.entity.remove(Target)
        // }

        // get closest available item of the given type

        // owner.world.getClosestItem( owner, this.itemType, result );

        // this.item = result.item;
        // if (!this.item) {
        //     // this.item = this.getClosestCollectable(owner);
        //
        //     const {result} = Feature.distanceToItem(owner, this.itemType);
        //     this.item = result;
        // }


        if (this.item) {

            try {
                if (!this.item.components || !this.item.components.alive) {
                    this.status = Goal.STATUS.FAILED;
                    return
                }
            } catch (e) {
                this.status = Goal.STATUS.FAILED;
                return
            }


            if (!owner.components.has(componentRegistry.Target)) {
                owner.components.add(componentRegistry.Target, {
                    value: this.item.components,
                });
                // this.owner.data.GetItemGoal.target = this.item
            } else {
                const target = owner.components.read(componentRegistry.Target).value;
                if (!target || !target.has(this.itemType)) {
                    this.status = Goal.STATUS.FAILED;
                    return
                }
            }

            // if an item was found, try to pick it up

            const from = new Vector3().copy(owner.position);
            const to = new Vector3().copy(this.item.position);

            // setup subgoals

            this.addSubgoal(new FindPathGoal(owner, from, to));
            this.addSubgoal(new FollowPathGoal(owner));

            this.addSubgoal(new PickUpCollectibleGoal(owner, this.item));
        } else {
            //if (this.owner.data.GetItemGoal.target) {
            if (owner.components.has(componentRegistry.Target)) {
                owner.components.remove(componentRegistry.Target);
            }
            // if no item was returned, there is nothing to pick up.
            // mark the goal as failed

            this.status = Goal.STATUS.FAILED;

            // ensure the bot does not look for this type of item for a while

            // owner.ignoreItem(this.itemType);
        }
    }

    getClosestCollectable(owner: Vehicle) {
        let result = null;
        // const entities = (owner.manager?.entities ?? []) as (GameEntity & { type: any[], packed?: any })[];
        let minDistance = Infinity;

        for (const entity of owner.manager?.entities as GameEntity[]) {
            // if (entity !== owner && entity instanceof Collectible && !entity.pickedUp) {

            // if (_.difference([TYPE_COLLECTIBLE, this.itemType], entity.type).length === 0 && !entity.packed) {
            if (
                entity.components.has(this.itemType) &&
                entity.components.has(componentRegistry.Collectable) &&
                !entity.components.has(componentRegistry.Packed)
            ) {
                const squaredDistance = owner.position.squaredDistanceTo(
                    entity.position
                );
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
        const owner = this.owner as Vehicle;

        // if (!target)
        if (!owner.components.has(componentRegistry.Target)) {
            this.status = Goal.STATUS.FAILED;
            return;
        }
        const target = owner.components.read(componentRegistry.Target).value;

        // const target = owner.components.read(componentRegistry.Target).value;
        //
        // if (owner.components.has(componentRegistry.PathComponent)) {
        //     const path = owner.components.read(componentRegistry.PathComponent).path;
        //
        //     if (path.length > 0) {
        //         const end = path[path.length - 1] as Vector3;
        //         const {position} = target.read(componentRegistry.Position);
        //
        //         if (end.distanceTo(new Vector3(position.x, position.y, position.z )) > 10) {
        //             // path.pop();
        //             owner.remove(componentRegistry.PathComponent)
        //         }
        //     }
        // }

        if (!target || target.has(componentRegistry.Packed)) {
            this.status = Goal.STATUS.FAILED;
            return;
        }

        if (this.active()) {
            // only check the availability of the item if it is visible for the enemy


            // const brain = owner.components.read(componentRegistry.BrainComponent).object;
            const currentSubgoal = this.currentSubgoal();
            if (currentSubgoal instanceof FollowPathGoal) {
                const tagertpos = target.read(componentRegistry.PositionComponent).position;
                const d = currentSubgoal.to.distanceTo(new Vector3(tagertpos.x, tagertpos.y, tagertpos.z));

                if (d > 10) {
                    this.status = Goal.STATUS.FAILED;
                    return;
                }
            }
            if (
                this.regulator.ready() &&
                target /* && this.owner.vision.visible(this.item.position)*/
            ) {
                // if it was picked up by somebody else, mark the goal as failed

                // if (this.item.active === false) {
                if (
                    !this.item ||
                    !this.item.active ||
                    // this.item.data?.packed
                    target.has(componentRegistry.Packed)
                ) {
                    this.status = Goal.STATUS.FAILED;
                    owner.components.remove(componentRegistry.Target);
                    // delete owner.data.GetItemGoal.target;
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
