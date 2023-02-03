import {CompositeGoal, Goal, Vector3, Vehicle} from "yuka";
import {FollowPathGoal} from "./FollowPathGoal";
import {FindPathGoal} from "./FindPathGoal";
import {NavigatorComponent, NavMeshComponent} from "../components";

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

        // const region = owner.manager.pathPlanner.navMesh.getRandomRegion();

        if (!owner.components.has(NavigatorComponent)) return;

        const e = owner.components.read(NavigatorComponent).navMesh;
        const {navMesh} = e.read(NavMeshComponent)

        const region = navMesh.getRandomRegion();

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

        let path: Vector3[] = [];

        // setup subgoals

        this.addSubgoal(new FindPathGoal(owner, from, to));
        this.addSubgoal(new FollowPathGoal(owner));
    }

    execute() {
        this.status = this.executeSubgoals();

        this.replanIfFailed();

    }

    terminate() {
        this.clearSubgoals();
    }
}

export {ExploreGoal};
