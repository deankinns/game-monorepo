import { component, field } from "@lastolivegames/becsy";
import { NavMesh, Vector3 } from "yuka";
import { v3Type } from "becsy-package";
import { PathPlanner } from "yuka-package";

@component
export class NavMeshComponent {
  @field.object declare navMesh: NavMesh;
  @field.object declare pathPanner: PathPlanner;
}

@component
export class PathRequestComponent {
  @field(v3Type) declare from: Vector3;
  @field(v3Type) declare to: Vector3;
}

@component
export class PathComponent {
  @field.object declare path: Vector3[];
}
