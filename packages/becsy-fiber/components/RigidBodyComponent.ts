import {RigidBodyApi} from "@react-three/rapier";
import {component, field} from "@lastolivegames/becsy";

@component
export class RigidBodyComponent {
    @field.object declare body: RigidBodyApi;
}