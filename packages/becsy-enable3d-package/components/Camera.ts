import { component, field } from "@lastolivegames/becsy";
import { Camera } from "three";

@component
export class CameraComponent {
  @field.object declare camera: Camera;
}
