import {component, field} from "@lastolivegames/becsy";


@component
export class RenderComponent {
    @field.dynamicString(20) declare name: string;
}
