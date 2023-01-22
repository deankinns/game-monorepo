import { CompositeGoal, GameEntity, Goal, Vector3 } from "yuka";
import { HuntGoal } from "./HuntGoal";
import { DodgeGoal } from "./DodgeGoal";
import { ChargeGoal } from "./ChargeGoal";
import { PathPlanner } from "../core";
import _ from "lodash";
import { Attacker, InWorld } from "../core/Types";
import {componentRegistry, Vehicle} from "../entities";
import { Feature } from "../core/Feature";
// import {AIComponent, Target} from "../../becsy/components";

const left = new Vector3(-1, 0, 0);
const right = new Vector3(1, 0, 0);
const targetPosition = new Vector3();

// type Attacker = Vehicle & {
//     data: { AttackGoal: { target: GameEntity } }
//     world: { pathPlanner: PathPlanner }
// }
//
// const defaultAttacker = {
//     data: {AttackGoal: {}}
// }
// function isT<T>(arg:any): arg is <T> {
// }

// type GoalSubject = Vehicle & Attacker & InWorld;
interface GoalSubject extends Vehicle, Attacker, InWorld {}
//
// This can live anywhere in your codebase:
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
//
// class GoalSubject implements Vehicle, Attacker, InWorld {
//
// }
//

/**
 * Top-Level goal that is used to manage the attack on a target.
 *
 * @author {@link https://github.com/Mugen87|Mugen87}
 */
export class AttackGoal extends CompositeGoal<Vehicle> {
  // constructor(owner: Vehicle) {
  //   super(owner as GoalSubject);
  // }
  // private target: GameEntity;

    constructor(owner: Vehicle, private target: GameEntity) {
      super(owner);
    }

  activate() {
    // if this goal is reactivated then there may be some existing subgoals that must be removed

    this.clearSubgoals();

    const owner = this.owner as Vehicle | any;

    // if the enemy is able to shoot the target (there is line of sight between enemy and
    // target), then select a tactic to follow while shooting

    // const isTargetShootable = (target: any): boolean => {
    //   // let result = false;
    //   // if (target.has(AIComponent)) {
    //   //   const hasNeighbour = owner.neighbors.filter(n => {
    //   //     if (n.entity === target) {
    //   //       return true;
    //   //     }
    //   //     return false;
    //   //   })
    //   //   result = hasNeighbour.length > 0
    //   // }
    //   //
    //   // return result;
    //   return true;
    // };

    // const canMoveInDirection = (entity, direction, target): boolean => {
    //   return false;
    // }

    if (
        !owner.components.has(componentRegistry.Target)
    ) {
    // if (!owner.AttackTarget) {
      this.status = Goal.STATUS.FAILED;
      return;
    }

    const target = owner.components.read(componentRegistry.Target).value

    if (!target
        || !target.has(componentRegistry.GameEntityComponent)
        || !target.has(componentRegistry.Health)
    ) {
      this.status = Goal.STATUS.FAILED;
      return;
    }

    const targetVehicle = target.read(componentRegistry.GameEntityComponent).entity;
    // const target = owner.entity.read(Target).value
    // const target = owner.AttackTarget;

    // owner.manager.pathPlanner;

    if (Feature.isTargetShootable(owner, targetVehicle) === true) {
      // if the enemy has space to strafe then do so

      if (
        Feature.canMoveInDirection(owner, left, targetPosition)
      ) {
        this.addSubgoal(new DodgeGoal(owner, false));
      } else if (
          Feature.canMoveInDirection(owner, right, targetPosition)
      ) {
        this.addSubgoal(new DodgeGoal(owner, true));
      } else {
        // if not able to strafe, charge at the target's position

        if (owner.position.distanceTo(targetVehicle.position) > 10){
          this.addSubgoal(new ChargeGoal(owner, targetVehicle));
        }

      }
    } else {
      // if the target is not visible, go hunt it

      this.addSubgoal(new HuntGoal(owner));
    }
  }

  execute() {
    // it is possible for a enemy's target to die while this goal is active so we
    // must test to make sure the enemy always has an active target

    const owner = this.owner as GoalSubject;

    // if ( owner.targetSystem.hasTarget() === false ) {
    // if (!owner.AttackTarget) {
    if (!owner.components.has(componentRegistry.Target)) {
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

    const target = owner.components.read(componentRegistry.Target).value
    if (!target
        || !target.has(componentRegistry.GameEntityComponent)
        || !target.has(componentRegistry.Health)
    ) {
      this.status = Goal.STATUS.FAILED;
      return;
    }

    const health = target.read(componentRegistry.Health).health

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
