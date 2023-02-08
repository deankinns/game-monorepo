import { useRouter } from 'next/router'
import {FirstPersonControls} from "becsy-fiber";
import {useEcsStore, useEntityById, useSystem} from "react-becsy";
import { NextResponse } from 'next/server'
import {useEffect, useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3,Mesh} from "three";
import {CombatSystem} from 'becsy-yuka-package'

const Post = () => {
    const router = useRouter()
    const { entity } = router.query

    // const []
    // const [ecs ] = useEcsStore(state => [state.ecs]);

    // const e = useEntityById(entity)
    // const [mousePos, setMousePos] = useState({x:0, y: 0});
    //
    // useEffect(() => {
    //     const handleMouseMove = (event) => {
    //         setMousePos({ x: event.clientX, y: event.clientY });
    //     };
    //
    //
    //     window.addEventListener('mousemove', handleMouseMove);
    //
    //     return () => {
    //         window.removeEventListener(
    //             'mousemove',
    //             handleMouseMove
    //         );
    //     };
    // }, []);

    return <div className={'fps-hud'}>
        {/*<h1 className={'crosshair'} style={{top: mousePos.y, left: mousePos.x}}>X</h1>*/}
    </div>
}

const Control = () => {
    const router = useRouter()
    const { entity } = router.query
    // @ts-ignore
    const e = useEntityById(entity)

    if (!e) {
        router.push('/game')
    }

    useFrame((state, delta) => {

    })

    return <FirstPersonControls entity={e}/>
}

function MouseReticle() {
    const router = useRouter()
    const { entity } = router.query
    // @ts-ignore
    const e = useEntityById(entity)

    const combatSystem = useSystem(CombatSystem) as CombatSystem;

    const { camera, mouse } = useThree();
    const mouseReticle = useRef<Mesh>(null!);

    useFrame(() => {
        if (mouseReticle.current) {
            const vector = new Vector3(mouse.x, mouse.y, -0.8).unproject(camera);
            mouseReticle.current.position.set(...vector.toArray());
        }
    })

    return (
        <mesh ref={mouseReticle} onClick={() => {
            console.log('click')
            combatSystem?.shoot(e)
        }}>
            <sphereBufferGeometry args={[0.01, 100, 100]} />
            <meshBasicMaterial color={'red'} />
        </mesh>
    )
}

Post.canvas = (props: any) => {
    return <>
        <Control/>
        <MouseReticle/>
    </>
}

Post.hideWorld = false;

export default Post