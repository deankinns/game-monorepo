import {system, System} from "@lastolivegames/becsy";
import {
    NavMeshComponent,
    PathComponent,
    PathRequestComponent,
} from "../components";
import {Deleter, EventSystem, Render} from "becsy-package";
import {PathPlanner, Vehicle} from "yuka-package";
import {GameEntityComponent} from "./GameEntitySystem";
import {Vector3} from "yuka";
import {ThinkSystem} from "./ThinkSystem";
import {EntityManagerComponent} from "../components/EntityManagerComponent";

@system((s) => s.after(EventSystem, ThinkSystem).before(Deleter, Render))
export class NavigationSystem extends System {
    navigators = this.query(
        (q) => q.with(PathRequestComponent, GameEntityComponent).added.current.write
    );
    navMeshes = this.query((q) => q.with(NavMeshComponent).added.current.write);
    running = this.query(q => q.with(PathComponent, GameEntityComponent).added.current.write.using(PathRequestComponent));

    entityManagerSingle = this.singleton.write(EntityManagerComponent);
    // pathPlanners: PathPlanner[] = [];

    execute() {
        for (const entity of this.navMeshes.added) {
            const navMesh = entity.read(NavMeshComponent).navMesh;
            navMesh.spatialIndex = this.entityManagerSingle.manager.spatialIndex;
            navMesh.updateSpatialIndex()
            const pathPanner = new PathPlanner(navMesh);
            entity.write(NavMeshComponent).pathPanner = pathPanner
            // @ts-ignore
            this.entityManagerSingle.manager.pathPlanner = pathPanner;
        }
        // super.execute();

        for (const entity of this.navigators.added) {
            const vehicle = entity.read(GameEntityComponent).entity as Vehicle;
            const {from, to} = entity.read(PathRequestComponent);
            for (const nav of this.navMeshes.current) {
                const pathPlanner = nav.read(NavMeshComponent).pathPanner;
                pathPlanner.findPath(
                    vehicle,
                    new Vector3(from.x, from.y, from.z),
                    new Vector3(to.x, to.y, to.z),
                    (owner: Vehicle, path: Vector3[]) => {
                        // entity.remove(PathRequestComponent)
                        // entity.add(PathComponent, {path: })
                        owner.components.remove(PathRequestComponent);

                        if (owner.components.has(PathComponent)) {
                            const oldPath = owner.components.read(PathComponent).path;
                            if (oldPath.length > path.length) {
                                owner.components.write(PathComponent).path = path;
                            }
                        } else {
                            owner.components.add(PathComponent, {path: path});
                        }
                    }
                );
            }
        }

        for (const entity of this.running.current) {
            const vehicle = entity.read(GameEntityComponent).entity as Vehicle;
            const path = entity.read(PathComponent).path;

            if (path.length > 0 && vehicle.position.distanceTo(path[path.length-1]) < vehicle.boundingRadius) {
                entity.remove(PathComponent);
            }

            if (entity.has(PathRequestComponent)) {
                entity.remove(PathComponent);
            }

        }

        for (const entity of this.navMeshes.current) {
            const pathPlanner = entity.read(NavMeshComponent).pathPanner;
            pathPlanner?.update();
        }
    }
}
