import {CompositeGoal, GameEntity, Goal, MemoryRecord, MemorySystem, Vector3, Vehicle} from "yuka";
import {FollowPathGoal} from "./FollowPathGoal";
import {FindPathGoal} from "./FindPathGoal";

/**
 * Sub-goal for searching the current target of an enemy.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
export class HuntGoal extends CompositeGoal<any> {
  record: MemoryRecord|null = null;
  constructor(owner: Vehicle, private target: GameEntity, private memory: MemorySystem) {
    super(owner);
  }

  activate() {
    this.clearSubgoals();

    const owner = this.owner;
    const target = this.target;
    const memory = this.memory;

    // seek to the last sensed position

    if (!memory.hasRecord(target)) {
      this.status = Goal.STATUS.FAILED;
      return;
    }
    const record = memory.getRecord(target);

    // it's important to use path finding since there might be obstacle
    // between the current and target position

    const from = new Vector3().copy(owner.position);
    const to = new Vector3().copy(record.lastSensedPosition);
    this.record = record;

    // setup subgoals
    this.addSubgoal(new FindPathGoal(owner, from, to));
    this.addSubgoal(new FollowPathGoal(owner));
  }

  execute() {
    const owner = this.owner;

    if (!this.record) {
      this.status = Goal.STATUS.FAILED;
      return;
    }
    // hunting is not necessary if the target becomes visible again

    if (
      this.record.visible &&
      this.record.entity &&
      this.record.entity.position.distanceTo(owner.position) < 5
    ) {
      this.status = Goal.STATUS.COMPLETED;
    } else {
      this.status = this.executeSubgoals();

      // if the enemy is at the last sensed position, forget about
      // the bot, update the target system and consider this goal as completed

      if (this.completed()) {
        this.memory.deleteRecord(this.target);
      } else {
        this.replanIfFailed();
      }
    }
  }

  terminate() {
    this.record = null;
    this.clearSubgoals();
  }
}

