import {co, Entity, system, System} from "@lastolivegames/becsy";
import {
    BrainComponent,
    MemoryComponent,
    NavigatorComponent,
    NavMeshComponent,
    PathComponent,
    PathRequestComponent,
    VehicleEntityComponent,
} from "../components";
import {
    Deleter,
    EventSystem, Health,
    Inventory,
    InventorySystem,
    Packed,
    PositionComponent,
    Render,
    Selected,
    State,
    Target,
    ToBeDeleted
} from "becsy-package";
import {PathPlanner} from "yuka-package";
import {GameEntityComponent} from "./GameEntitySystem";
import {Vector3} from "yuka";
import {ThinkSystem} from "./ThinkSystem";
import {EntityManagerComponent} from "../components/EntityManagerComponent";
import * as THREE from "three";

import {Vector3ToThree} from "three-package"
import {PerceptionSystem} from "./PerceptionSystem";
import {Vehicle} from "../entities";

@system((s) => s.after(EventSystem, ThinkSystem, PerceptionSystem, InventorySystem).before(Deleter, Render))
export class NavigationSystem extends System {
    pathRequests = this.query(
        (q) => q.with(PathRequestComponent, GameEntityComponent, PositionComponent).added.current.write
            .using(Target, Inventory, Packed, State, Selected, ToBeDeleted, BrainComponent, MemoryComponent, Health).write
    );
    navMeshes = this.query((q) => q.with(NavMeshComponent).added.current.write);
    running = this.query(q => q.with(PathComponent, GameEntityComponent).added.current.write.using(PathRequestComponent));

    entityManagerSingle = this.singleton.write(EntityManagerComponent);

    navigators = this.query(q => q.using(NavigatorComponent).write.without(NavigatorComponent).with(VehicleEntityComponent).added.read)

    // pathPlanners: PathPlanner[] = [];

    execute() {
        // for (const entity of this.navMeshes.added) {
        //     const navMesh = entity.read(NavMeshComponent).navMesh;
        //     navMesh.spatialIndex = this.entityManagerSingle.manager.spatialIndex;
        //     navMesh.updateSpatialIndex()
        //     entity.write(NavMeshComponent).pathPanner = new PathPlanner(navMesh)
        //     // @ts-ignore
        //     // this.entityManagerSingle.manager.pathPlanner = pathPanner;
        // }

        for (const entity of this.navMeshes.current) {
            entity.read(NavMeshComponent).navMesh.updateSpatialIndex();
        }

        for (const entity of this.navigators.added) {
            // entity.add(NavigatorComponent, {navMesh: this.singleton});
            for (const navMesh of this.navMeshes.current) {
                entity.add(NavigatorComponent, {navMesh: navMesh});
            }
        }

        for (const entity of this.pathRequests.added) {
            const vehicle = entity.read(GameEntityComponent).entity as Vehicle;
            const {from, to} = entity.read(PathRequestComponent);
            for (const nav of this.navMeshes.current) {
                const pathPlanner = nav.read(NavMeshComponent).pathPlanner;
                pathPlanner.findPath(
                    vehicle,
                    new Vector3(from.x, from.y, from.z),
                    new Vector3(to.x, to.y, to.z),
                    (owner: Vehicle, path: Vector3[]) => {
                        // entity.remove(PathRequestComponent)
                        // entity.add(PathComponent, {path: })
                        if (!owner.components.__valid || !owner.components.alive) return

                        if (owner.components.has(PathRequestComponent)) {
                            owner.components.remove(PathRequestComponent);
                        }


                        if (owner.components.has(PathComponent)) {
                            const oldPath = owner.components.read(PathComponent).path;
                            if (oldPath.length > path.length) {
                                owner.components.write(PathComponent).path = path;
                            }
                        } else {
                            owner.components.add(PathComponent, {path});
                        }
                    }
                );
            }
        }

        for (const entity of this.running.current) {
            const vehicle = entity.read(GameEntityComponent).entity as Vehicle;
            const path = entity.read(PathComponent).path;

            if (path.length > 0 && vehicle.position.distanceTo(path[path.length - 1]) < vehicle.boundingRadius) {
                entity.remove(PathComponent);
            }

            if (entity.has(PathRequestComponent)) {
                entity.remove(PathComponent);
            }

        }

        for (const entity of this.navMeshes.current) {
            const pathPlanner = entity.read(NavMeshComponent).pathPlanner;
            pathPlanner?.update();
        }
    }

    @co *goTo(entity: Entity, to: THREE.Vector3) {
        co.scope(entity);
        co.cancelIfCoroutineStarted();

        if (entity.has(Target)) {
            entity.remove(Target);
        }
        const target = this.createEntity(
            PositionComponent, {position: [to.x, to.y, to.z]},
            Selected,
            ToBeDeleted, {
                condition: (entity: Entity) => {
                    const sel = entity.read(Selected).by;
                    for (const by of sel) {
                        const byPos = Vector3ToThree(by.read(PositionComponent).position, new THREE.Vector3());
                        const ePos = Vector3ToThree(entity.read(PositionComponent).position, new THREE.Vector3());
                        // console.log(byPos.distanceTo(ePos));
                        if (byPos.distanceTo(ePos) < 10) {
                            by.remove(Target)
                        }
                    }

                    return sel.length < 1;
                }
            });
        entity.add(Target, {value: target});
        yield co.waitForFrames(1);

    }
}
