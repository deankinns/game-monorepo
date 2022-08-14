import { component, field, Type } from "@lastolivegames/becsy";
import { ExtendedObject3D } from "enable3d";

@component
export class Object3DComponent {
  @field({ type: Type.object, default: new ExtendedObject3D() })
  declare object: ExtendedObject3D;
}
