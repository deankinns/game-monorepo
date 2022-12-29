import {field, component, Type} from '@lastolivegames/becsy';
import {Mesh} from "three";

@component
export class MeshComponent {
    @field(Type.object) declare mesh: Mesh;
}