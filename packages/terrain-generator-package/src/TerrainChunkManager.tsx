import React, {forwardRef, useImperativeHandle, useState} from "react";
import {button, useControls} from "leva";
import TerrainBlock from "./TerrainBlock";

export const TerrainChunkManager = forwardRef(({onClick, onContextMenu}: any, returnRef) => {
    const [seed, setSeed] = useState(Date.now());
    const ref = React.useRef<any>(null);
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
        height: {value: 150, max: 1000, min: 0},
        width: {value: 100, max: 1000000, min: 100},
        octaves: {value: 10, max: 20, min: 1},
        persistence: {value: 0.8, max: 1, min: 0},
        lacunarity: {value: 1.5, max: 4, min: 0.01},
        scale: {value: 500, max: 10000, min: 1},
        exponentiation: {value: 4, max: 10, min: 0.01},
        position: [0, 0, 0],
        offset: {x: 0, y: 0},
    })

    useImperativeHandle(returnRef, () => ref.current)
    // useEffect(() => {
    //     setTimeout(()=> setSeed(Date.now()), 1);
    // }, [seed]);

    return <TerrainBlock
        ref={ref}
        onClick={onClick}
        onContextMenu={onContextMenu}
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
});

TerrainChunkManager.displayName = 'TerrainChunkManager';

// export TerrainChunkManager;