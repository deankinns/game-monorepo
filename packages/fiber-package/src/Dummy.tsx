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

// import '../../../assets'

anims.forEach(anim => {
    useFBX.preload(`fbx/${anim}.fbx`)
})

// eslint-disable-next-line react/display-name
export const Dummy = forwardRef((props: any, returnRef) => {
    const group = useRef<THREE.Group>(new THREE.Group()) //<THREE.Group> doens't like it

    const idle = useFBX(`fbx/${anims[0]}.fbx`);
    const jumping = useFBX(`fbx/${anims[1]}.fbx`);
    const lookingAround = useFBX(`fbx/${anims[2]}.fbx`);
    const running = useFBX(`fbx/${anims[3]}.fbx`);
    const lifting = useFBX(`fbx/${anims[4]}.fbx`);
    const walking = useFBX(`fbx/${anims[5]}.fbx`);
    const fallingIdle = useFBX(`fbx/${anims[6]}.fbx`);
    const rifleRun = useFBX(`fbx/${anims[7]}.fbx`);
    const rifleAimingIdle = useFBX(`fbx/${anims[8]}.fbx`);
    const ybot = useFBX(`fbx/${anims[9]}.fbx`);
    const reloading = useFBX(`fbx/${anims[10]}.fbx`);
    const bodyJabCross = useFBX(`fbx/${anims[11]}.fbx`);

    const objects = [
        idle,
        jumping,
        lookingAround,
        running,
        lifting,
        walking,
        fallingIdle,
        rifleRun,
        rifleAimingIdle,
        ybot,
        reloading,
        bodyJabCross
    ];


    // const objects = useFBX(anims.map((anim) => `fbx/${anim}.fbx`));

    const o = SkeletonUtils.clone(objects[0])
    o.scale.set(0.02, 0.02, 0.02);
    o.position.y = -1.8;



    useEffect(() => {

        // if (group.current.children.length > 0) return
        // group.current.clear();
        group.current.add(o);

        return () => {
            group.current?.remove(o);
        }
    }, [objects])

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
