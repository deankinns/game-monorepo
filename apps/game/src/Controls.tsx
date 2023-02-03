import {OrbitControls} from "@react-three/drei";
import React from "react";
import {FirstPersonControls} from "becsy-fiber";

export const Controls = ({orbit}: { orbit: boolean }) => {

    return orbit ? <OrbitControls/> : <FirstPersonControls/>
}