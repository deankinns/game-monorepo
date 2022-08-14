import {component, field, Type} from "@lastolivegames/becsy";

@component
export class State {
    @field(Type.dynamicString(100)) declare value: string;
}