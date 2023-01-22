import {field, component, Type} from '@lastolivegames/becsy';
import {Object3D} from "three";

@component
export class Object3DComponent {
    @field(Type.object) declare object: Object3D;
}