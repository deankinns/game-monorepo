import {component, field, Type} from "@lastolivegames/becsy";
import {Vision} from "yuka";

@component
export class VisionComponent {
    @field.object declare value: Vision;
}

@component
export class Obstacle {
    @field({type: Type.float32, default: 10}) declare height: number;
    @field({type: Type.float32, default: 10}) declare width: number;
    @field({type: Type.float32, default: 10}) declare depth: number;
}