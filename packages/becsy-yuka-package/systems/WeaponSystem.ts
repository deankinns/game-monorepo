import {co, Entity, System, system} from "@lastolivegames/becsy";
import {GameEntityComponent} from "./GameEntitySystem";
import {CombatSystem} from "./CombatSystem";
import {Health, Inventory, Packed, PositionComponent, Selected, State, Target, Weapon, Projectile} from "becsy-package";
import {useEcsStore, RefComponent} from "react-becsy";
import {RigidBodyComponent} from "becsy-fiber";
import {Euler, Quaternion, Vector3} from "three";

@system(s => s.after(CombatSystem))
export class WeaponSystem extends System {
    weapons = this.query(q => q.using(Packed).write.with(Weapon, PositionComponent).current.added.removed.write);
    projectiles = this.query(q => q.with(Projectile, PositionComponent).current.write);
    readable = this.query(q => q.with(Target, GameEntityComponent, RefComponent, Inventory, State).read);

    heldWeapons = this.query(q => q.with(Weapon, PositionComponent, RigidBodyComponent, Packed).added.removed.current.write);

    execute() {
        for (const weapon of this.weapons.current) {
            const weaponComponent = weapon.read(Weapon);
            if (weaponComponent.state === 'fire') {
                this.fire(weapon.hold());
            } else if (weaponComponent.state === 'reload') {
                this.reload(weapon.hold());
            }
        }

        for (const weapon of this.heldWeapons.added) {
            this.setLocked(weapon, true)
        }

        for (const weapon of this.heldWeapons.current) {
            this.updatePosition(weapon);
        }

        for (const weapon of this.heldWeapons.removed) {
            this.setLocked(weapon, false)
        }
    }

    setLocked(entity: Entity, locked: boolean) {
        const body = entity.read(RigidBodyComponent).body;
        body.lockRotations(locked)
        body.lockTranslations(locked)
    }

    updatePosition(entity: Entity) {
        const holder = entity.read(Packed).holder;
        const body = entity.read(RigidBodyComponent).body;
        if (!holder || !holder.alive || !holder.has(RefComponent)) return;
        const r = holder.read(RefComponent).ref
        if (!r || !r.current) return

        const {hand, head, obj} = r.current;

        if (!hand || !head || !obj) return

        const v1 = new Vector3();
        hand.getWorldPosition(v1);

        const q1 = new Quaternion();
        obj?.getWorldQuaternion(q1);

        const e = new Euler().setFromQuaternion(body.rotation(), 'XYZ')
        v1.add(new Vector3(.07, .15, .8).applyEuler(e))

        body.setTranslation(v1);
        body.setRotation(q1);
    }

    @co *fire(entity: Entity) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();
        if (entity.read(Weapon).ammo <= 0) return;
        entity.write(Weapon).state = 'warmup';

        // let weapon = entity.read(Weapon);
        while (entity.read(Weapon).state !== 'ready') {
            yield co.waitForSeconds(entity.read(Weapon).warmUp);

            entity.write(Weapon).state = 'firing';
            yield co.waitForFrames(1);
            const {position, rotation} = entity.read(PositionComponent);

            this.createEntity(
                Projectile,
                PositionComponent, {
                    position: {x: position.x, y: position.y, z: position.z},
                    rotation: {x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w}
                },
            )

            entity.write(Weapon).state = 'cooldown';
            entity.write(Weapon).ammo--;
            yield co.waitForSeconds(entity.read(Weapon).coolDown);
            entity.write(Weapon).state = 'ready';
        }

    }

    @co *reload(entity: Entity) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();
        entity.write(Weapon).state = 'reloading';
        while (entity.read(Weapon).state !== 'ready') {
            yield co.waitForSeconds(entity.read(Weapon).reloadTime);
            entity.write(Weapon).state = 'cooldown';
            entity.write(Weapon).ammo = entity.read(Weapon).maxAmmo;
            yield co.waitForFrames(1);
            entity.write(Weapon).state = 'ready';
        }

    }

}