import {CompositeGoal, Goal, Vector3} from "yuka";
import { HuntGoal } from "./HuntGoal";
import { DodgeGoal } from "./DodgeGoal";
import { ChargeGoal } from "./ChargeGoal";
import { Feature } from "../Feature";
import {GameEntity, Vehicle} from "../entities";
import {Health, Target} from "becsy-package";
import {GameEntityComponent} from "../systems";
import {MemoryComponent, NavigatorComponent, NavMeshComponent} from "../components";

const left = new Vector3(-1, 0, 0);
const right = new Vector3(1, 0, 0);
const targetPosition = new Vector3();


/**
 * Top-Level goal that is used to manage the attack on a target.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
export class AttackGoal extends CompositeGoal<any> {

    constructor(owner: Vehicle, private target: GameEntity) {
      super(owner);
    }

  activate() {
    // if this goal is reactivated then there may be some existing subgoals that must be removed

    this.clearSubgoals();

    const owner = this.owner as Vehicle | any;

    // if the enemy is able to shoot the target (there is line of sight between enemy and
    // target), then select a tactic to follow while shooting

    const target = this.target.components;

    // if (
    //     !owner.components.has(Target)
    // ) {
    // // if (!owner.AttackTarget) {
    //   this.status = Goal.STATUS.FAILED;
    //   return;
    // }
    //
    // const target = owner.components.read(Target).value
    //
    // if (!target
    //     || !target.has(GameEntityComponent)
    //     || !target.has(Health)
    // ) {
    //   this.status = Goal.STATUS.FAILED;
    //   return;
    // }

    const targetVehicle = this.target

    const memory = owner.components.read(MemoryComponent).system;
    // const targetVehicle = target.read(GameEntityComponent).entity;
    // const target = owner.entity.read(Target).value
    // const target = owner.AttackTarget;

    // owner.manager.pathPlanner;

    const e = owner.components.read(NavigatorComponent).navMesh;
    const {navMesh} = e.read(NavMeshComponent)

    if (Feature.isTargetShootable(owner, targetVehicle) === true) {
      // if the enemy has space to strafe then do so

      if (
        Feature.canMoveInDirection(owner, left, targetPosition, navMesh)
      ) {
        this.addSubgoal(new DodgeGoal(owner, false, targetVehicle));
      } else if (
          Feature.canMoveInDirection(owner, right, targetPosition, navMesh)
      ) {
        this.addSubgoal(new DodgeGoal(owner, true, targetVehicle));
      } else {
        // if not able to strafe, charge at the target's position

        if (owner.position.distanceTo(targetVehicle.position) > 10){
          this.addSubgoal(new ChargeGoal(owner, targetVehicle));
        }

      }
    } else {
      // if the target is not visible, go hunt it

      this.addSubgoal(new HuntGoal(owner, targetVehicle, memory));
    }
  }

  execute() {
    // it is possible for a enemy's target to die while this goal is active so we
    // must test to make sure the enemy always has an active target

    const owner = this.owner// as GoalSubject;

    // if ( owner.targetSystem.hasTarget() === false ) {
    // if (!owner.AttackTarget) {
    if (!owner?.components.has(Target)) {
      this.status = Goal.STATUS.COMPLETED;
        return;
    } else {
      const currentSubgoal = this.currentSubgoal();
      const status = this.executeSubgoals();

      if (currentSubgoal instanceof DodgeGoal && currentSubgoal.inactive()) {
        // inactive dogde goals should be reactivated but without reactivating the enire attack goal

        this.status = Goal.STATUS.ACTIVE;
      } else {
        this.status = status;

        this.replanIfFailed();
      }
    }

    const target = this.target.components;
    // const target = owner.components.read(Target).value
    if (!target
        || !target.has(GameEntityComponent)
        || !target.has(Health)
    ) {
      this.status = Goal.STATUS.FAILED;
      return;
    }

    const health = target.read(Health).health

    if (health < 0) {
        this.status = Goal.STATUS.COMPLETED;
    }

  }

  terminate() {
    this.clearSubgoals();
    // delete this.owner.entity.AttackGoal
  }
}

//
// export {AttackGoal};
