import {MovingEntity as BaseMovingEntity, Vector3} from "yuka";
import {Entity} from "@lastolivegames/becsy";
import {GameEntity} from "./GameEntity";
import {VelocityComponent} from "becsy-package";
import {Vector3ToYuka} from "yuka-package";


const displacement$4 = new Vector3();
const target$1 = new Vector3();

export class MovingEntity extends GameEntity implements BaseMovingEntity {


    maxSpeed: number = 1;
    updateOrientation: boolean = true;

    v: Vector3 = new Vector3();

    // velocity: Vector3;

    // get velocity(): Vector3 {
    //     return Vector3ToYuka(this.components.read(VelocityComponent).velocity, this.v);
    // }
    //
    // set velocity(value: Vector3) {
    //     this.components?.write(VelocityComponent).setVelocity( value.x, value.y, value.z );
    // }

    velocity: Vector3 = Vector3ToYuka(this.components.read(VelocityComponent).velocity, this.v);

    constructor(public components: Entity) {
        super(components);
        this.velocity = new Vector3();
    }

    getSpeed(): number {
        return this.velocity.length()
    }
    getSpeedSquared(): number {
        return this.velocity.squaredLength()
    }

    update( delta: number ) {

        // make sure vehicle does not exceed maximum speed

        if ( this.getSpeedSquared() > ( this.maxSpeed * this.maxSpeed ) ) {

            this.velocity.normalize();
            this.velocity.multiplyScalar( this.maxSpeed );

        }

        // calculate displacement

        displacement$4.copy( this.velocity ).multiplyScalar( delta );

        // calculate target position

        target$1.copy( this.position ).add( displacement$4 );

        // update the orientation if the vehicle has a non zero velocity

        if ( this.updateOrientation && this.getSpeedSquared() > 0.00000001 ) {

            this.lookAt( target$1 );

        }

        // update position

        this.position.copy( target$1 );

        return this;

    }

    // getSpeed(): number {
    //     return 0;
    // }
    //
    // getSpeedSquared(): number {
    //     return 0;
    // }
    //
    // get velocity(): Vector3 {
    //     return Vector3ToYuka(this.components.read(VelocityComponent).velocity);
    // }
    //
    // set velocity(value: Vector3) {
    //     this.components?.write(VelocityComponent).setVelocity(value.x, value.y, value.z);
    // }
}