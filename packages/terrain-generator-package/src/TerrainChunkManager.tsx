import React, {useState} from "react";
import {button, useControls} from "leva";
import {TerrainBlock} from "./TerrainBlock";

export const TerrainChunkManager = () => {
    const [seed, setSeed] = useState(Date.now());

    const {
        wireframe,
        height,
        width,
        octaves,
        persistence,
        lacunarity,
        scale,
        exponentiation,
        position,
        offset
    } = useControls("Terrain", {
        generate: button(() => setSeed(Date.now())),
        wireframe: false,
        height: {value: 500, max: 1000, min: 0},
        width: {value: 10000, max: 1000000, min: 100},
        octaves: {value: 10, max: 20, min: 1},
        persistence: {value: 0.8, max: 1, min: 0},
        lacunarity: {value: 2.0, max: 4, min: 0.01},
        scale: {value: 500, max: 10000, min: 1},
        exponentiation: {value: 4, max: 10, min: 0.01},
        position: [0, -20, 0],
        offset: {x: 0, y: 0},
    })

    // useEffect(() => {
    //     setTimeout(()=> setSeed(Date.now()), 1);
    // }, [seed]);

    return <TerrainBlock
        seed={seed}
        wireframe={wireframe}
        height={height}
        width={width}
        octaves={octaves}
        persistence={persistence}
        lacunarity={lacunarity}
        scale={scale}
        exponentiation={exponentiation}
        position={position}
        offset={offset}
    />
}