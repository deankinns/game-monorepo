import {field, component, Type} from '@lastolivegames/becsy';
import {Ref} from "react";

@component
export class RefComponent {
    @field(Type.object) declare ref: any;
}