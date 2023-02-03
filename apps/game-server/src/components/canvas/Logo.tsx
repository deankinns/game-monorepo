import * as THREE from 'three'
import {useMemo, useRef, useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {useFrame, useThree} from '@react-three/fiber'
import {Line, useCursor} from '@react-three/drei'

export default function Logo({route, ...props}: any) {
    const router = useRouter()
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])
    // const cam = useRef<THREE.Camera>(null!)

    const cam = useThree(state => state.camera);

    useCursor(hovered)
    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime()
        mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
        mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
        mesh.current.rotation.z -= delta / 4

        // cam.current = state.camera

        // state.camera.position.set(0, 0, 10)
        cam.lookAt(mesh.current.position)

        if (cam.position.distanceTo(mesh.current.position) > 10) {
            cam.position.lerp(mesh.current.position, delta * 2)
        }


    })
    useEffect(() => {
        // cam.position.set(0, 0, 10)
        // cam.quaternion.set(0, 0, 0, 1)
    })

    return (
        <group ref={mesh} {...props}>
            {/* @ts-ignore */}
            <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15}/>
            {/* @ts-ignore */}
            <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, 1]}/>
            {/* @ts-ignore */}
            <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, -1]}/>
            <mesh onClick={() => router.push(route)} onPointerOver={() => hover(true)}
                  onPointerOut={() => hover(false)}>
                <sphereGeometry args={[0.55, 64, 64]}/>
                <meshPhysicalMaterial roughness={0} color={hovered ? 'hotpink' : '#1fb2f5'}/>
            </mesh>
        </group>
    )
}
