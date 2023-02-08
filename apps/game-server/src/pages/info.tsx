import * as React from "react";
import {Box, OrbitControls} from '@react-three/drei'

export default function Info() {
    return <p>Info</p>
}

Info.canvas = () => <>
    <OrbitControls/>
    <Box/>
</>

Info.hideWorld = true