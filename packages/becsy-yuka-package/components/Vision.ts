import { component, field } from "@lastolivegames/becsy";
import { Vision } from "yuka";

@component
export class VisionComponent {
  @field.object declare value: Vision;
}
