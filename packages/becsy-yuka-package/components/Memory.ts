import { component, field } from "@lastolivegames/becsy";
import { MemorySystem } from "yuka";

@component
export class MemoryComponent {
  @field.object declare system: MemorySystem;
}
