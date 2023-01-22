import {co, Entity, system, System} from "@lastolivegames/becsy";
import {ThinkSystem} from "./ThinkSystem";
import {BrainComponent, MemoryComponent, PathRequestComponent, VehicleEntityComponent} from "../components";
import {GameEntityComponent} from "./GameEntitySystem";
import {Health, Inventory, Packed, PositionComponent, Selected, State, Target, Weapon} from "becsy-package";
import {AttackEvaluator, GameEntity, GetWeaponEvaluator} from "yuka-package";
import {Vehicle} from "yuka";

@system((s) => s.after(ThinkSystem).afterWritersOf(BrainComponent))
export class CombatSystem extends System {
    entities = this.query(
        (q) =>
            q.with(BrainComponent, Health, Inventory, GameEntityComponent, VehicleEntityComponent, PositionComponent, MemoryComponent)
                .added.current.read.using(Target, Selected).write
    );

    weapons = this.query(q => q.with(Weapon, Packed).write)

    checkable = this.query((q) => q.usingAll.read);

    writeable = this.query((q) => q.using(Weapon, GameEntityComponent, PathRequestComponent, State, PositionComponent).write);


    execute() {
        for (const entity of this.entities.added) {
            const brain = entity.read(BrainComponent).object;
            brain.addEvaluator(new GetWeaponEvaluator(1, Weapon));

            brain.addEvaluator(new AttackEvaluator())
        }

        for (const entity of this.entities.current) {
            // const memory = entity.read(MemoryComponent).system;
            const inventory = entity.read(Inventory).contents;
            let armed = false;
            for (const item of inventory) {
                if (item.has(Weapon)) {
                    armed = true;
                    break;
                }
            }
            if (!entity.has(Target) && armed) {
                this.updateTarget(entity.hold());
            }
            if (entity.has(Target)) {
                // this.turning.add(entity.__id);
                this.updateAimAndShot(entity.hold());
            }
        }
    }

