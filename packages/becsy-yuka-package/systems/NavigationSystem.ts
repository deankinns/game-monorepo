import {system, System} from "@lastolivegames/becsy";
import {
    NavMeshComponent,
    PathComponent,
    PathRequestComponent,
} from "../components/NavMeshComponent";
import {Deleter, EventSystem, Render} from "becsy-package";
import {PathPlanner, Vehicle} from "yuka-package";
import {GameEntityComponent} from "./GameEntitySystem";
import {VehicleEntityComponent} from "../components";
import {Vector3} from "yuka";

@system((s) => s.after(EventSystem).before(Deleter, Render))
export class NavigationSystem extends System {
    navigators = this.query(
        (q) => q.with(PathRequestComponent, GameEntityComponent).added.current.write
    );
    navMeshes = this.query((q) => q.with(NavMeshComponent).added.current.write);
    running = this.query(q => q.with(PathComponent, GameEntityComponent).added.current.write);

    // pathPlanners: PathPlanner[] = [];

    execute() {
        for (const entity of this.navMeshes.added) {
            const navMesh = entity.read(NavMeshComponent).navMesh;
            entity.write(NavMeshComponent).pathPanner = new PathPlanner(navMesh);
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

        }

        for (const entity of this.navMeshes.current) {
            const pathPlanner = entity.read(NavMeshComponent).pathPanner;
            pathPlanner?.update();
        }
    }
}
