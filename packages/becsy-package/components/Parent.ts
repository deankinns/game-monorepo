import {component, Entity, field} from "@lastolivegames/becsy";

@component
export class Child {
    @field.ref declare parent: Entity;
}

@component
export class Parent {
    @field.backrefs(Child, 'parent') declare children: Entity[];
}

