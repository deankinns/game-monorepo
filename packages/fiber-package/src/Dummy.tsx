import * as React from "react";
import * as THREE from "three";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";

import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import {useAnimations, useFBX, useGLTF} from "@react-three/drei";

const anims = [
    "Idle",
    "Jumping",
    "LookingAround",
    "Running",
    "Lifting",
    "Walking",
    "Falling Idle",
    "rifle/Rifle Run",
    "rifle/rifle aiming idle",
    "rifle/ybot",
    "rifle/reloading",
    "BodyJabCross"
];

anims.forEach(anim => {
    useFBX.preload(new URL(`../../../assets/fbx/${anim}.fbx`, import.meta.url).toString())
})

// eslint-disable-next-line react/display-name
export const Dummy = forwardRef((props: any, returnRef) => {
    const group = useRef<THREE.Group>(new THREE.Group()) //<THREE.Group> doens't like it

    //@ts-ignore
    const objects = useFBX(anims.map((anim) => new URL(`../../../assets/fbx/${anim}.fbx`, import.meta.url).toString())) as THREE.Group[];

    //@ts-ignore
    const o = SkeletonUtils.clone(objects[0])
    o.scale.set(0.02, 0.02, 0.02);
    o.position.y = -1.8;

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
       return {selectedAction, setSelectedAction, actions, setBlendDuration, ref, group: group.current}
    });

    React.useEffect(() => {
        actions[selectedAction]?.reset().fadeIn(blendDuration).play()
        return () => void actions[selectedAction]?.fadeOut(blendDuration)
    }, [actions, selectedAction, blendDuration])

    return (
            <primitive
                {...props}
                object={group.current}
                dispose={null}
            />
    );
});