    @co *updateAimAndShot(entity: Entity) {
        co.scope(entity);

        // co.cancelIfCoroutineStarted()
        // co.cancelIf(() => !entity.has(Target) || !entity.has(MemoryComponent));
        // yield co.waitForFrames(1);
        co.cancelIfComponentMissing(Target);
        co.cancelIfComponentMissing(MemoryComponent);

        const targetEntity = entity.read(Target).value
        // co.cancelIf(() => !targetEntity.has(GameEntityComponent));
        if (!targetEntity || !targetEntity.has(GameEntityComponent)) {
            return co.cancel();
        }

        const target = targetEntity.read(GameEntityComponent).entity;

        const owner = entity.read(GameEntityComponent).entity;
        if (!owner.rotateTo(target.position, this.delta, 0.1)) {
            //
            // return co.cancel();
            yield co.waitForFrames(1);
            // yield co.waitForSeconds(0.5);
        }


        yield this.shoot(entity, targetEntity);


        // co.scope(entity);
        // co.cancelIfCoroutineStarted();
        // co.cancelIf(() => !entity.has(Target) || !entity.has(MemoryComponent));
        // co.cancelIfComponentMissing(Target);
        // co.cancelIfComponentMissing(MemoryComponent);
        // const owner = this.owner;
        // const targetSystem = owner.targetSystem;
        // const target = targetSystem.getTarget();
        // const owner = entity.read(GameEntityComponent).entity;
        //
        //
        // if (entity.has(Target)) {
        //     const {value} = entity.read(Target)
        //     if (!value) {
        //         entity.remove(Target);
        //         return co.cancel();
        //     }
        //     if (!value.has(GameEntityComponent)) {
        //         return// co.cancel();
        //     }
        //     const target = value?.read(GameEntityComponent).entity;
        //     if (!target) {
        //         return// co.cancel();
        //     }
        //     // if the target is visible, directly rotate towards it and then
        //     // fire a round
        //
        //     // if ( targetSystem.isTargetShootable() ) {
        // //     if (Feature.isTargetShootable(owner, target)) {
        // //
        // //         // stop search for the attacker if the target is shootable
        // //
        // //         // owner.resetSearch();
        // //
        // //         // the bot can fire a round if it is headed towards its target
        // //         // and after a certain reaction time
        // //
        // //         // owner.lookAt(target.position);
        // //
        // //         const targeted = owner.rotateTo(target.position, delta, 0.0005); // "targeted" is true if the enemy is faced to the target
        // //
        // //         // owner.sendMessage()
        // //         // const position = entity.write(PositionComponent);
        // //         // position.rotation.x = owner.rotation.x;
        // //         // position.rotation.y = owner.rotation.y;
        // //         // position.rotation.z = owner.rotation.z;
        // //         // position.rotation.w = owner.rotation.w;
        // //
        // //         // position.rotation = owner.rotation;
        // //         // QuaternionToThree(owner.rotation, position.rotation);
        // //
        // //         // const timeBecameVisible = targetSystem.getTimeBecameVisible();
        // //         // const elapsedTime = owner.world.time.getElapsed();
        // //         const elapsedTime = this.time
        // //
        // //         if (targeted === true /*&& ( elapsedTime - timeBecameVisible ) >= /*this.reactionTime1*/) {
        // //
        // //             // target.bounds.getCenter( targetPosition );
        // //
        // //             // this.addNoiseToAim( targetPosition );
        // //
        // //             // this.shoot( targetPosition );
        // //             this.shoot(entity.hold(), target.position);
        // //
        // //         }
        // //
        // //     } else {
        // //
        // //         // the target might not be shootable but the enemy is still attacked.
        // //         // in this case, search for the attacker
        // //
        // //         // if ( owner.searchAttacker ) {
        // //         //
        // //         //     targetPosition.copy( owner.position ).add( owner.attackDirection );
        // //         //     owner.rotateTo( targetPosition, delta );
        // //         //
        // //         // } else {
        // //         //
        // //         //     // otherwise rotate to the latest recorded position
        // //         //
        // //         //     owner.rotateTo( targetSystem.getLastSensedPosition(), delta );
        // //         //
        // //         // }
        // //
        // //     }
        // //
        // // } else {
        //
        //     // if the enemy has no target, look for an attacker if necessary
        //
        //     // if ( owner.searchAttacker ) {
        //     //
        //     //     targetPosition.copy( owner.position ).add( owner.attackDirection );
        //     //     owner.rotateTo( targetPosition, delta );
        //     //
        //     // } else {
        //     //
        //     //     // if the enemy has no target and is not being attacked, just look along
        //     //     // the movement direction
        //     //
        //     //     displacement.copy( owner.velocity ).normalize();
        //     //     targetPosition.copy( owner.position ).add( displacement );
        //     //
        //     //     owner.rotateTo( targetPosition, delta );
        //     //
        //     // }
        //
        // }

        // return this;
        // yield
    }

    @co *shoot(entity: Entity, target: Entity) {
        co.scope(entity);
        // co.cancelIfCoroutineStarted();
        co.cancelIfComponentMissing(Target);
        const inventory = entity.read(Inventory).contents;
        let armed = false;
        let weapon: Entity | undefined;
        for (const item of inventory) {
            if (item.has(Weapon)) {
                armed = true;
                weapon = item;
                break;
            }
        }
        if (!armed) {
            return;
        }
        if (target === weapon && entity.has(Target)) {
            entity.remove(Target);
            return;
        }

        yield co.waitForSeconds(0.5);
        if (!weapon || !weapon.__valid || !weapon?.has(Weapon)) return;
        const weaponComponent = weapon?.write(Weapon);
        if (weaponComponent && weaponComponent.state === 'ready') {

            if (weaponComponent.ammo > 0) {
                weaponComponent.state = 'fire'
                // weapon?.read(Weapon).fire()
                // weaponComponent.fire()

                // weaponComponent.ammo--;

                // weaponComponent.ammo--
                // weaponComponent.active = true;
                // weaponComponent.ammo--;
                // const owner = entity.read(GameEntityComponent).entity;
                // const targetEntity = entity.read(Target).value?.read(GameEntityComponent).entity;
                // if (targetEntity) {
                //     const damage = Feature.getDamage(owner, targetEntity);
                //     targetEntity.health -= damage;
                //     if (targetEntity.health <= 0) {
                //         targetEntity.state = State.DEAD;
                //     }
                // }
            } else {
                yield this.reload(entity);
            }

        }
        yield co.waitForSeconds(0.5);
    }

