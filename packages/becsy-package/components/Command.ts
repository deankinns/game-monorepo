import {component, field} from "@lastolivegames/becsy";

@component
export class Command {
  @field.staticString(['MOVE', 'ATTACK', 'GUARD', 'COLLECT']) declare command: string;
}