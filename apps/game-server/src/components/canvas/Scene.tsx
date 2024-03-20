import {Canvas, useFrame} from '@react-three/fiber'
import {OrbitControls, Preload} from '@react-three/drei'
import {useEcsStore} from "react-becsy";
import {Debug, Physics} from "@react-three/rapier";
// import GameWorld from "@/components/canvas/GameWorld";
import {useDebug} from "fiber-package/src/UseDebug";

// import {navMeshHelper} from "yuka";
import {createConvexRegionHelper} from "three-yuka-package";
import {useEffect} from "react";

export default function Scene({children, ...props}: any) {

    const [debug] = useDebug(state => [state.debug]);
    // Everything defined in here will persist between route changes, only children are swapped

    return (
        <Canvas {...props}
                style={{width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0}}
                camera={{near: 1, far: 9999999, position: [100, 100, 100]}}
        >
            <directionalLight intensity={0.75}/>
            <ambientLight intensity={0.75}/>
            <Physics>
                {debug && <Debug />}
                {children}
                {/*<GameWorld />*/}
            </Physics>
            <Preload all/>
            <Update/>
        </Canvas>
    )
}

const Update = () => {
    const [update] = useEcsStore(state => ([state.update]));
    // const {step} = useRapier();

    // useBeforePhysicsStep()

    useFrame((state, delta, frame) => {

        update(state.clock.elapsedTime, delta);
        state.gl.render(state.scene, state.camera);
        // state.camera.ren
        // step(delta);
    })
    return null
}