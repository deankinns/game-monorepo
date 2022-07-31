import {CONFIG} from './Config';
import {WEAPON_TYPES_BLASTER, WEAPON_TYPES_SHOTGUN, WEAPON_TYPES_ASSAULT_RIFLE} from './Constants';
import {GameEntity, MathUtils, Vector3, Vehicle} from "yuka";
import _ from "lodash";
// import {Vehicle} from "../entities/Vehicle";
// import {Vehicle} from "../entities/Vehicle";
// import {Health, Inventory, Weapon} from "../../becsy/systems";
//import {Object3DComponent} from "../../becsy/components";

export class Feature {
    static totalWeaponStrength(enemy: Vehicle & { data?: any }) {

        let total = 0;

        // if (enemy.entity.has('Inventory')) {
        if (enemy.data.inventory) {

            // const inventory = enemy.entity.read('Inventory');
            for (const entity of enemy.data.inventory) {
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
    static health(enemy: Vehicle & { data?: { health?: number, maxHealth: number } }) {

        if (enemy.data?.health) {
            const {health, maxHealth} = enemy.data;

            return health / maxHealth;
        }

        return 0;

    }

    static distanceToItem(enemy: Vehicle, itemType: any) {

        let score = Infinity;
        let result = null;

        let minDist = Infinity

        // enemy.world.getClosestItem( enemy, itemType, result );

        for (const entity of enemy.manager?.entities as (GameEntity & { type: any[], packed?: boolean })[]) {
            if (_.includes(entity.type, itemType) && !entity.packed) {


                // if (entity) {
                const dist = entity.position.distanceTo(entity.position)
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

    static individualWeaponStrength(enemy: Vehicle, weaponType: any) {

        return Feature.totalWeaponStrength(enemy)

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
     * @return {Boolean} Whether the enemy can move a bit to the left or not.
     */
    static canMoveInDirection(entity: Vehicle & { world: any }, direction: Vector3, position: Vector3) {

        position.copy(direction).applyRotation(entity.rotation).normalize();
        position.multiplyScalar(CONFIG.BOT.MOVEMENT.DODGE_SIZE).add(entity.position);

        const navMesh = entity.world.navMesh;
        const region = navMesh.getRegionForPoint(position, 1);

        return region !== null;

    }
}
