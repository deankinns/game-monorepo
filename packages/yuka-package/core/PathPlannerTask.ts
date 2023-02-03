import {AStar, Graph, NavNode, Task, Vector3, Vehicle} from "yuka";
import { PathPlanner } from "./PathPlanner";
// import { Vehicle } from "../entities/Vehicle";

/**
 * Class for representing a single path planning task.
 *
 * @author {@link https://github.com/robp94|robp94}
 */
class PathPlannerTask extends Task {
  private callback: any;
  private planner: PathPlanner;
  private vehicle: Vehicle;
  private from: Vector3;
  private to: Vector3;

  /**
   * Construct a new PathPlannerTask with the given arguments.
   *
   * @param {PathPlanner} planner - The path planner which created this task.
   * @param {Vehicle} vehicle - The vehicle for which the path is to be found.
   * @param {Vector3} from - The start point of the path.
   * @param {Vector3} to - The target point of the path.
   * @param {Function} callback - The callback which is called after the task is finished.
   */
  constructor(planner: PathPlanner, vehicle: Vehicle, from: Vector3, to: Vector3, callback: Function) {
    super();

    this.callback = callback;
    this.planner = planner;
    this.vehicle = vehicle;
    this.from = from;
    this.to = to;
  }

  /**
   * This function executes the path finding and afterwards the callback function.
   */
  execute() {
    // const from = this.planner.getIndex(this.planner.graph, this.from)[1]
    // const to = this.planner.getIndex(this.planner.graph, this.to)[1]

    const path = this.planner.navMesh.findPath(this.from, this.to);
    // const path = this.findPath(this.planner.graph, from.index, to.index)

    this.callback(this.vehicle, path);
  }

  findPath(graph: Graph, from: number, to: number): Vector3[] {
    const graphSearch = new AStar(graph, from, to);

    // this.planner.graph.

    graphSearch.search();

    // const searchTree = graphSearch.getSearchTree();
    const path = graphSearch.getPath();

    const ret = path.map((i) => {
      //@ts-ignore
      return graph.getNode(i).position;
    });

    ret.push(this.to);

    return ret;
  }
}

export { PathPlannerTask };
