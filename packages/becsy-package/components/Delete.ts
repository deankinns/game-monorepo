import {component, Entity, field} from "@lastolivegames/becsy";

@component
export class ToBeDeleted {
    @field.object declare condition: (entity: Entity) => boolean;
}