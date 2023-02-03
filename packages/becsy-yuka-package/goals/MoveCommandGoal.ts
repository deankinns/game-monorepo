import {CompositeGoal, Goal, Vector3} from "yuka";
import {FindPathGoal} from "./FindPathGoal";
import {FollowPathGoal} from "./FollowPathGoal";
import {Vehicle} from "../entities";


export class MoveCommandGoal extends CompositeGoal<any> {
    constructor(owner: Vehicle, public target: Vector3) {
        super(owner);
    }

    activate() {
        this.clearSubgoals();

        const owner = this.owner;
        this.addSubgoal(new FindPathGoal(owner, new Vector3().copy(owner.position), this.target));
        this.addSubgoal(new FollowPathGoal(owner));
    }

    execute() {
        const owner = this.owner as Vehicle;

        this.status = this.executeSubgoals();

        this.replanIfFailed();

        if (owner.position.squaredDistanceTo(this.target) < owner.boundingRadius * owner.boundingRadius) {

            this.status = Goal.STATUS.COMPLETED;
        }
    }
}