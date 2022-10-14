import {Entity} from "@lastolivegames/becsy";
import React, {forwardRef, Suspense, useEffect, useImperativeHandle, useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {Box, Sphere} from "@react-three/drei";
import {
    Physics,
    RigidBody,
    Debug,
    BallCollider,
    RigidBodyApi,
    useRevoluteJoint
} from "@react-three/rapier";
import {Dummy} from "../../../node_modules/fiber-package";
import {GameEntityComponent, Vehicle} from '../../../node_modules/becsy-yuka-package';
import {Vector3ToThree, QuaternionToThree} from '../../../node_modules/three-package'

import {PositionComponent, MovingEntity, State} from '../../../node_modules/becsy-package'
import {QuaternionToYuka, Vector3ToYuka, Vector3} from "../../../node_modules/yuka-package";
import {RigidBodyApiRef} from "@react-three/rapier/dist/declarations/src/types";

export const Robot = (props: { entity: Entity; onClick: any; position?: any }) => {
    const bodyRef = useRef<RigidBodyApi>(null);
    const boxRef = useRef<THREE.Mesh>(null);
    const vehicle = props.entity.read(GameEntityComponent).entity as Vehicle;

    const vehiclePos = Vector3ToThree(vehicle.position, new THREE.Vector3());
    const vehicleRot = QuaternionToThree(vehicle.rotation, new THREE.Quaternion())
    const vehicleVel = new THREE.Vector3()
    const head = useRef<THREE.Mesh>(null!);
    const dummyRef = useRef<{ setSelectedAction: any, group: any } | null>();
    //
    //
    // useEffect(() => {
    //     if (!head.current) {
    //         dummyRef.current?.group?.traverse((o) => {
    //             if (o.name === 'mixamorigHead') {
    //                 head.current = o as THREE.Mesh;
    //             }
    //         })
    //     }
    // }, [dummyRef.current, dummyRef])

    useFrame(() => {
        if (!head.current) {
            dummyRef.current?.group?.traverse((o: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>) => {
                if (o.name === 'mixamorigHead') {
                    head.current = o as THREE.Mesh;
                }
            })
        }
        const positionComponent = props.entity.read(PositionComponent);
        const movingEntityComponent = props.entity.read(MovingEntity);
        // const vehiclePos = Vector3YukaToThree(vehicle.position);
        // const vehicleRot = QuaternionYukaToThree(vehicle.rotation);
        vehiclePos.set(positionComponent.position.x, positionComponent.position.y, positionComponent.position.z);
        vehicleRot.set(positionComponent.rotation.x, positionComponent.rotation.y, positionComponent.rotation.z, positionComponent.rotation.w);


        vehicleVel.set(movingEntityComponent.velocity.x, movingEntityComponent.velocity.y, movingEntityComponent.velocity.z);
        boxRef.current?.position.copy(vehiclePos);
        boxRef.current?.quaternion.copy(vehicleRot);

        if (!bodyRef.current) return;

        const currentVel = bodyRef.current.linvel();
        // const vehicleVel = vehicle.velocity;
        const angle = bodyRef.current.rotation().angleTo(vehicleRot);

        const vehicleDir = new Vector3();
        vehicle.getDirection(vehicleDir)

        const bodyDir = new THREE.Vector3(0, 0, 1);

        const e = new THREE.Euler().setFromQuaternion(bodyRef.current.rotation(), 'XYZ',true );
        // @ts-ignore
        const e2 = new THREE.Euler().setFromQuaternion(boxRef.current?.quaternion, 'XYZ',true);

        // console.log('euler', e, e2)
        // bodyDir.applyEuler(e)

        const v = Vector3ToThree(vehicleDir, new THREE.Vector3);

        const a = v.dot(bodyDir)
        // bodyRef.current.rotation().
        // bodyRef.current?.(bodyDir);

        // bodyRef.current.rotation().

        bodyRef.current?.setLinvel({
            x: vehicleVel.x,
            y: currentVel.y,
            z: vehicleVel.z,
        });
        bodyRef.current?.setAngvel({x: 0, y: e2.y - e.y, z: 0})

        // if (angle > Math.PI) {
        // console.log('angle', angle, a)
        // }

        // vehicle.position.copy(Vector3ThreeToYuka(bodyRef.current.translation()));
        // vehicle.rotation.copy(QuaternionThreeToYuka(bodyRef.current.rotation()));

        const speed = vehicle.velocity.length()
        const maxSpeed = vehicle.maxSpeed;

        if (props.entity.has(State)) {
            const v = props.entity.read(State).value;
            dummyRef.current?.setSelectedAction(v);
        } else if (currentVel.y > 0.1 || currentVel.y < -0.001) {
            dummyRef.current?.setSelectedAction('Falling Idle');
        } else if (speed > maxSpeed * .1) {
            dummyRef.current?.setSelectedAction('Running');
        } else if (speed > maxSpeed * .01) {
            dummyRef.current?.setSelectedAction('Walking');
        } else {
            dummyRef.current?.setSelectedAction('LookingAround');
        }

        if (head.current) {
            Vector3ToYuka(head.current.getWorldPosition(new THREE.Vector3()), vehicle.position)
        }


    }, -1);


    return (
        <>

            <RigidBody
                ref={bodyRef}
                colliders={false}
                position={[vehiclePos.x, vehiclePos.y, vehiclePos.z]}
                enabledRotations={[false, true, false]}
                onClick={props.onClick}
                // rotation={[vehicleRot.x, vehicleRot.y, vehicleRot.z, vehicleRot.w]}
            >
                <Suspense fallback={null}>
                    <Dummy ref={dummyRef}/>
                    <axesHelper args={[1]}/>
                </Suspense>
                <BallCollider args={[0.5]} position={[0, 1.1, 0]}/>
                <BallCollider args={[0.5]} position={[0, 0, 0]}/>
                <BallCollider args={[0.5]} position={[0, -1.2, 0]}/>
            </RigidBody>
            <Box ref={boxRef} args={[.1, .1, .1]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <axesHelper args={[1]}/>
            </Box>

            {/*<Colliders position={[0, 10, 0]} target={vehicle}>*/}
            {/*    <Suspense fallback={null}>*/}
            {/*        <Dummy ref={dummyRef} onClick={props.onClick}/>*/}
            {/*    </Suspense>*/}
            {/*</Colliders>*/}
        </>
    );
};

// @ts-ignore
const Colliders = ({position, target, children}) => {
    const head = useRef<RigidBodyApi>(null!);
    const neck = useRef<any>(null!);

    const body = useRef<RigidBodyApi>(null!);
    // const legs = useRef(null!);

    const feet = useRef<RigidBodyApi>(null!);

    useFrame(() => {
        // head.current?.applyTorqueImpulse({x: .1, y: 0, z: 0});
        // head.current?.applyTorqueImpulse({x: .1, y: .01, z: 0});
        // neck.current?.configureMotorPosition(Date.now(),0,0);
        // feet.current?.setLinvel(velocity)

        // head.current?.setTranslation(target.position)
        // head.current?.setRotation(target.rotation)

        feet.current?.setLinvel(target.velocity)

        Vector3ToYuka(head.current.translation(), target.position)
    })

    return <group position={position}>
        <Head key={'head'} ref={head} position={[0, 3, 0]}/>
        <Body key={'body'} ref={body} position={[0, 1.5, 0]}>{children}</Body>
        <Feet key={'feet'} ref={feet} position={[0, 0, 0]}/>

        <NeckJoint ref={neck} b1={head} b2={body}/>
        <LegJoint b1={body} b2={feet}/>
    </group>
}

// eslint-disable-next-line react/display-name
const NeckJoint = forwardRef(({b1, b2}: { b1: RigidBodyApiRef, b2: RigidBodyApiRef }, ref) => {
    const joint = useRevoluteJoint(b1, b2, [
            [0, 0, 0],
            [0, 2, 0],
            [1, 0, 0]
        ]
    );
    useImperativeHandle(ref, () => joint);
    // joint.configureMotorPosition(0, 0, 0);
    return null
})
const LegJoint = ({b1, b2}: { b1: RigidBodyApiRef, b2: RigidBodyApiRef }) => {
    const joint = useRevoluteJoint(b1, b2, [
            [0, -1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ]
    );

    // joint.
    return null
}

//
// const Feet = () => {
//     return <RigidBody>
//         <Sphere/>
//     </RigidBody>
// }
// forwardRef(Feet);


// eslint-disable-next-line react/display-name
const Head = forwardRef((props :{position: any}, ref) => {
    const rb = useRef<RigidBodyApi>(null);
    useImperativeHandle(ref, () => rb.current);

    return (<RigidBody
        position={props.position}
        ref={rb}
        colliders={"ball"}
    >
        <Sphere/>
    </RigidBody>);
});


// eslint-disable-next-line react/display-name
const Body = forwardRef((props :{position: any, children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined}, ref) => {
    const rb = useRef<RigidBodyApi>(null);
    useImperativeHandle(ref, () => rb.current);

    return (<RigidBody
        position={props.position}
        ref={rb}
        colliders={"ball"}
        enabledRotations={[false, true, false]}
    >
        {props.children}
        <Sphere>
            <meshStandardMaterial color={"green"} wireframe/>
        </Sphere>
    </RigidBody>);
});


// eslint-disable-next-line react/display-name
const Feet = forwardRef((props :{position: any}, ref) => {
    const rb = useRef<RigidBodyApi>(null);
    useImperativeHandle(ref, () => rb.current);

    return (<RigidBody
        position={props.position}
        ref={rb}
        colliders={"ball"}
        lockRotations={true}
    >
        <Sphere >
            <meshStandardMaterial color={"red"}/>
        </Sphere>
    </RigidBody>);
});
//
// const Head = () => {
//     return <RigidBody>
//         <Sphere/>
//     </RigidBody>
// }