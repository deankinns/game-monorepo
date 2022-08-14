import {co, component, field, system, System} from "@lastolivegames/becsy";
import {EntityManager} from "yuka";
import {
    StaticEntityComponent,
    MovingEntityComponent,
    VehicleEntityComponent,
} from "../components/StaticEntityComponent";
import {
    Render,
    HealthSystem,
    EventSystem,
    MovingEntity as MovingComponent,
    PositionComponent,
    Deleter,
} from "becsy-package";
import {GameEntity, MovingEntity, Vehicle} from "yuka-package";
import {EntityManagerComponent} from "../components/EntityManagerComponent";
import {ThinkSystem} from "./ThinkSystem";

@component
export class GameEntityComponent {
    @field.object declare entity: GameEntity | MovingEntity | Vehicle;
}

@system((s) =>
    s.before(Deleter).beforeReadersOf(GameEntityComponent).after(EventSystem)
)
export class EntityManagerSystem extends System {
    // @ts-ignore
    entityManager: EntityManager = new EntityManager();
    entityManagerSingle = this.singleton.write(EntityManagerComponent);
    reference: any;

    timeMultiplier = 1000;

    async prepare(): Promise<void> {
        this.reference.current = this.entityManager
    }

    initialize() {
        this.entityManagerSingle.manager = this.entityManager;
    }

    @co *processTriggers() {
        co.cancelIfCoroutineStarted();
        const delta = this.delta / this.timeMultiplier;
        // @ts-ignore
        const triggers = this.entityManager._triggers;
        for (let i = triggers.length - 1; i >= 0; i--) {
            const trigger = triggers[i];
            this.entityManager.processTrigger(trigger);
        }
        // @ts-ignore
        this.entityManager._triggers.length = 0; // reset

        // handle messaging
        // @ts-ignore
        this.entityManager._messageDispatcher.dispatchDelayedMessages(delta);
        yield;
    }

    // }
    //
    //
    // @system(s => s.after(EntityManagerSystem).before(Render))
    // export class GameEntitySystem extends System {

    factory = this.query(
        (q) =>
            q
                .without(GameEntityComponent)
                .write.withAny(
                StaticEntityComponent,
                MovingEntityComponent,
                VehicleEntityComponent
            ).current.read
    );
    entities = this.query(
        (q) =>
            q.using(PositionComponent).write.with(GameEntityComponent).added.current
                .removed.write
    );

    staticEntities = this.query(
        (q) =>
            q.current.with(
                StaticEntityComponent,
                GameEntityComponent,
                PositionComponent
            ).added.removed.write
    );
    movingEntities = this.query(
        (q) =>
            q.current.with(
                MovingEntityComponent,
                GameEntityComponent,
                PositionComponent,
                MovingComponent
            ).added.removed.write
    );
    vehicleEntities = this.query(
        (q) =>
            q.current.with(
                VehicleEntityComponent,
                GameEntityComponent,
                PositionComponent,
                MovingComponent
            ).added.removed.write
    );

    // entityManager = this.singleton.read(EntityManagerComponent)
    execute() {
        for (const entity of this.factory.current) {
            if (!entity.has(PositionComponent)) {

                entity.add(PositionComponent, {
                    // @ts-ignore
                    position: [Math.random() * 100 - 50, 10, Math.random() * 100 - 50],
                });
            }

            let gameEntity;

            if (entity.has(StaticEntityComponent)) {
                gameEntity = new GameEntity(entity.hold());
            } else if (entity.has(MovingEntityComponent)) {
                if (!entity.has(MovingComponent)) {
                    entity.add(MovingComponent);
                }
                gameEntity = new MovingEntity(entity.hold());
            } else if (entity.has(VehicleEntityComponent)) {
                if (!entity.has(MovingComponent)) {
                    entity.add(MovingComponent);
                }
                gameEntity = new Vehicle(entity.hold());
                gameEntity.maxSpeed = 100;
            } else {
                // continue
                throw "no";
            }
            const {x, y, z} = entity.read(PositionComponent).position;
            gameEntity.position.set(x, y, z);
            gameEntity.boundingRadius = 10;
            this.entityManager.add(gameEntity);
            // entity.write(GameEntityComponent).entity = gameEntity
            entity.add(GameEntityComponent, {entity: gameEntity});
        }

        this.entityManager.update(this.delta / this.timeMultiplier);

        // for (const entity of this.entities.current) {
        //     const gameEntity = entity.read(GameEntityComponent).entity;
        //     if (gameEntity) {
        //         gameEntity.components.hold()
        //         this.entityManager.updateEntity(gameEntity, this.delta / 1000)
        //     }
        // }

        this.accessRecentlyDeletedData(true);

        for (const entity of this.entities.removed) {
            const gameEntity = entity.read(GameEntityComponent).entity;
            if (gameEntity) {
                this.entityManager.remove(gameEntity);
            }
        }

        // this.processTriggers();
    }
}

//
// @system(s => s.before(Render).before(HealthSystem))
// export class StaticEntitySystem extends System {
//
//     staticEntities = this.query(q => q.current.with(StaticEntityComponent, GameEntityComponent).usingAll.added.removed.write);
//
//     entityManager = this.singleton.read(EntityManagerComponent)
//
//     execute() {
//
//         for (const entity of this.staticEntities.added) {
//             const gameEntity = new GameEntity(entity.hold());
//             const {x,y,z} = entity.read(PositionComponent).position
//             gameEntity.position.set(x, y, z)
//             this.entityManager.manager.add(gameEntity);
//             entity.write(GameEntityComponent).entity = gameEntity
//         }
//
//     }
//
// }
//
// @system(s => s.after(StaticEntitySystem).before(Render))
// export class MovingEntitySystem extends System {
//
//     movingEntities = this.query(q => q.current.with(MovingEntityComponent, GameEntityComponent).added.removed.write)
//     entityManager = this.singleton.read(EntityManagerComponent)
//
//     execute() {
//         for (const entity of this.movingEntities.added) {
//             if (!entity.has(MovingComponent)) {
//                 entity.add(MovingComponent)
//             }
//             const gameEntity = new MovingEntity(entity.hold());
//
//             const {x,y,z} = entity.read(PositionComponent).position
//             gameEntity.position.set(x, y, z)
//             this.entityManager.manager.add(gameEntity);
//             entity.write(GameEntityComponent).entity = gameEntity
//         }
//
//     }
//
// }

// @system(s => s.after(StaticEntitySystem).inAnyOrderWith(MovingEntitySystem).before(ThinkSystem))
// export class VehicleEntitySystem extends System {
//
//     vehicleEntities = this.query(q => q.current.with(VehicleEntityComponent, GameEntityComponent, PositionComponent).added.removed.usingAll.write)
//     entityManager = this.singleton.read(EntityManagerComponent)
//
//     execute() {
//         for (const entity of this.vehicleEntities.added) {
//             if (!entity.has(MovingComponent)) {
//                 entity.add(MovingComponent)
//             }
//             const gameEntity = new Vehicle(entity.hold());
//             const {x,y,z} = entity.read(PositionComponent).position
//             gameEntity.position.set(x, y, z)
//             this.entityManager.manager.add(gameEntity);
//             entity.write(GameEntityComponent).entity = gameEntity
//         }
//
//     }
//
// }