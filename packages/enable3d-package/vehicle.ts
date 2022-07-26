// import {MainScene} from '../app/engine/mainScene';

import {Object3D} from "three";

const transparent = true;
const debug = true;

export class Vehicle {
  // private world: any;
  public position: any;
  public motorBackLeft: Ammo.btHingeConstraint;
  public motorBackRight: Ammo.btHingeConstraint;
  public motorFrontLeft: Ammo.btHingeConstraint;
  public motorFrontRight: Ammo.btHingeConstraint;
  private physics: any;
  public m0: { left: Ammo.btHingeConstraint; right: Ammo.btHingeConstraint };
  public plate: any;

  acceleration = 0;
  steering = 0;
  controlled = false;

  public ghost: Object3D;

  constructor(factory: any, options: { position: any; }) {

    // this.world = world;
    // @ts-ignore
    // const scene3DEntity = world.entityManager.getEntityByName('Scene3D').getComponent(Scene3DComponent);

    const physics = factory.physics

    this.physics = physics;//scene3DEntity.value.physics;

    // const {physics} = world;
    //
    // this.physics = physics;

    this.ghost = factory.add.box();

    // this.physics = this.world.entityManager.getEntityByName('PhysicsEntity').getComponent(PhysicsWorld).value;

    this.position = options.position;

    // }
    //
    // create() {
    const wheelX = 1.5;
    const wheelZ = 2;
    const axisZ = 0.2;

    // blue wheels
    const wheelBackRight = this.addWheel(wheelX, wheelZ);
    const wheelBackLeft = this.addWheel(-wheelX, wheelZ);
    const wheelFrontRight = this.addWheel(wheelX, -wheelZ); // right front
    const wheelFrontLeft = this.addWheel(-wheelX, -wheelZ);

    // red rotors
    const rotorBackRight = this.addRotor(wheelX, wheelZ);
    const rotorBackLeft = this.addRotor(-wheelX, wheelZ);
    const rotorFrontRight = this.addRotor(wheelX, -wheelZ);
    const rotorFrontLeft = this.addRotor(-wheelX, -wheelZ);

    // blue axis
    const axisBackOne = this.addAxis(wheelZ, .1); // the one at the back
    const axisFrontOne = this.addAxis(-wheelZ + axisZ, 0.04);
    const axisFrontTwo = this.addAxis(-wheelZ - axisZ, .1);

    /**
     * CONSTRAINTS
     */

      // constraint wheel to rotor
    const wheelToRotorConstraint = {axisA: {y: 1}, axisB: {y: 1}};
    this.motorBackLeft = this.physics.add.constraints.hinge(
      wheelBackLeft.body,
      rotorBackLeft.body,
      wheelToRotorConstraint
    );
    this.motorBackRight = this.physics.add.constraints.hinge(
      wheelBackRight.body,
      rotorBackRight.body,
      wheelToRotorConstraint
    );
    this.motorFrontLeft = this.physics.add.constraints.hinge(
      wheelFrontLeft.body,
      rotorFrontLeft.body,
      wheelToRotorConstraint
    );
    this.motorFrontRight = this.physics.add.constraints.hinge(
      wheelFrontRight.body,
      rotorFrontRight.body,
      wheelToRotorConstraint
    );

    // constraint axis to rotor
    const axisToRotor = (rotorRight: { body: any; }, rotorLeft: { body: any; }, axis: { body: any; }, z: number) => {
      const right = this.physics.add.constraints.hinge(rotorRight.body, axis.body, {
        pivotA: {y: 0.2, z},
        pivotB: {y: -1.3},
        axisA: {x: 1},
        axisB: {x: 1}
      });
      const left = this.physics.add.constraints.hinge(rotorLeft.body, axis.body, {
        pivotA: {y: -0.2, z},
        pivotB: {y: 1.3},
        axisA: {x: 1},
        axisB: {x: 1}
      });
      return {right, left};
    };

    this.physics.add.constraints.slider(rotorBackRight.body, axisBackOne.body, {
      frameA: {x: Math.PI / 2, y: 0, z: 0},
      frameB: {x: Math.PI / 2, y: 0, z: 0},
      linearLowerLimit: 0,
      linearUpperLimit: 0
    });

    this.physics.add.constraints.slider(rotorBackLeft.body, axisBackOne.body, {
      frameA: {x: Math.PI / 2, y: 0, z: 0},
      frameB: {x: Math.PI / 2, y: 0, z: 0},
      linearLowerLimit: 0,
      linearUpperLimit: 0
    });

    this.m0 = axisToRotor(rotorFrontRight, rotorFrontLeft, axisFrontTwo, -0);
    axisToRotor(rotorFrontRight, rotorFrontLeft, axisFrontOne, 0.4);

    // axisToRotor(rotorBackRight, rotorBackLeft, axisBackOne, -0);

    this.plate = this.addPlate();
    this.plate.geometry.computeBoundingSphere();

    this.plate.userData.vehicle = this;
    // this.plate.add(this.camera)
    // this.camera.lookAt(this.plate.position.clone())
    this.physics.add.constraints.lock(this.plate.body, axisBackOne.body);

    this.physics.add.constraints.lock(this.plate.body, axisFrontTwo.body);

    const limit = 0.3;
    const dofSettings = {
      angularLowerLimit: {x: 0, y: 0, z: 0},
      angularUpperLimit: {x: 0, y: 0, z: 0},
      linearLowerLimit: {x: 0, y: -limit, z: -0.1},
      linearUpperLimit: {x: 0, y: limit, z: 0.1}
    };
    this.physics.add.constraints.dof(this.plate.body, axisFrontOne.body, {...dofSettings, offset: {y: 0.9}});
    this.physics.add.constraints.dof(this.plate.body, axisFrontOne.body, {...dofSettings, offset: {y: -0.9}});

    this.m0.left.enableAngularMotor(true, 0, 5000);
    this.m0.right.enableAngularMotor(true, 0, 5000);

  }