    @co *reload(entity: Entity) {
        co.scope(entity);
        // co.cancelIfCoroutineStarted();
        //

        const inventory = entity.read(Inventory).contents;
        // let armed = false;
        let weaponEntity: Entity | undefined;
        for (const item of inventory) {
            if (item.has(Weapon)) {
                // armed = true;
                weaponEntity = item;
                break;
            }
        }
        if (!weaponEntity) {
            return co.cancel();
        }

        if (!entity.has(State)) {
            entity.add(State, {value: 'rifle/reloading'});
        } else {
            entity.write(State).value = 'rifle/reloading';
        }
        weaponEntity.write(Weapon).state = 'reload';
        yield

        while (
            weaponEntity?.has(Weapon) &&
            weaponEntity?.read(Weapon).state !== 'ready'
            ) {
            yield
        }

        if (entity.has(State)) {
            entity.remove(State);
        }

        // yield co.waitForSeconds(5);
        // if (entity.has(State)) {
        //     entity.remove(State);
        // }
        //
        // const weaponComponent = weapon?.write(Weapon);
        //
        // if (weaponComponent) {
        //     weaponComponent.ammo = weaponComponent.maxAmmo;
        // }
        // yield
    }

    @co *updateTarget(entity: Entity) {
        co.scope(entity);
        // co.cancelIfCoroutineStarted();
        co.cancelIf(() => entity.has(Target) || !entity.has(MemoryComponent));
        // const records = this.owner.memoryRecords;

        // reset

        // this._currentRecord = null;

        // visibleRecords.length = 0;
        // invisibleRecords.length = 0;
        const visibleRecords = [];
        const invisibleRecords = [];
        const memory = entity.read(MemoryComponent);
        const owner = entity.read(GameEntityComponent).entity;
        const records = memory.system?.records ?? [];

        let selected = null;
        // sort records according to their visibility

        for (let i = 0, l = records.length; i < l; i++) {

            const record = records[i];

            if (!(record.entity instanceof Vehicle)) continue;
            if (record.visible) {

                visibleRecords.push(record);

            } else {

                invisibleRecords.push(record);

            }
        }

        yield co.waitForFrames(1);

        // record selection

        if (visibleRecords.length > 0) {

            // if there are visible records, select the closest one

            let minDistance = Infinity;

            for (let i = 0, l = visibleRecords.length; i < l; i++) {

                const record = visibleRecords[i];

                const distance = owner.position.squaredDistanceTo(record.lastSensedPosition);

                if (distance < minDistance) {

                    minDistance = distance;
                    // this._currentRecord = record;
                    selected = record;

                }
            }

        } else if (invisibleRecords.length > 0) {

            // if there are invisible records, select the one that was last sensed

            let maxTimeLastSensed = -Infinity;

            for (let i = 0, l = invisibleRecords.length; i < l; i++) {

                const record = invisibleRecords[i];

                if (record.timeLastSensed > maxTimeLastSensed) {

                    maxTimeLastSensed = record.timeLastSensed;
                    // this._currentRecord = record;
                    selected = record;

                }
            }

        }

        yield co.waitForFrames(1);

        if (
            selected &&
            selected.entity &&
            (selected.entity as GameEntity).components?.__valid &&
            (selected.entity as GameEntity).components?.alive &&
            !entity.has(Target)
        ) {
            try {
                const t = ((selected.entity as GameEntity).components as Entity).hold();

                entity.add(Target, {
                    value: t,
                    position: {
                        x: selected.lastSensedPosition.x,
                        y: selected.lastSensedPosition.y,
                        z: selected.lastSensedPosition.z
                    }
                });
            } catch (e) {
                console.log(e)
            }

        }

        // yield
        // return this;

    }

}

