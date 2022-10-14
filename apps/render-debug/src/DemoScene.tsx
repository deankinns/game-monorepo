import * as React from "react";
import {useControls} from "leva";
import {OrbitControls, Sky, Stars, Sphere, Box, Capsule} from "@react-three/drei";
import {RigidBody, RigidBodyApi} from "@react-three/rapier";
import {Chair} from "fiber-package";
import {useRef, Suspense} from "react";
import {useFrame} from "@react-three/fiber";

import {TerrainManager, TerrainChunkManager} from "terrain-generator-package";

import {Dummy, House} from "fiber-package";

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
            <TerrainChunkManager />
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
        <RigidBody
            colliders="hull"
            position={[0, 50, 0]}
            enabledRotations={[false, true, false]}
            friction={4}
        >
            <Suspense fallback={null}>
                <Dummy name={'dave'} onClick={() => console.log('click')}/>
            </Suspense>

            <Capsule args={[0.5, 2.5]}>
                <meshBasicMaterial color={"green"} visible={false}/>
            </Capsule>
        </RigidBody>
        {/*<RigidBody position={[0, -5, 0]} lockTranslations={true} lockRotations={true}>*/}
        {/*    <House/>*/}
        {/*</RigidBody>*/}
    </>);
};

const ConditionalBody = ({children, condition}: { children: React.ReactNode, condition: boolean }) => {
    return !condition ? <>{children}</> : <RigidBody position={[-2, 10, 0]}>{children}</RigidBody>
}
