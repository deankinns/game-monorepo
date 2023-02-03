import {Entity, System} from "@lastolivegames/becsy";
import React, {
    forwardRef,
    Ref,
    Suspense,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    memo, useState
} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {Box, Capsule, Html, Sphere} from "@react-three/drei";
import {
    Physics,
    RigidBody,
    Debug,
    BallCollider,
    RigidBodyApi,
    useRevoluteJoint,
    interactionGroups, CapsuleCollider, ConeCollider
} from "@react-three/rapier";
import {Dummy} from "fiber-package";
import {GameEntityComponent, Vehicle, BrainComponent, MemoryComponent} from 'becsy-yuka-package';
import {Vector3ToThree, QuaternionToThree} from 'three-package'
import {PositionComponent, State, Health, Inventory, Weapon, Target} from 'becsy-package'
import {QuaternionToYuka, Vector3ToYuka, Vector3} from "yuka-package";
import {RigidBodyApiRef} from "@react-three/rapier/dist/declarations/src/types";
import {RefComponent, useEcsStore, useSystem} from "react-becsy";
import {Quaternion} from "three";
import {EntityListPanel, EntityPanel} from "becsy-ui";
import {PhysicsSystem} from "../systems";

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();


export const Robot = memo((props: { entity: Entity; onClick: any; position?: any }) => {
    // const ECS = useContext(ECSContext);
    // const ECS = useEcsStore().ecs;
    const ecs = useEcsStore(state => state.ecs);
    const bodyRef = useRef<RigidBodyApi>(null);
    // const boxRef = useRef<THREE.Mesh>(null);
    // const vehicle = props.entity.read(GameEntityComponent).entity as Vehicle;

    // const vehiclePos = useMemo(() => {
    //     const vehicle = props.entity.read(GameEntityComponent).entity as Vehicle;
    //     return Vector3ToThree(vehicle.position, new THREE.Vector3());
    // }, [props.entity, bodyRef.current]);
    // const vehicleRot = QuaternionToThree(vehicle.rotation, new THREE.Quaternion())

    // const vehiclePos = useRef<THREE.Vector3>(new THREE.Vector3());
    // const vehicleVel = new THREE.Vector3()
    const head = useRef<THREE.Mesh>(null!);
    const rHand = useRef<THREE.Mesh>(null!);
    const dummyRef = useRef<any>();
    const airborne = useRef(true);
    const airborneTime = useRef(0);

    const hand = useRef<Entity>(null!)
    const handleRef = useRef<any>({
        head: head.current,
        hand: rHand.current,
        obj: dummyRef.current?.group,
        body: bodyRef.current,
    });

    // useImperativeHandle(handleRef, () => {
    //     return {
    //         foo: 'bar',
    //         head: head.current,
    //         hand: rHand.current,
    //         obj: dummyRef.current?.group
    //     }
    // }, [head.current, rHand.current, dummyRef.current])

    const physicsSystem = useSystem(PhysicsSystem) as PhysicsSystem;

    useEffect(() => {
        if (!head.current || !rHand.current) {
            dummyRef.current?.group?.traverse((o: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>) => {
                if (o.name === 'mixamorigHead') {
                    head.current = o as THREE.Mesh;
                }
                if (o.name === 'mixamorigRightHand') {
                    rHand.current = o as THREE.Mesh;
                }
            })
        }

        // const ref = props.entity.write(RefComponent).ref


        if (!hand.current && rHand.current) {
            // ref.current = {
            //     head: head.current,
            //     hand: rHand.current,
            //     obj: dummyRef.current?.group
            // };
            handleRef.current = {
                head: head.current,
                hand: rHand.current,
                obj: dummyRef.current?.group,
                body: bodyRef.current,
            }
            ecs.enqueueAction((sys, e, {handleRef}) => {
                if (!e) return
                if (!e.has(RefComponent)) {
                    e.add(RefComponent, {ref: handleRef})
                } else {
                    e.write(RefComponent).ref.current = handleRef.current;
                }
            }, props.entity, {handleRef})
            // ECS.enqueueAction((sys, e, {handleRef}) => {
            //     if (e && !e.has(RefComponent)) {
            //         e.add(RefComponent, {ref: handleRef})
            //     } else{
            //         const ref = props.entity.write(RefComponent).ref = handleRef;
            //         // ref.current = handleRef.current;
            //     }
            // }, props.entity, {handleRef})
        }

        // props.entity.write(RefComponent).ref = handleRef


        if (bodyRef.current) {
            bodyRef.current.setTranslation(props.entity.read(PositionComponent).position);
            physicsSystem.addBody(props.entity, bodyRef.current);
        }

    }, [ecs, props.entity])

    useFrame((state, delta, frame) => {
        if (!props.entity || !props.entity.__valid || !props.entity.alive) return;
        const vehicle = props.entity.read(GameEntityComponent).entity as Vehicle;
        const {position, rotation} = props.entity.read(PositionComponent);
        // const {velocity} = props.entity.read(MovingEntity);
        const velocity = vehicle.velocity;

        // Vector3ToThree(position, vehiclePos)

        // if (!boxRef.current) return;
        // Vector3ToThree(position, boxRef.current.position)
        // QuaternionToThree(rotation, boxRef.current.quaternion)
        const q = QuaternionToThree(rotation, new THREE.Quaternion());

        // v2.applyQuaternion(q)
        // vehicle.
        v2.set(0, 0, 1).applyQuaternion(q);

        if (!bodyRef.current) return;

        const currentVel = bodyRef.current.linvel();
        // const v1 = new THREE.Vector3();
        // const v2 = new THREE.Vector3();

        dummyRef.current?.group?.getWorldDirection(v1);


        // boxRef.current?.getWorldDirection(v2);

        const currentDir = v1.normalize().cross(UP_AXIS);
        const targetDir = v2.normalize();
        const dot = currentDir.dot(targetDir) * -1;


        // bodyRef.current?.setLinvel({
        //     x: velocity.x * (airborne.current ? 0.1 : 1),
        //     y: currentVel.y,
        //     z: velocity.z * (airborne.current ? 0.1 : 1),
        // });

        const newImpulse = new THREE.Vector3(
            velocity.x * (airborne.current ? 0.1 : 1),
            currentVel.y,
            velocity.z * (airborne.current ? 0.1 : 1)
        )
        newImpulse.sub(currentVel)
        newImpulse.clampLength(-1, 1)

        // bodyRef.current?.applyImpulse(newImpulse)

        const targetSpeed = vehicle.velocity.length()
        const speed = bodyRef.current?.linvel().length();
        const maxSpeed = vehicle.maxSpeed;

        const y = airborne.current ? 0 : (delta * 10);
        // if (speed !== targetSpeed) {
        // if (targetSpeed < .1) {
        //     velocity.x = -currentVel.x;
        //     velocity.z = -currentVel.z;
        // }

        // if (targetSpeed > 0) {
        //     bodyRef.current?.applyImpulse({
        //         x: velocity.x * (airborne.current ? 0.1 : 1) * delta,
        //         y: airborne.current ? 0 : (delta * 10),
        //         z: velocity.z * (airborne.current ? 0.1 : 1) * delta
        //     })
        // } else {
        //     bodyRef.current?.applyImpulse({
        //         x: -currentVel.x * delta,
        //         y: airborne.current ? 0 : (delta * 10),
        //         z: -currentVel.z * delta
        //     })
        // }

        // if (speed <)

        // bodyRef.current?.setAngvel({x: 0, y: dot * (speed > maxSpeed * .01 ? 10 : .1), z: 0})
        // let turnSpeed = 10;

        // if (currentVel.y < 0.1 && currentVel.y > -0.1) {
        //     airborne.current = false;
        // }

        if (airborne.current) {
            airborneTime.current += delta;
        } else {
            airborneTime.current = 0;
        }

        if (head.current && dummyRef.current) {
            // Vector3ToYuka(head.current.getWorldPosition(new THREE.Vector3()), vehicle.position)
            // QuaternionToYuka(dummyRef.current.group.getWorldQuaternion(new THREE.Quaternion()),
            // Vector3ToYuka(bodyRef.current.translation(), vehicle.position)
            // QuaternionToYuka(bodyRef.current.rotation(), vehicle.rotation)
        }

        let armed = false;
        if (props.entity.has(Inventory)) {
            props.entity.read(Inventory).contents.forEach((item, i) => {
                if (item.has(Weapon)) {
                    armed = true;
                }
            })
        }

        animate(speed, maxSpeed, armed)

        // airborne.current = true;
    }, -1);

    const animate = (speed: number, maxSpeed: number, armed: false) => {
        if (props.entity.has(State)) {
            const v = props.entity.read(State).value;
            dummyRef.current?.setSelectedAction(v);
        } else if (speed > maxSpeed * .1) {
            dummyRef.current?.setSelectedAction(armed ? 'rifle/Rifle Run' : 'Running');
        } else if (speed > maxSpeed * .01) {
            dummyRef.current?.setSelectedAction(armed ? 'rifle/Rifle Run' : 'Walking');
        } else {
            dummyRef.current?.setSelectedAction(armed ? 'rifle/rifle aiming idle' : 'LookingAround');
        }

        if (!dummyRef.current?.actions['Falling Idle'].isRunning()) {
            dummyRef.current?.actions['Falling Idle'].play()
        }

        dummyRef.current?.actions['Falling Idle'].setEffectiveWeight(airborneTime.current);
        airborneTime.current = Math.max(0, airborneTime.current - 0.1);
    }
    //
    // if (!props.entity || !props.entity.alive || !props.entity.__valid) {
    //     return null
    // }
    const {x, y, z} = props.entity.read(PositionComponent).position;

    return (<RigidBody
            userData={{entity: props.entity}}
            ref={bodyRef}
            colliders={false}
            position={[x, y, z]}
            enabledRotations={[false, true, false]}
            onCollisionEnter={() => airborne.current = false}
            onCollisionExit={() => airborne.current = true}
            collisionGroups={interactionGroups([1])}
            friction={0}
        >
            <Suspense fallback={null}>
                <Dummy onClick={props.onClick} ref={dummyRef}/>
                {/*<axesHelper args={[1]}/>*/}
            </Suspense>
            <CapsuleCollider args={[1.1, .5]}/>
            <ConeCollider
                args={[50, 10]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 1, 50]}
                sensor
                mass={0}
                collisionGroups={interactionGroups([10], [0,1,2,3,4])}
                onIntersectionEnter={(p) => {
                    console.log(p)
                    // @ts-ignore
                    if (p.other.rigidBody?.userData?.entity.has(GameEntityComponent)) {
                        // @ts-ignore
                        const target = p.other.rigidBody?.userData?.entity.read(GameEntityComponent)
                        const memory = props.entity.read(MemoryComponent).system;


                        if (!memory.hasRecord(target)) {
                            memory.createRecord(target)
                        }
                        const record = memory.getRecord(target);
                        if (record) {
                            record.lastSensedPosition = target.read(PositionComponent).position
                            record.timeLastSensed = Date.now()
                        }



                        // memory.
                    }
                }}
            />
            {/*<BallCollider args={[0.5]} position={[0, 1.1, 0]}/>*/}
            {/*<BallCollider args={[0.5]} position={[0, 0, 0]}/>*/}
            {/*<BallCollider args={[0.5]} position={[0, -1.2, 0]}/>*/}
            <Html>
                {/*    <div className={'w3-light-grey'}>*/}
                {/*<p>{props.entity.read(Health).health}</p>*/}
                {/*/!*<p>{JSON.stringify(props.entity.read(BrainComponent).object?.toJSON(), undefined, 4)}</p>*!/*/}
                <BrainInfo entity={props.entity}/>
                {/*<EntityPanel entity={props.entity}/>*/}
                {/*</div>*/}
            </Html>
        </RigidBody>

        // </>
    );
})
Robot.displayName = 'Robot';

