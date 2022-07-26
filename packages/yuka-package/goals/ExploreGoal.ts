import {CompositeGoal, Goal, Vector3} from 'yuka';
import { FollowPathGoal } from './FollowPathGoal';
import { FindPathGoal } from './FindPathGoal';


/**
* Top-Level goal that is used to manage the map exploration
* of the enemy.
*
* @author {@link https://github.com/Mugen87|Mugen87}
* @author {@link https://github.com/robp94|robp94}
*/
class ExploreGoal extends CompositeGoal <any> {

	constructor( owner ) {

		super( owner );

	}

	activate() {

		const owner = this.owner;

		// if this goal is reactivated then there may be some existing subgoals that must be removed

		this.clearSubgoals();

		const region = owner.data.pathPlanner.navMesh.getRandomRegion();

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
