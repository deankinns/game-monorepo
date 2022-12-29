import * as React from "react";
import {useControls} from "leva";
import {
    OrbitControls,
    Sky,
    Stars,
    Sphere,
    Box,
    Capsule,
    PointerLockControls,
    FirstPersonControls
} from "@react-three/drei";
import {RigidBody, RigidBodyApi} from "@react-three/rapier";
import {Chair} from "fiber-package";
import {useRef, Suspense, useEffect} from "react";
import {RootState, useFrame, useThree} from "@react-three/fiber";

import {TerrainManager, TerrainChunkManager} from "terrain-generator-package";

import {Dummy, House, usePersonControls} from "fiber-package";
import * as THREE from "three";
import {Vector3} from "three";

export const DemoScene = () => {


    const {position, scale, usePhysics} = useControls("Box", {
        position: [0, 10, 0],
        scale: [1, 1, 1],
        usePhysics: false
    });
    // const pos = useRef(position);

    const {azimuth, inclination, distance} = useControls("Sky", {
        azimuth: {
            value: 0.25,
            max: 1,
            min: 0,
            step: 0.01,
        },
        inclination: {
            value: 0,
            max: 1,
            min: 0,
            step: 0.01,
        },
        distance: {
            value: 30000,
            max: 100000000,
            step: 1000,
        },
        sunPosition: [0, 1, 0],
    });

    const bodyRef = useRef<RigidBodyApi>(null!);

    useFrame(() => {
        if (bodyRef.current) {
            position[0] = bodyRef.current?.translation().x;
            position[1] = bodyRef.current?.translation().y;
            position[2] = bodyRef.current?.translation().z;
        }
    })


    return (<>
        {/*<Stars/>*/}
        <Sky azimuth={azimuth} inclination={inclination} distance={distance}/>

        {/*<RigidBody*/}
        {/*    lockRotations={true}*/}
        {/*    lockTranslations={true}*/}
        {/*    colliders={'trimesh'}*/}
        {/*>*/}
        <TerrainChunkManager/>
        {/*</RigidBody>*/}


        <ambientLight intensity={0.2}/>
        <directionalLight position={[0, 0, 5]} color="teal"/>


        {usePhysics ?
            <RigidBody
                ref={bodyRef}
                canSleep={true}
                position={position}

            >
                <Box
                    key={`box`}
                    args={scale}
                />
            </RigidBody>
            : <Box args={scale} position={position}/>}
        {/*<RigidBody position={[0, 10, 0]}>*/}
        {/*    <Chair/>*/}
        {/*</RigidBody>*/}
        <Dude/>
        {/*<RigidBody position={[0, -5, 0]} lockTranslations={true} lockRotations={true}>*/}
        {/*    <House/>*/}
        {/*</RigidBody>*/}
    </>);
};

class ThirdPersonCamera {
    private _params: any;
    private _camera: any;
    private _currentPosition: Vector3;
    private _currentLookat: Vector3;
    constructor(params: { camera: any; target?: RigidBodyApi; }) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }

    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-1.5, 2.0, -3.0);
        idealOffset.applyQuaternion(this._params.target.rotation());
        idealOffset.add(this._params.target.translation());
        return idealOffset;
    }

    _CalculateIdealLookat(yOffset = 0.0) {
        const idealLookat = new THREE.Vector3(0, 1.0 + yOffset, 5.0);
        idealLookat.applyQuaternion(this._params.target.rotation());
        idealLookat.add(this._params.target.translation());
        return idealLookat;
    }

    Update(timeElapsed: number, yOffset = 0.0) {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookat = this._CalculateIdealLookat(yOffset);

        //const t = 1;
         const t = 4.0 * timeElapsed;
        // const t = 1.0 - Math.pow(0.001, timeElapsed);

        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}

