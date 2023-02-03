import {component, Entity, field} from "@lastolivegames/becsy";
import { NavMesh, Vector3 } from "yuka";
// import { v3Type } from "becsy-package";
import { PathPlanner } from "yuka-package";

@component
export class NavigatorComponent {
  @field.ref declare navMesh: Entity;
}

@component
export class NavMeshComponent {
  @field.object declare navMesh: NavMesh;
  @field.object declare pathPlanner: PathPlanner;
  @field.backrefs(NavigatorComponent, 'navMesh') declare navigators: Entity[];
}


@component
export class PathRequestComponent {
  @field.float64.vector(['x', 'y', 'z'])
  declare from: [number, number, number] & { x: number, y: number, z: number };
  @field.float64.vector(['x', 'y', 'z'])
  declare to: [number, number, number] & { x: number, y: number, z: number };
}

@component
export class PathComponent {
  @field.object declare path: Vector3[];
}
