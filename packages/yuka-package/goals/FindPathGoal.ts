import {AStar, GameEntity, Goal, Vector3/*, Vehicle*/} from 'yuka';
import {InWorld, PathPlanner} from "../core";
import {Vehicle} from '../entities';
import _ from 'lodash';

interface Finder extends Vehicle, InWorld {
    data: { path?: Vector3[] }
}

interface Navigator extends Vehicle, InWorld {
}

export class FindPathGoal extends Goal<Finder> {
    public from: Vector3;
    public to: Vector3;

    constructor(owner: Navigator, from: Vector3, to: Vector3) {
        _.defaultsDeep(owner, {data: {}});
        super(owner as Finder);

        this.from = from;
        this.to = to;
    }

    activate() {
        const owner = (this.owner as Finder);

        delete owner.data?.path;
        owner.world.PathPlanner.findPath(owner, this.from, this.to, onPathFound)
    }

    execute() {
        const owner = this.owner as Finder;
        if (owner.data?.path) {
            // when a path was found, mark this goal as completed
            this.status = Goal.STATUS.COMPLETED;
        }
    }
}

function onPathFound(owner: Finder, path: Vector3[]) {
    owner.data.path = path;
}
