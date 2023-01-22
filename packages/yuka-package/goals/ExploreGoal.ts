import {CompositeGoal, Goal, Vector3, Vehicle} from "yuka";
import {FollowPathGoal} from "./FollowPathGoal";
import {FindPathGoal} from "./FindPathGoal";
import {PathPlanner} from "../core/PathPlanner";
import {InWorld, Vector3ToYuka} from "../core";
import {componentRegistry} from "../entities";

// export type Navigator = Vehicle & {
// 	world: {pathPlanner: PathPlanner}
// }
type Navigator = Vehicle & InWorld;

/**
 * Top-Level goal that is used to manage the map exploration
 * of the enemy.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
class ExploreGoal extends CompositeGoal<any> {
    constructor(owner: Vehicle) {
        super(owner);
    }

    activate() {
        const owner = this.owner;

        // if this goal is reactivated then there may be some existing subgoals that must be removed

        this.clearSubgoals();

        const region = owner.manager.pathPlanner.navMesh.getRandomRegion();

        if (!region) {
            this.status = Goal.STATUS.FAILED;
            return;
        }
        // let to = null;
        // if (!region && owner.components.has(componentRegistry.Target)) {
        //     const target = owner.components.read(componentRegistry.Target).value
        //
        //     to = Vector3ToYuka(target.read(componentRegistry.Position).position, new Vector3())
        //
        // } else if (region) {
        //     to = new Vector3().copy(region.centroid);
        // }
        //
        // if (!to) {
        //     this.status = Goal.STATUS.FAILED;
        //     return;
        // }
        const from = new Vector3().copy(owner.position);
        const to = new Vector3().copy( region.centroid );

        // setup subgoals

        this.addSubgoal(new FindPathGoal(owner, from, to));
        this.addSubgoal(new FollowPathGoal(owner));
    }

    execute() {
        this.status = this.executeSubgoals();

        this.replanIfFailed();

        if (this.owner.components.has(componentRegistry.Target)) {
            this.status = Goal.STATUS.COMPLETED;
        }
    }

    terminate() {
        this.clearSubgoals();
    }
}

export {ExploreGoal};
