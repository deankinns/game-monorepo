import {
    StaticEntityComponent,
    MovingEntityComponent,
    VehicleEntityComponent, Obstacle, BrainComponent,
} from "../components";
import {System, system} from "@lastolivegames/becsy";
import {VisionComponent} from "../components/Vision";
import {MemoryComponent} from "../components/Memory";
import {MemorySystem, Vision} from "yuka";
import {Healing, PositionComponent, Target, MovingEntity, State, Inventory} from "becsy-package";
import {ThinkSystem} from "./ThinkSystem";
import {GameEntityComponent} from "./GameEntitySystem";
import {NavigationSystem} from "./NavigationSystem";
import {Object3DComponent} from "becsy-fiber";

// import * as THREE from "three";

@system((s) =>
    s
        .before(ThinkSystem, NavigationSystem)
        .afterWritersOf(
            StaticEntityComponent,
            MovingEntityComponent,
            VehicleEntityComponent
        )
)
// const r = new THREE.Ray();

export class PerceptionSystem extends System {
    vision = this.query(
        (q) =>
            q.current.with(VisionComponent, GameEntityComponent, MemoryComponent)
                .added.removed.write
    );
    obstacles = this.query(q => q.with(Obstacle, GameEntityComponent).added.current.removed.write);

    memory = this.query(
        (q) => q.current.with(MemoryComponent, GameEntityComponent).added.removed.write
    );

    checkable = this.query((q) => q.using(Healing, Target, PositionComponent, MovingEntity, State, Inventory, BrainComponent).read);

    execute() {
        for (const entity of this.vision.added) {
            const gameEntity = entity.read(GameEntityComponent).entity;
            const vision = new Vision(gameEntity);
            vision.range = 100;
            entity.write(VisionComponent).value = vision;
        }

        for (const entity of this.memory.added) {
            const gameEntity = entity.read(GameEntityComponent).entity;
            entity.write(MemoryComponent).system = new MemorySystem(gameEntity);
        }

        for (const entity of this.obstacles.added) {
            const gameEntity = entity.read(GameEntityComponent).entity;
            for (const vision of this.vision.current) {
                vision.read(VisionComponent).value.addObstacle(gameEntity);
            }
        }

        for (const entity of this.vision.current) {
            const vision = entity.read(VisionComponent).value;
            const gameEntity = entity.read(GameEntityComponent).entity;
            const memory = entity.read(MemoryComponent).system;

            if (!vision || !gameEntity || !memory) {
                continue;
            }

            for (const neighbour of gameEntity.neighbors) {
                if (memory.hasRecord(neighbour) === false) {
                    memory.createRecord(neighbour);
                }
                const record = memory.getRecord(neighbour);
                // @ts-ignore
                record.timeLastSensed = this.time;
            }

            let records: any[] = [];
            memory.getValidMemoryRecords(this.time, records);
            for (const record of records) {
                record.visible = vision.visible(record.entity.position);
                if (record.visible) {
                    record.timeLastSensed = this.time;
                    record.lastSensedPosition = record.entity.position;
                }
            }
        }

        this.accessRecentlyDeletedData(true)

        for (const entity of this.obstacles.removed) {
            const gameEntity = entity.read(GameEntityComponent).entity;
            for (const vision of this.vision.current) {
                vision.read(VisionComponent).value.removeObstacle(gameEntity);
            }
        }


    }
}
