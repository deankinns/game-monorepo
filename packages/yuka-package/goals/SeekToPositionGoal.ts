import {
  ArriveBehavior,
  FleeBehavior,
  FollowPathBehavior,
  Goal,
  Vector3,
  Vehicle,
} from "yuka";

/**
 * Sub-goal for seeking a target position.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
class SeekToPositionGoal extends Goal<any> {
  public target: any;

  constructor(owner: Vehicle, target = new Vector3()) {
    super(owner);

    this.target = target;
  }

  activate() {
    const owner = this.owner;

    for (const behavior of owner.steering.behaviors) {
      behavior.active = false;
      if (behavior instanceof ArriveBehavior) {
        behavior.target.copy(this.target);
        behavior.active = true;
      }
      if (behavior instanceof FleeBehavior) {
        behavior.active = false;
        behavior.panicDistance = 0;
      }
    }
  }

  execute() {
    if (this.owner.position.squaredDistanceTo(this.target) < 40) {
      // if ( this.owner.atPosition( this.target ) ) {

      this.status = Goal.STATUS.COMPLETED;
    }
  }

  terminate() {
    // const seekBehavior = this.owner.steering.behaviors[ 2 ];
    // const seekBehavior = this.owner.steering.behaviors[0] as ArriveBehavior;
    for (const behavior of this.owner.steering.behaviors) {
      (behavior as ArriveBehavior).active = false;
    }

    // seekBehavior.active = false;
  }
}

export { SeekToPositionGoal };
