import {Canvas, useFrame} from '@react-three/fiber'
import {OrbitControls, Preload} from '@react-three/drei'
import {useEcsStore} from "react-becsy";
import {Debug, Physics} from "@react-three/rapier";
// import GameWorld from "@/components/canvas/GameWorld";

export default function Scene({children, ...props}: any) {
    // Everything defined in here will persist between route changes, only children are swapped
    return (
        <Canvas {...props}
                style={{width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0}}
                camera={{near: .01, far: 9999999, position: [100, 100, 100]}}
        >
            <directionalLight intensity={0.75}/>
            <ambientLight intensity={0.75}/>
            <Physics>
                <Debug />
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
    useFrame((state, delta, frame) => {
        update(frame, delta);
    })
    return null
}