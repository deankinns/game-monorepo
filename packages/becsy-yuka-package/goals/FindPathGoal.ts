import {Goal, Vector3} from "yuka";
import {Vehicle} from "../entities";
import {NavigatorComponent, NavMeshComponent, PathComponent, PathRequestComponent} from "../components";

export class FindPathGoal extends Goal<any> {
    public from: Vector3;
    public to: Vector3;

    constructor(owner: Vehicle, from: Vector3, to: Vector3) {
        // _.defaultsDeep(owner, {data: {}});
        super(owner);

        this.from = from;
        this.to = to;
    }

    activate() {
        const owner = this.owner;

        // const pathPlanner = owner.manager.pathPlanner
        const e = owner.components.read(NavigatorComponent).navMesh;
        const {pathPlanner} = e.read(NavMeshComponent)

        if (!pathPlanner) return;

        pathPlanner.findPath(owner, this.from, this.to, onPathFound);

        if (owner.components.has(PathRequestComponent)) {
            owner.components.remove(PathRequestComponent);
        }

        owner.components.add(PathRequestComponent, {
            from: [this.from.x, this.from.y, this.from.z],
            to: [this.to.x, this.to.y, this.to.z],
        });
    }

    execute() {
        const owner = this.owner as Vehicle;
        // if (owner.data?.path) {
        //   // when a path was found, mark this goal as completed
        //   this.status = Goal.STATUS.COMPLETED;
        // }

        if (owner.components.has(PathComponent)) {
            this.status = Goal.STATUS.COMPLETED;
        }
    }
}

function onPathFound(owner: Vehicle, path: Vector3[]) {
    if (owner.components.has(PathComponent)) {
        owner.components.remove(PathComponent);
    }
    owner.components.add(PathComponent, {path: path});
}
