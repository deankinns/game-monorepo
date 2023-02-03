import {Goal, CompositeGoal, Vector3, Vehicle, GameEntity} from "yuka";
import { SeekToPositionGoal } from "./SeekToPositionGoal";
import { Feature } from "../Feature";
import {Target} from "becsy-package";
import {GameEntityComponent} from "../systems";
import {NavigatorComponent, NavMeshComponent} from "../components";
// import {componentRegistry} from "yuka-package/entities";

const right = new Vector3(1, 0, 0);
const left = new Vector3(-1, 0, 0);

/**
 * Sub-goal which makes the enemy dodge from side to side.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
class DodgeGoal extends CompositeGoal<any> {
  public right: any;
  public targetPosition: Vector3;

  constructor(owner: Vehicle, right: boolean, private target: GameEntity) {
    super(owner);

    this.right = right;
    this.targetPosition = new Vector3();
  }

  activate() {
    this.clearSubgoals();

    const owner = this.owner;


    const e = owner.components.read(NavigatorComponent).navMesh;
    const {navMesh} = e.read(NavMeshComponent)

    if (this.right) {
      // dodge to right as long as there is enough space

      if (Feature.canMoveInDirection(owner, right, this.targetPosition, navMesh)) {
        this.addSubgoal(new SeekToPositionGoal(owner, this.targetPosition));
      } else {
        // no space anymore, now dodge to left

        this.right = false;
        this.status = Goal.STATUS.INACTIVE;
      }
    } else {
      // dodge to left as long as there is enough space

      // const canMoveInDirection = (entity, direction, target) => {
      //   return true;
      // }

      if (Feature.canMoveInDirection(owner, left, this.targetPosition, navMesh)) {
        this.addSubgoal(new SeekToPositionGoal(owner, this.targetPosition));
      } else {
        // no space anymore, now dodge to right

        this.right = true;
        this.status = Goal.STATUS.INACTIVE;
      }
    }
  }

  execute() {
    if (this.active()) {
      const owner = this.owner;

      const target = owner.components.read(Target).value;
      if (!target.__valid || !target.alive) return
      const targetEntity = target.read(GameEntityComponent).entity;

      // stop executing if the traget is not visible anymore

      // const isTargetShootable = () => {
      //   return true;
      // };
      // Feature.isTargetShootable(owner, isTargetShootable);

      if (Feature.isTargetShootable(owner, targetEntity) === false) {
        this.status = Goal.STATUS.COMPLETED;
      } else {
        this.status = this.executeSubgoals();

        this.replanIfFailed();

        // if completed, set the status to inactive in order to repeat the goal

        if (this.completed()) this.status = Goal.STATUS.INACTIVE;
      }
    }
  }

  terminate() {
    this.clearSubgoals();
  }
}

export { DodgeGoal };
