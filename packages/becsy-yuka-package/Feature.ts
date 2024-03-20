import { CONFIG } from "../yuka-package/core/Config";
import {
  WEAPON_TYPES_BLASTER,
  WEAPON_TYPES_SHOTGUN,
  WEAPON_TYPES_ASSAULT_RIFLE,
} from "../yuka-package/core/Constants";
import {EntityManager, GameEntity, MathUtils, MovingEntity, NavMesh, Vector3, Vehicle} from "yuka";
// import {GameEntity, MovingEntity, Vehicle} from "../entities";
import _ from "lodash";
import {Health, Inventory, Packed, Weapon} from "becsy-package";
import {MemoryComponent} from "./components";
// import { componentRegistry } from "../yuka-package/entities/Components";
// import {Vehicle} from "../entities/Vehicle";
// import {Vehicle} from "../entities/Vehicle";
// import {Health, Inventory, Weapon} from "../../becsy/systems";
//import {Object3DComponent} from "../../becsy/components";

export class Feature {
  static totalWeaponStrength(enemy: Vehicle & { components?: any }) {
    let total = 0;

    if (enemy.components.has(Inventory)) {
      const inventory = enemy.components.read(Inventory);
      if (!(inventory instanceof Inventory)) return 0;
    // if (enemy.data.inventory) {
      // const inventory = enemy.entity.read('Inventory');
      // for (const entity of enemy.data.inventory) {
      for (const entity of inventory.contents) {
        if (entity.has(Weapon)) {
          total += 1;
        }
      }
    }

    return total;
    //
    // const weaponSystem = enemy.weaponSystem;
    //
    // const ammoBlaster = weaponSystem.getRemainingAmmoForWeapon( WEAPON_TYPES_BLASTER );
    // const ammoShotgun = weaponSystem.getRemainingAmmoForWeapon( WEAPON_TYPES_SHOTGUN );
    // const ammoAssaultRifle = weaponSystem.getRemainingAmmoForWeapon( WEAPON_TYPES_ASSAULT_RIFLE );
    //
    // const f1 = ammoBlaster / CONFIG.BLASTER.MAX_AMMO;
    // const f2 = ammoShotgun / CONFIG.SHOTGUN.MAX_AMMO;
    // const f3 = ammoAssaultRifle / CONFIG.ASSAULT_RIFLE.MAX_AMMO;
    //
    // return ( f1 + f2 + f3 ) / 3;
  }

  /**
   * Computes the health score.
   *
   * @param {Enemy} enemy - The enemy this score is computed for.
   * @return {Number} The health score.
   */
  static health(enemy: Vehicle & { components?: any }) {
    if (enemy.components.has(Health)) {
      // const {health, maxHealth} = enemy.data;
      const { health, maxHealth } = enemy.components.read(
        Health
      );
      return health > 0 ? health / maxHealth : 0;
    }

    return 0;
  }

  static distanceToItem(enemy: Vehicle & { components?: any }, itemType: any) {
    let score = Infinity;
    let result: GameEntity|null = null;

    let minDist = Infinity;
    const manager = enemy.manager as EntityManager;

    // enemy.world.getClosestItem( enemy, itemType, result );

    for (const entity of manager.entities as (GameEntity  & { components?: any })[]) {
      // if (_.includes(entity.type, itemType) && !entity.packed) {
      if (
        entity.components.has(itemType) &&
        !entity.components.has(Packed)
      ) {
        // if (entity) {
        const dist = enemy.position.distanceTo(entity.position);
        if (dist < minDist) {
          result = entity;
          minDist = dist;
        }
        // }
      }
    }

    if (result) {
      // let distance = minDist;
      //
      // distance = MathUtils.clamp(
      //   distance,
      //   CONFIG.BOT.MIN_ITEM_RANGE,
      //   CONFIG.BOT.MAX_ITEM_RANGE
      // );
      //
      // score = distance / CONFIG.BOT.MAX_ITEM_RANGE;
        score = Feature.distanceScore(minDist);
    }

    return {score, result};
  }

  static distanceScore(distance: number) {
    distance = MathUtils.clamp(
        distance,
        CONFIG.BOT.MIN_ITEM_RANGE,
        CONFIG.BOT.MAX_ITEM_RANGE
    );

    return distance / CONFIG.BOT.MAX_ITEM_RANGE;
  }

  static getClosestItem(enemy: Vehicle & { components?: any }, itemType: any) {
    enemy.components.has(MemoryComponent);
  }

  static individualWeaponStrength(enemy: Vehicle, weaponType: any) {
    return Feature.totalWeaponStrength(enemy);

    // const weapon = enemy.weaponSystem.getWeapon( weaponType );
    //
    // return ( weapon ) ? ( weapon.ammo / weapon.maxAmmo ) : 0;
  }

  /**
   * Returns true if the enemy can move a step to the given dirction without
   * leaving the level. The new position vector is stored into the given vector.
   *
   * @param entity
   * @param {Vector3} direction - The direction vector.
   * @param {Vector3} position - The new position vector.
   * @param navMesh
   * @return {Boolean} Whether the enemy can move a bit to the left or not.
   */
  static canMoveInDirection(
    entity: Vehicle & { manager: any },
    direction: Vector3,
    position: Vector3,
    navMesh: NavMesh,
  ) {
    // return false
    position.copy(direction).applyRotation(entity.rotation).normalize();
    position
      .multiplyScalar(CONFIG.BOT.MOVEMENT.DODGE_SIZE)
      .add(entity.position);

    // const navMesh = entity.manager.pathPlanner.navMesh;
    const region = navMesh.getRegionForPoint(position, 10);

    return region !== null;
  }

  static isTargetShootable(enemy: (GameEntity | MovingEntity | Vehicle) & { components?: any }, target: (GameEntity | MovingEntity | Vehicle) & { components?: any }) {

    if (!enemy.components.has(MemoryComponent)) return false;

    const memory = enemy.components.read(MemoryComponent).system;

    const record = memory.getRecord(target);

    if (!record) return false;

    return record.visible;
  }
}
