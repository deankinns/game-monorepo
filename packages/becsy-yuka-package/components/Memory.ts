import {component, Entity, field} from "@lastolivegames/becsy";
import {MemoryRecord, MemorySystem} from "yuka";


@component
export class MemoryRecordComponent {
  @field.ref declare sensor: Entity;
  @field.ref declare sensed: Entity;
  @field.float32 declare lastSensedTime: number;
  @field.float64.vector(['x', 'y', 'z'])
  declare lastSensedPosition: [number, number, number] & { x: number, y: number, z: number };
}

@component
export class MemoryComponent {
  @field.object declare system: MemorySystem;
  @field.backrefs(MemoryRecordComponent) declare records: Entity[];
}
