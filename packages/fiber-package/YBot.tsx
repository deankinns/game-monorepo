import * as React from 'react'
import * as THREE from 'three'
import {GLTF} from 'three-stdlib'
import {useAnimations, useFBX, useGLTF, useMatcapTexture} from "@react-three/drei";
// import {withKnobs, select, number} from '@storybook/addon-knobs'

// import {Setup} from '../Setup'

// import {useAnimations, useGLTF, useMatcapTexture} from '../../src'

// export default {
//     title: 'Abstractions/useAnimations',
//     component: useAnimations,
//     decorators: [(storyFn) => <Setup cameraPosition={new Vector3(0, 0, 3)}>{storyFn()}</Setup>, withKnobs],
// }

type GLTFResult = GLTF & {
    nodes: {
        YB_Body: THREE.SkinnedMesh
        YB_Joints: THREE.SkinnedMesh
        mixamorigHips: THREE.Bone
    }
    materials: {
        YB_Body: THREE.MeshStandardMaterial
        YB_Joints: THREE.MeshStandardMaterial
    }
}

type AnimationControllerProps = {
    ybotRef: React.MutableRefObject<THREE.Group | undefined | null>
    animations: THREE.AnimationClip[]
}

function AnimationController(props: AnimationControllerProps) {
    const {actions} = useAnimations(props.animations, props.ybotRef)

    // Storybook Knobs
    const actionOptions = Object.keys(actions)
    const selectedAction = actionOptions[2] //select('Animation', actionOptions, actionOptions[2])
    const blendDuration = 0.5 /*number('Blend duration', 0.5, {
        range: true,
        min: 0,
        max: 2,
        step: 0.1,
    })*/

    React.useEffect(() => {
        actions[selectedAction]?.reset().fadeIn(blendDuration).play()
        return () => void actions[selectedAction]?.fadeOut(blendDuration)
    }, [actions, selectedAction, blendDuration])

    return null
}

function YBotModel(props: JSX.IntrinsicElements['group']) {
    const ybotRef = React.useRef<THREE.Group>(null)
    const {nodes, animations} = useGLTF('ybot.glb') as GLTFResult
    const [matcapBody] = useMatcapTexture('293534_B2BFC5_738289_8A9AA7', 1024)
    const [matcapJoints] = useMatcapTexture('3A2412_A78B5F_705434_836C47', 1024)

    return (
        <>
            <group ref={ybotRef} {...props} dispose={null}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
                    <primitive object={nodes.mixamorigHips}/>
                    <skinnedMesh geometry={nodes.YB_Body.geometry} skeleton={nodes.YB_Body.skeleton}>
                        <meshMatcapMaterial matcap={matcapBody} skinning/>
                    </skinnedMesh>
                    <skinnedMesh geometry={nodes.YB_Joints.geometry} skeleton={nodes.YB_Joints.skeleton}>
                        <meshMatcapMaterial matcap={matcapJoints} skinning/>
                    </skinnedMesh>
                </group>
            </group>

            <AnimationController ybotRef={ybotRef} animations={animations}/>
        </>
    )
}
const anims = [
    "Idle",
    "Jumping",
    "LookingAround",
    "Running",
    "Lifting",
    "Walking",
];
anims.forEach(anim => {
    // @ts-ignore
    useFBX.preload( new URL(`../../assets/fbx/${anim}.fbx`, import.meta.url).toString())
})

// useFBX.preload('ybot.glb')

function UseAnimationsScene() {
    return (
        <React.Suspense fallback={null}>
            <YBotModel position={[0, -1, 0]}/>
        </React.Suspense>
    )
}

export const UseAnimationsSt = () => <UseAnimationsScene/>
UseAnimationsSt.storyName = 'Default'