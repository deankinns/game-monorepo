import { component, field } from "@lastolivegames/becsy";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

@component
export class ControlComponent {
  @field.object declare object: OrbitControls | FirstPersonControls;
}