const BrainInfo = ({entity}: { entity: Entity }) => {
    // const brain = useStoreState(state => state.brain);
    const brain = useMemo(() => entity.read(BrainComponent).object, [entity]);
    const [selectEntity] = useEcsStore(state => [state.selectEntity]);
    // const target =
    // const [info, setInfo] = useState('');

    // const info = useRef(JSON.stringify(brain.toJSON(), undefined, 4));
    // //
    // useEffect(() => {
    //         if (brain) {
    //             // info.current = JSON.stringify(brain.toJSON(), undefined, 4);
    //             // console.log(brain.status)
    //             setInfo(JSON.stringify(brain.toJSON(), undefined, 4));
    //         }
    // },[brain, brain.status])

    const [time, setTime] = useState(Date.now());
    const [show, setShow] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, [show]);

    try {
        return (
            <div className={'w3-light-grey'}>
                {/*<div className="w3-container">*/}
                <div className={'w3-cell-row '}>
                    <button className={'w3-tiny w3-button w3-cell'}
                            onClick={() => setShow(!show)}>{entity.read(Health).health}</button>

                    <button className={'w3-tiny w3-button w3-cell'} onClick={(event) => {
                        selectEntity(entity)
                        event.stopPropagation()
                    }}>s
                    </button>
                </div>
                {show ? <EntityPanel entity={entity}/> : null}

                {show ? <pre>{JSON.stringify(brain.toJSON().subgoals, undefined, 4)}</pre> : null}
                {/*</div>*/}

            </div>)
    } catch (e) {
        return null
    }

}

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
const Head = forwardRef((props: { position: any }, ref) => {
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
const Body = forwardRef((props: { position: any, children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }, ref) => {
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
const Feet = forwardRef((props: { position: any }, ref) => {
    const rb = useRef<RigidBodyApi>(null);
    useImperativeHandle(ref, () => rb.current);

    return (<RigidBody
        position={props.position}
        ref={rb}
        colliders={"ball"}
        lockRotations={true}
    >
        <Sphere>
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