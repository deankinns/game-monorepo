import * as React from "react";
import {createRoot} from "react-dom/client";
import {Canvas, ThreeEvent, useFrame, useThree} from "@react-three/fiber";
import {
    OrbitControls,
    FlyControls,
    Sky,
    Stars,
    // FirstPersonControls,
    PointerLockControls,
    Box, PointerLockControlsProps,
} from "@react-three/drei";

import "ui/w3.css";
import {useEffect, useState} from "react";
// @ts-ignore
import DungeonGenerator, {defaultProperties}  from "3d-dungeon-generator";

const App = () => {
    const [maze, setMaze] = useState();
    const [rooms, setRooms] = useState<{location: any, size: any}[]>([]);
    const generator = new DungeonGenerator();
    const [gen,setGen] = useState(0);

    useEffect(() => {

        const seed = Date.now() * Math.random();
        defaultProperties.seed = `hello seed${seed}`
        defaultProperties.roomCount = 5;
        defaultProperties.predefined = []
        defaultProperties.maxTries = 5
        defaultProperties.levels = 1

        const dungeon = generator.generate({
            // seed: `hello seed${seed}`,
            // roomCount: gen,
        });
        setRooms(dungeon.rooms)

        console.log(seed, dungeon);
    }, [gen]);

    return <div>Hello World!
        <button onClick={() => setGen(gen+1)}>generate</button>
        <Canvas style={{position: "absolute", height: '100vh'}}>
            <OrbitControls />
            <Sky />
            {/*<Box />*/}
            {rooms && rooms.map((room, i) => <Box args={[room.size.x, room.size.y, room.size.z]} key={i} position={[room.location.x, room.location.y, room.location.z]} />)}
        </Canvas>

    </div>;
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);