import {CONFIG} from './Config';
import {WEAPON_TYPES_BLASTER, WEAPON_TYPES_SHOTGUN, WEAPON_TYPES_ASSAULT_RIFLE} from './Constants';
import {MathUtils} from "yuka";
import {Vehicle} from "../entities/Vehicle";
// import {Vehicle} from "../entities/Vehicle";
// import {Health, Inventory, Weapon} from "../../becsy/systems";
//import {Object3DComponent} from "../../becsy/components";

export class Feature {
  static totalWeaponStrength(enemy) {

    let total = 0;

    if (enemy.entity.has('Inventory')) {

      const inventory = enemy.entity.read('Inventory');
      for (const entity of inventory.contents) {
        if (entity.has('Weapon')) {
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
  static health(enemy) {

    if (enemy.entity.has('Health')) {
      const {health, maxHealth} = enemy.entity.read('Health');

      return health / maxHealth;
    }

    return 0;

  }

  static distanceToItem(enemy: Vehicle, itemType) {

    let score = Infinity;
    let result = null;

    let minDist = Infinity

    // enemy.world.getClosestItem( enemy, itemType, result );

    for (const entity of enemy.manager.entities as any) {
      if (entity.entity && entity.entity.has(itemType)) {
        if (!result) {
          result = entity;
        }

        // if (entity) {
        const dist = result.position.distanceTo(entity.position)
        if (dist < minDist) {
          result = entity;
          minDist = dist
        }
        // }

      }
    }

    if (result) {

      let distance = minDist;

      distance = MathUtils.clamp(distance, CONFIG.BOT.MIN_ITEM_RANGE, CONFIG.BOT.MAX_ITEM_RANGE);

      score = distance / CONFIG.BOT.MAX_ITEM_RANGE;

    }

    return score;

  }

  static individualWeaponStrength(enemy, weaponType) {

    return Feature.totalWeaponStrength(enemy)

    // const weapon = enemy.weaponSystem.getWeapon( weaponType );
    //
    // return ( weapon ) ? ( weapon.ammo / weapon.maxAmmo ) : 0;

  }
}