  addPlate(): any {
    const plate = this.physics.factory.add.box(
      {y: 1.5, width: 1.8, depth: 4.7, height: 1, mass: 1000},
      {lambert: {wireframe: true}}
    );
    plate.position.add(this.position);
    this.physics.add.existing(plate);
    return plate;
  }

  addAxis(z: number, radius = 0.1): any {
    const axis = this.physics.factory.add.cylinder(
      {z, y: 1, mass: 10, radiusTop: radius, radiusBottom: radius, height: 2.6},
      {lambert: {color: 'blue', transparent, opacity: 0.5}}
    );
    axis.position.add(this.position);
    axis.rotateZ(Math.PI / 2);
    this.physics.add.existing(axis);
    return axis;
  }

  addRotor(x: number, z: number): any {
    const rotor = this.physics.factory.add.cylinder(
      {mass: 10, radiusBottom: 0.35, radiusTop: 0.35, radiusSegments: 24, height: 0.4, x, y: 1, z},
      {lambert: {color: 'red', transparent, opacity: 0.5}}
    );
    rotor.position.add(this.position);
    rotor.rotateZ(Math.PI / 2);
    this.physics.add.existing(rotor);
    return rotor;
  }

  addWheel(x: number, z: number): any {
    const wheel = this.physics.factory.add.cylinder(
      {mass: 20, radiusBottom: 0.5, radiusTop: 0.5, radiusSegments: 24, height: 0.35, x, y: 1, z},
      {lambert: {color: 'blue', transparent, opacity: 0.5}}
    );
    wheel.position.add(this.position);
    wheel.rotateZ(Math.PI / 2);
    this.physics.add.existing(wheel);
    wheel.body.setFriction(3);
    return wheel;
  }

  addAxisRotor(x: number, y: number, z: number): any {
    const axisRotor = this.physics.factory.add.box(
      {x, y, z, mass: 5, width: 0.25, height: 0.2, depth: 1},
      {lambert: {transparent, opacity: 0.5}}
    );
    axisRotor.position.add(this.position);
    this.physics.add.existing(axisRotor);
    return axisRotor;
  }
}
