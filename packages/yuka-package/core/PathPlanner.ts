import {GameEntity, Graph, NavMesh, NavNode, TaskQueue, Vector3, Vehicle} from 'yuka';
import { PathPlannerTask } from './PathPlannerTask'
import {CONFIG} from "./Config";

/**
* Class for asynchronous path finding using Yuka's task features.
*
* @author {@link https://github.com/robp94|robp94}
*/
class PathPlanner {
  navMesh: NavMesh;
  private taskQueue: TaskQueue;

	constructor( navMesh: NavMesh ) {

		this.navMesh = navMesh;

		this.taskQueue = new TaskQueue();

	}

	/**
	* Creates a new task for pathfinding and adds the task to the queue.
	*
	* @param {Vehicle} vehicle - The vehicle for which the path is to be found.
	* @param {Vector3} from - The start point of the path.
	* @param {Vector3} to - The target point of the path.
	* @param {Function} callback - The callback which is called after the task is finished.
	*/
	findPath( vehicle: Vehicle, from: Vector3, to: Vector3, callback: any ) {

		const task = new PathPlannerTask( this, vehicle, from, to, callback );

		this.taskQueue.enqueue( task );

	}


  getIndex(graph: Graph, position: Vector3): NavNode {
    let result
    let min = Infinity
    //@ts-ignore
    for (const node of graph._nodes) {
      const dist = node[1].position.distanceTo(position);
      if (dist < min) {
        min = dist
        result = node
      }
    }

    return result;
  }

  // canMoveInDirection(entity: GameEntity, direction: Vector3, position: Vector3): boolean {
  //   position.copy( direction ).applyRotation( entity.rotation ).normalize();
  //   position.multiplyScalar( CONFIG.BOT.MOVEMENT.DODGE_SIZE ).add( entity.position );
  //
  //   const i = this.getIndex(this.graph, position)[1];
  //
  //   return i.position.distanceTo(entity.position) <= 10;
  // }
  canMoveInDirection(entity: GameEntity, direction: Vector3, position: Vector3) {

    position.copy( direction ).applyRotation( entity.rotation ).normalize();
    position.multiplyScalar( CONFIG.BOT.MOVEMENT.DODGE_SIZE ).add( entity.position );

    const navMesh = this.navMesh;
    const region = navMesh.getRegionForPoint( position, 1 );

    return region !== null;

  }

	/**
	* Update method of the path planenr.
	*/
	update() {

		this.taskQueue.update();

	}



}

export { PathPlanner };
