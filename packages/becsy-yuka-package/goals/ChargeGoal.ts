import {Goal, CompositeGoal, Vector3, Vehicle, GameEntity} from "yuka";
import {FollowPathGoal} from "./FollowPathGoal";
import {FindPathGoal} from "./FindPathGoal";
import {Feature} from "../Feature";

/**
 * Sub-goal for seeking the enemy's target during a battle.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
export class ChargeGoal extends CompositeGoal<any> {
    constructor(owner: Vehicle, private target: GameEntity) {
        super(owner);
    }

    activate() {
        this.clearSubgoals();

        const owner = this.owner;

        // seek to the current position of the target

        // const target = owner.components.read(componentRegistry.Target).value
        // const targetVehicle = target.read(componentRegistry.GameEntityComponent).entity;
        // const target = owner.targetSystem.getTarget();

        // it's important to use path finding since an enemy might be visible
        // but not directly reachable via a seek behavior because of an obstacle

        const from = new Vector3().copy(owner.position);
        const to = new Vector3().copy(this.target.position);

        // setup subgoals

        this.addSubgoal(new FindPathGoal(owner, from, to));
        this.addSubgoal(new FollowPathGoal(owner));

        // this.addSubgoal(new SeekToPositionGoal(owner, to));
    }

    execute() {
        // stop executing if the traget is not visible anymore

        // if (this.owner.targetSystem.isTargetShootable() === false) {
        if (Feature.isTargetShootable(this.owner, this.target) === false) {
            this.status = Goal.STATUS.COMPLETED;
        } else {
            this.status = this.executeSubgoals();

            this.replanIfFailed();
        }
    }

    terminate() {
        this.clearSubgoals();
    }
}
