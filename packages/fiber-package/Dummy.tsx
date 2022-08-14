import * as React from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ExtendedObject3D, Scene3D, THREE} from "enable3d";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {useControls} from "leva";
import {usePhysics} from "../enable3d-fiber-package";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import {useAnimations, useFBX, useGLTF} from "@react-three/drei";

const anims = [
    "Idle",
    "Jumping",
    "LookingAround",
    "Running",
    "Lifting",
    "Walking",
    "Falling Idle"
];

anims.forEach(anim => {
    useFBX.preload(new URL(`../../assets/fbx/${anim}.fbx`, import.meta.url).toString())
})

export const Dummy = forwardRef((props: any, returnRef) => {
    const group = useRef<THREE.Group>(new THREE.Group()) //<THREE.Group> doens't like it

    //@ts-ignore
    const objects = useFBX(anims.map((anim) => new URL(`../../assets/fbx/${anim}.fbx`, import.meta.url).toString())) as THREE.Group[];

    //@ts-ignore
    const o = SkeletonUtils.clone(objects[0])
    o.scale.set(0.02, 0.02, 0.02);
    o.position.y = -1.8;

    // group.current.add(o)
    useEffect(() => {
        group.current.add(o);
    },[objects])

    const {actions, ref} = useAnimations(
        (objects as THREE.Group[]).map(
            (object, index) => {
                const o = object.animations[0].clone()
                o.name = anims[index]
                return o
            }
        ),
        o
    );
    const [selectedAction, setSelectedAction] = useState("Idle");
    const [blendDuration, setBlendDuration] = React.useState(0.5);

    useImperativeHandle(returnRef, () => {
       return {selectedAction, setSelectedAction, actions, setBlendDuration}
    });

    const rangeRef = useRef(.5);

    // const controls = useControls(`Dummy${props.name}`, {
    //     animation: {
    //         value: "Idle",
    //         options: anims,
    //         onChange: (value) => {
    //             // rootObj.current.anims.play(value, rangeRef.current, true);
    //             setSelectedAction(value);
    //         },
    //     },
    //     range: {
    //         value: rangeRef.current,
    //         min: 0,
    //         max: 1,
    //         step: .1,
    //         onChange: (v) => {
    //             // rangeRef.current = v;
    //             setBlendDuration(v)
    //         },
    //     },
    // });

    React.useEffect(() => {
        actions[selectedAction]?.reset().fadeIn(blendDuration).play()
        return () => void actions[selectedAction]?.fadeOut(blendDuration)
    }, [actions, selectedAction, blendDuration])

    return (<>
            <primitive
                {...props}
                object={group.current}
                dispose={null}
            />
        </>
    );
});
type AnimationControllerProps = {
    ybotRef: React.MutableRefObject<THREE.Group | undefined | null>
    animations: THREE.AnimationClip[]
}

function AnimationController(props: AnimationControllerProps) {
    const {actions} = useAnimations(props.animations, props.ybotRef)

    // Storybook Knobs
    const actionOptions = Object.keys(actions)
    const selectedAction = actionOptions[2]// select('Animation', actionOptions, actionOptions[2])
    const blendDuration = 0.5 /* number('Blend duration', 0.5, {
        range: true,
          min: 0,
          max: 2,
          step: 0.1,
        })*/

    // useControls(`Dummy${props.id ?? rootObj.current.id}`, {
    //   animation: {
    //     value: "Idle",
    //     options: anims,
    //     onChange: (value) => {
    //       rootObj.current.anims.play(value, rangeRef.current, true);
    //     },
    //   },
    //   range: {
    //     value: rangeRef.current,
    //     min: 100,
    //     max: 1000,
    //     step: 1,
    //     onChange: (v) => {
    //       rangeRef.current = v;
    //     },
    //   },
    // });

    React.useEffect(() => {
        actions[selectedAction]?.reset().fadeIn(blendDuration).play()
        return () => void actions[selectedAction]?.fadeOut(blendDuration)
    }, [actions, selectedAction, blendDuration])

    return null
}