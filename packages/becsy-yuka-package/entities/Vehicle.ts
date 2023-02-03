import {Entity} from "@lastolivegames/becsy";
import {MemorySystem, Smoother, SteeringManager, Vector3, Vehicle as BaseVehicle, Vision,} from "yuka";
import {GameEntity} from "./GameEntity";
import {MovingEntity} from "./MovingEntity";
import {Vector3ToYuka} from "yuka-package";
import {PositionComponent, VelocityComponent} from "becsy-package";

const steeringForce = new Vector3();
const displacement = new Vector3();
const acceleration = new Vector3();
const target = new Vector3();
const velocitySmooth = new Vector3();

export class Vehicle extends MovingEntity implements BaseVehicle {
    constructor(public components: Entity) {
        super(components);
        this.steering = new SteeringManager(this);

        this.updateOrientation = true;
    }
    //
    // handleMessage(telegram: {
    //     message: any;
    //     sender: any;
    //     receiver: any;
    // }): boolean {
    //     return telegram.message(telegram.sender, telegram.receiver);
    // }

    mass: number = 1;
    maxForce: number = 100;
    smoother: Smoother | null = null;
    steering: SteeringManager;

    get angularVelocity() {
        return Vector3ToYuka(this.components.read(VelocityComponent).angularVelocity);
    };

    update( delta: number ) {

        // calculate steering force

        this.steering.calculate( delta, steeringForce );
        //
        // this.components.write(VelocityComponent).angularVelocity.x = steeringForce.x;
        // this.components.write(VelocityComponent).angularVelocity.y = steeringForce.y;
        // this.components.write(VelocityComponent).angularVelocity.z = steeringForce.z;

        // acceleration = force / mass

        acceleration.copy( steeringForce ).divideScalar( this.mass );

        // update velocity

        this.velocity.add( acceleration.multiplyScalar( delta ) );


        // make sure vehicle does not exceed maximum speed

        if ( this.getSpeedSquared() > ( this.maxSpeed * this.maxSpeed ) ) {

            this.velocity.normalize();
            this.velocity.multiplyScalar( this.maxSpeed );

        }

        // calculate displacement

        displacement.copy( this.velocity ).multiplyScalar( delta );

        // calculate target position

        target.copy( this.position ).add( displacement );

        // update the orientation if the vehicle has a non zero velocity

        if ( this.updateOrientation === true && this.smoother === null && this.getSpeedSquared() > 0.00000001 ) {

            this.lookAt( target );

        }

        // update position

        this.position.copy( target );

        // if smoothing is enabled, the orientation (not the position!) of the vehicle is
        // changed based on a post-processed velocity vector

        if ( this.updateOrientation === true && this.smoother !== null ) {

            this.smoother.calculate( this.velocity, velocitySmooth );

            displacement.copy( velocitySmooth ).multiplyScalar( delta );
            target.copy( this.position ).add( displacement );

            this.lookAt( target );

        }

        return this;

    }

}

// export class Character extends Vehicle {
//     private vision = new Vision(this)
//     private memory = new MemorySystem(this);
//     constructor(public components: Entity) {
//         super(components);
//     }
// }

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
//
// const foo = {
//
// }
//
// export const GameEntityWrapper = (entity: Entity): Partial<GameEntity> => {
//     const {position, rotation} = entity.read(PositionComponent);
//     // const vecD = new Vector3(direction.x, direction.y, direction.z);
//     const rotD = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
//     const forward = new Vector3(0, 0, 1);
//
//     return {
//         components: entity.hold(),
//
//         position: new Vector3(position.x, position.y, position.z),
//         rotation: new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
//         forward,//: new Vector3(0, 0, 1),
//         up: new Vector3(0, 1, 0),
//
//         scale: new Vector3(1, 1, 1),
//         worldMatrix: new Matrix4(),
//         uuid: `${entity.__id}`,
//
//         add(gameEntity: GameEntity): any {
//             gameEntity.components.add(Parent, {parent: entity});
//             return GameEntityWrapper(entity);
//         },
//         fromJSON(json: { [p: string]: any }): any {
//             return undefined;
//         },
//         getDirection(result: Vector3): Vector3 {
//             return result.copy( forward ).applyRotation( rotD ).normalize();
//         },
//         getWorldDirection(result: Vector3): Vector3 {
//             // return undefined;
//             return GameEntity.prototype.getWorldDirection(result);
//         },
//         getWorldPosition(result: Vector3): Vector3 {
//             // return undefined;
//             return GameEntity.prototype.getWorldPosition(result);
//         },
//         handleMessage(telegram: Telegram): boolean {
//             return false;
//         },
//         lineOfSightTest(ray: Ray, intersectionPoint: Vector3): Vector3 | null {
//             return null;
//         },
//         lookAt(target: Vector3): any {
//             return undefined;
//         },
//         remove(entity: GameEntity): any {
//             return undefined;
//         },
//         resolveReferences(entities: Map<string, GameEntity>): any {
//             return undefined;
//         },
//         rotateTo(target: Vector3, delta: number, tolerance?: number): boolean {
//             return false;
//         },
//         sendMessage(receiver: GameEntity, message: string, delay?: number, data?: object | null): any {
//             return undefined;
//         },
//         setRenderComponent<ComponentType>(renderComponent: ComponentType, callback: RenderCallback<ComponentType>): any {
//             return undefined;
//         },
//         start(): any {
//             return undefined;
//         },
//         toJSON(): { [p: string]: any } {
//             return {};
//         },
//         update(delta: number): any {
//             return undefined;
//         },
//         updateWorldMatrix(): void {
//         },
//
//     }
// }