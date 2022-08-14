import { AStar, GameEntity, Goal, Vector3 /*, Vehicle*/ } from "yuka";
import { InWorld, PathPlanner } from "../core";
import { componentRegistry, Vehicle } from "../entities";
import _ from "lodash";

interface Finder extends Vehicle, InWorld {
  data: { path?: Vector3[] };
}

interface Navigator extends Vehicle, InWorld {}

export class FindPathGoal extends Goal<Vehicle> {
  public from: Vector3;
  public to: Vector3;

  constructor(owner: Vehicle, from: Vector3, to: Vector3) {
    // _.defaultsDeep(owner, {data: {}});
    super(owner);

    this.from = from;
    this.to = to;
  }

  activate() {
    const owner = this.owner as Finder;

    delete owner.data?.path;
    owner.world?.PathPlanner.findPath(owner, this.from, this.to, onPathFound);

    if (owner.components.has(componentRegistry.PathRequestComponent)) {
      owner.components.remove(componentRegistry.PathRequestComponent);
    }

    owner.components.add(componentRegistry.PathRequestComponent, {
      from: [this.from.x, this.from.y, this.from.z],
      to: [this.to.x, this.to.y, this.to.z],
    });
  }

  execute() {
    const owner = this.owner as Finder;
    if (owner.data?.path) {
      // when a path was found, mark this goal as completed
      this.status = Goal.STATUS.COMPLETED;
    }

    if (owner.components.has(componentRegistry.PathComponent)) {
      this.status = Goal.STATUS.COMPLETED;
    }
  }
}

function onPathFound(owner: Finder, path: Vector3[]) {
  owner.data.path = path;
  owner.components.add(componentRegistry.PathComponent, { path: path });
}
