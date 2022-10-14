import {GameEntity, Vehicle as BaseVehicle} from 'yuka-package';
import {ComponentEnum, ComponentType, Entity} from "@lastolivegames/becsy";
import {Matrix4, Quaternion, Ray, Telegram, Vector3} from "yuka";
import {PositionComponent, Parent} from "becsy-package";
import {RenderCallback} from "yuka/src/core/GameEntity";

// export class Vehicle extends BaseVehicle implements Entity {
//     // private __checkHas = this.components.__checkHas;
//     // private __checkMask;
//     // private __checkValid;
//     // __id: EntityId;
//     // private readonly __registry;
//     // __sortKey: any;
//     // __valid: boolean;
//
//     constructor(private _components: Entity) {
//         super(_components);
//     }
//
//     get components(): Entity {
//         return this._components;
//     }
//
//     add<C>(type: ComponentType<C> | GameEntity, values?: Partial<C>): void {
//         if (type instanceof GameEntity) {
//
//         } else {
//             this._components.add(type, values);
//         }
//     }
//
//     addAll(...args: (ComponentType<any> | Record<string, unknown>)[]): void {
//     }
//
//     get alive(): boolean {
//         return false;
//     }
//
//     countHas(...types: (ComponentType<any> | ComponentEnum)[]): number {
//         return 0;
//     }
//
//     delete(): void {
//     }
//
//     has(type: ComponentType<any> | ComponentEnum): boolean {
//         return false;
//     }
//
//     hasAllOf(...types: ComponentType<any>[]): boolean {
//         return false;
//     }
//
//     hasAnyOtherThan(...types: (ComponentType<any> | ComponentEnum)[]): boolean {
//         return false;
//     }
//
//     hasSomeOf(...types: (ComponentType<any> | ComponentEnum)[]): boolean {
//         return false;
//     }
//
//     hasWhich(enumeration: ComponentEnum): ComponentType<any> | undefined {
//         return undefined;
//     }
//
//     hold(): Entity {
//         return this._components;
//     }
//
//     isSame(other: Entity): boolean {
//         return false;
//     }
//
//     get ordinal(): number {
//         return 0;
//     }
//
//     read<C>(type: ComponentType<C>): Readonly<C> {
//         return this._components.read(type);
//     }
//
//     remove(type: ComponentType<any> | ComponentEnum): void {
//         this.components.remove()
//     }
//
//     removeAll(...types: (ComponentType<any> | ComponentEnum)[]): void {
//     }
//
//     write<C>(type: ComponentType<C>): C {
//         return this._components.write(type);
//     }
//
// }

const foo = {

}

export const GameEntityWrapper = (entity: Entity): Partial<GameEntity> => {
    const {position, rotation} = entity.read(PositionComponent);
    // const vecD = new Vector3(direction.x, direction.y, direction.z);
    const rotD = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
    const forward = new Vector3(0, 0, 1);

    return {
        components: entity.hold(),

        position: new Vector3(position.x, position.y, position.z),
        rotation: new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
        forward,//: new Vector3(0, 0, 1),
        up: new Vector3(0, 1, 0),

        scale: new Vector3(1, 1, 1),
        worldMatrix: new Matrix4(),
        uuid: `${entity.__id}`,

        add(gameEntity: GameEntity): any {
            gameEntity.components.add(Parent, {parent: entity});
            return GameEntityWrapper(entity);
        },
        fromJSON(json: { [p: string]: any }): any {
            return undefined;
        },
        getDirection(result: Vector3): Vector3 {
            return result.copy( forward ).applyRotation( rotD ).normalize();
        },
        getWorldDirection(result: Vector3): Vector3 {
            // return undefined;
            return GameEntity.prototype.getWorldDirection(result);
        },
        getWorldPosition(result: Vector3): Vector3 {
            // return undefined;
            return GameEntity.prototype.getWorldPosition(result);
        },
        handleMessage(telegram: Telegram): boolean {
            return false;
        },
        lineOfSightTest(ray: Ray, intersectionPoint: Vector3): Vector3 | null {
            return null;
        },
        lookAt(target: Vector3): any {
            return undefined;
        },
        remove(entity: GameEntity): any {
            return undefined;
        },
        resolveReferences(entities: Map<string, GameEntity>): any {
            return undefined;
        },
        rotateTo(target: Vector3, delta: number, tolerance?: number): boolean {
            return false;
        },
        sendMessage(receiver: GameEntity, message: string, delay?: number, data?: object | null): any {
            return undefined;
        },
        setRenderComponent<ComponentType>(renderComponent: ComponentType, callback: RenderCallback<ComponentType>): any {
            return undefined;
        },
        start(): any {
            return undefined;
        },
        toJSON(): { [p: string]: any } {
            return {};
        },
        update(delta: number): any {
            return undefined;
        },
        updateWorldMatrix(): void {
        },

    }
}