const Dude = () => {
    let {jump, forward, backward, left, right, lookLeft, lookRight, lookUp, lookDown} = usePersonControls();
    const ref = useRef<RigidBodyApi>(null!);
    const dummyRef = useRef<any>(null!);

    const friction = useRef(5);

    const yOffset = useRef(0);

    // const [camera] = useThree((state) => [state.camera]);

    // const T = new ThirdPersonCamera({
    //     camera, target: dummyRef.current
    // })

    const thirdPersonCamera = useRef<ThirdPersonCamera>();

    const airborne = useRef(true);
    const airborneTime = useRef(0);

    const {speed} = useControls(
        "Dude", {speed: {value: 1, max: 10, min: 0.1, step: 0.1}}
    )

    const onMouseMove = (e: MouseEvent) => {
       // lookLeft = e.movementX
       // lookRight = e.movementX
       // lookUp = e.movementY
       // lookDown = e.movementY
        yOffset.current -= e.movementY / 100
        ref.current?.setAngvel({x: 0, y: -e.movementX / 10, z: 0});
    }

    const onMouseDown = () => {
        dummyRef.current?.setSelectedAction('BodyJabCross')
    }

    useEffect(() => {
        // document.body.requestPointerLock();
        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mousedown', onMouseDown, false );
        dummyRef.current?.actions['Falling Idle'].play();
        return () => {
            document.removeEventListener( 'mousemove', onMouseMove, false );
        }
    }, [])

    useFrame((state: RootState, delta) => {
        if (!thirdPersonCamera.current && ref.current) {
            thirdPersonCamera.current = new ThirdPersonCamera({
                camera:state.camera, target: ref.current
            })
        }

        // state.gl.domElement.requestPointerLock();

        thirdPersonCamera.current?.Update(delta, yOffset.current);
        const dir = new THREE.Vector3();
        state.camera.getWorldDirection(dir)
        const strafe = new THREE.Vector3(0, 1, 0).cross(dir).normalize().multiplyScalar((left ? 1 : right ? -1 : 0));
        dir.multiplyScalar((forward ? 1 : backward ? -1 : 0))
        dir.add(strafe);

        const vel = ref.current?.linvel()
        // console.log(vel.length())

        const maxSpeed = 5;
        // dummyRef.current?.setBlendDuration(1);
        if (dir.length() > 0) {
            dir.y = airborne.current ? 0 : .5;
            dir.normalize();
            // dir.add(new THREE.Vector3(0, 1, 0));
            friction.current = 0
            if (vel.length() < maxSpeed) {
                ref.current?.applyImpulse(dir.multiplyScalar(speed * (airborne.current ? .1 : 1)));
            }
            //
        } else {
            friction.current = 5
        }
        if (vel.length() > maxSpeed * .8) {
            dummyRef.current?.setSelectedAction('Running');
        } else if (vel.length() > maxSpeed * .01) {
            dummyRef.current?.setSelectedAction('Walking');
        } else  {
            dummyRef.current?.setSelectedAction('Idle');
        }

        if (!dummyRef.current?.actions['Falling Idle'].isRunning()) {
            dummyRef.current?.actions['Falling Idle'].play()
        }

        if (airborne.current) {
            airborneTime.current += delta;
        } else {
            airborneTime.current = 0;
        }
        dummyRef.current?.actions['Falling Idle'].setEffectiveWeight(airborneTime.current);

        // const camRot = new THREE.Quaternion();
        // state.camera.getWorldQuaternion(camRot)
        // camRot.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI))
        // camHelper.current?.quaternion.copy(camRot);
        // camHelper.current?.position.copy(ref.current?.translation() ?? new THREE.Vector3());
        // refOrbit.current?.target.copy(ref.current?.translation() ?? new THREE.Vector3());
        //
        //
        // const angle = camRot.angleTo(ref.current?.rotation() ?? new THREE.Quaternion());

        // dummyRef.current?.group.quaternion.copy(camRot)
        //

        // const bodyRot = ref.current.rotation();

        // const angle = bodyRot.y + camRot.y;
        const angle = lookLeft ? 1 : lookRight ? -1 : 0;
        yOffset.current += (lookUp ? 1 : lookDown ? -1 : 0) * 0.1;
        if (angle !== 0) {
            ref.current?.setAngvel({x: 0, y:angle, z: 0});
        }

        if (jump && !airborne.current) {
            ref.current?.applyImpulse({x: 0, y: 10, z: 0});
        }
        // dummyRef.current.group.rotation.y = camRot.y;

        // const angle = camHelper.current?.quaternion.angleTo(ref.current?.rotation() ?? new THREE.Quaternion());

        // console.log(angle);
        // dummyRef.current?.group.quaternion.copy(camHelper.current?.quaternion ?? new THREE.Quaternion());
        // state.camera.l
        // airborne.current++
    })

    return <>
        <RigidBody
            ref={ref}
            colliders="hull"
            position={[0, 50, 0]}
            enabledRotations={[false, false, false]}
            friction={friction.current}
            onCollisionEnter={() => airborne.current = false}
            onCollisionExit={() => airborne.current = true}
        >

            <Suspense fallback={null}>
                {/*<axesHelper args={[1]}/>*/}
                <Dummy ref={dummyRef} name={'dave'} onClick={() => console.log('click')}/>
            </Suspense>

            <Capsule args={[0.5, 2.5]}>
                <meshBasicMaterial color={"green"} visible={false}/>
            </Capsule>
        </RigidBody>
        {/*<axesHelper ref={camHelper}/>*/}
        {/*<FirstPersonControls object={dummyRef.current}/>*/}
        {/*<PointerLockControls*/}
        {/*    */}
        {/*/>*/}
        {/*<OrbitControls*/}
        {/*    ref={refOrbit}*/}
        {/*    maxDistance={4}*/}
        {/*    minDistance={4}*/}
        {/*/>*/}
    </>
}

const ConditionalBody = ({children, condition}: { children: React.ReactNode, condition: boolean }) => {
    return !condition ? <>{children}</> : <RigidBody position={[-2, 10, 0]}>{children}</RigidBody>
}
