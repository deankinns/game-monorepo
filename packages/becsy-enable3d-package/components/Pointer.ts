import {component, field, Type} from "@lastolivegames/becsy";
import {Ray} from 'three';

@component
export class Pointer {
    @field(Type.object) declare ray: Ray;
    @field({type: Type.object, default: []}) declare over: any[];
}