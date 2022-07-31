import {CompositeGoal, Goal, Vector3, Vehicle} from 'yuka';
import { FollowPathGoal } from './FollowPathGoal';
import { FindPathGoal } from './FindPathGoal';
import {PathPlanner} from "../core/PathPlanner";
import {InWorld} from "../core";

// export type Navigator = Vehicle & {
// 	world: {pathPlanner: PathPlanner}
// }
type Navigator = Vehicle & InWorld
/**
* Top-Level goal that is used to manage the map exploration
* of the enemy.
*
* @author {@link https://github.com/Mugen87|Mugen87}
* @author {@link https://github.com/robp94|robp94}
*/
class ExploreGoal extends CompositeGoal <any> {

	constructor(owner: Navigator) {

		super(owner);

	}

	activate() {

		const owner = this.owner as Navigator;

		// if this goal is reactivated then there may be some existing subgoals that must be removed

		this.clearSubgoals();

		const region = owner.world?.PathPlanner.navMesh.getRandomRegion();

		const from = new Vector3().copy( owner.position );
		const to = new Vector3().copy( region.centroid );

		// setup subgoals

		this.addSubgoal( new FindPathGoal( owner, from, to ) );
		this.addSubgoal( new FollowPathGoal( owner ) );

	}

	execute() {

		this.status = this.executeSubgoals();

		this.replanIfFailed();

	}

	terminate() {

		this.clearSubgoals();

	}

}



export { ExploreGoal };
