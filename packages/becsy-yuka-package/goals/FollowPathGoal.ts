import {FollowPathBehavior, Goal, OnPathBehavior, SteeringBehavior, Vector3, Vehicle} from "yuka";
import {PathComponent} from "../components";
// import {componentRegistry} from "../../yuka-package/entities";

// import {SteeringBehavior} from "yuka/src/steering/SteeringBehavior";

/**
 * Sub-goal for seeking the defined destination point.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 * @author {@link https://github.com/robp94|robp94}
 */
class FollowPathGoal extends Goal<any> {
  public to: any;

  constructor(owner: Vehicle) {
    super(owner);

    this.to = null;

    const hasFollowPath = this.owner.steering.behaviors.filter(
      (b: SteeringBehavior) => b instanceof FollowPathBehavior
    );
    const hasOnPath = this.owner.steering.behaviors.filter(
      (b: SteeringBehavior) => b instanceof OnPathBehavior
    );

    if (hasFollowPath.length < 1) {
      const followPathBehavior = new FollowPathBehavior();
      followPathBehavior.active = false;
      followPathBehavior.nextWaypointDistance = 20;
      this.owner.steering.add(followPathBehavior);
    }

    if (hasOnPath.length < 1) {
      this.owner.steering.add(new OnPathBehavior());
    }
  }

  activate() {
    const owner = this.owner;
    // const path = owner.data.path;

    if (!owner.components.has(PathComponent)) {
      this.status = Goal.STATUS.FAILED;
      return
    }

    // if (!this.path || this.path.length < 1) {
    //   // console.log("path", this.path);
    //   this.status = Goal.STATUS.FAILED;
    //   return
    // }
    //
    // const path = this.path;

    const path = owner.components.read(PathComponent).path;

    if (path !== null && path.length > 0) {
      // update path and steering

      let followPathBehavior;

      for (const behavior of owner.steering.behaviors) {
        behavior.active = false;

        if (behavior instanceof FollowPathBehavior) {
          followPathBehavior = behavior;
          followPathBehavior.active = true;
          followPathBehavior.path.clear();
        }

        if (behavior instanceof OnPathBehavior) {
          const onPathBehavior = owner.steering.behaviors[1];
          onPathBehavior.active = true;
        }
      }

      for (let i = 0, l = path.length; i < l; i++) {
        const waypoint = path[i];

        followPathBehavior?.path.add(waypoint);
      }

      //

      this.to = path[path.length - 1];
    } else {
      this.status = Goal.STATUS.FAILED;
    }
  }

  execute() {
    const owner = this.owner;
    if (!this.to) {
        this.status = Goal.STATUS.FAILED;
        return;
    }
    if (!owner.components.has(PathComponent)) return;

    const path = owner.components.read(PathComponent).path;
    if (!path || path.length < 1) {
        this.status = Goal.STATUS.FAILED;
        return;
    }

    if (this.active()) {

      const squareDistance = owner.position.squaredDistanceTo(this.to);
      // if (owner.atPosition(this.to)) {
      if (squareDistance < owner.boundingRadius * owner.boundingRadius) {
        this.status = Goal.STATUS.COMPLETED;
        // delete owner.data.path;
      }
    }
  }

  terminate() {
    const owner = this.owner;

    // for (const behavior of owner.steering.behaviors) {
    //   // behavior.active = false;
    // }
    //
    // if (owner.components.has(componentRegistry.PathComponent)) {
    //     owner.components.remove(componentRegistry.PathComponent);
    // }

    owner.velocity.set(0, 0, 0);
  }
}

export { FollowPathGoal };
