import React, {useEffect, useRef, useState} from "react";
import {NoiseGenerator} from "./util/noise";
import {Box2, Vector2, Vector3} from "three";
import {useFrame, useThree} from "@react-three/fiber";
import {QuadTree} from "./util/quadtree";
import {HeightGenerator} from "./util/HeightGenerator";
import {TerrainChunk} from "./TerrainChunk";

export const TerrainBlock = (
    {
        seed = 1,
        wireframe = true,
        height = 10,
        width = 10000,
        octaves = 4,
        persistence = 0.5,
        lacunarity = 2.0,
        scale = 500,
        exponentiation = 1.0,
        position = {x: 0, y: 0, z: 0},
        // offset = {x: 0, y: 0},
    }: any
) => {
    const ref = useRef<any>(null);
    const chunks = useRef<any>([]);
    // const builder = new TerrainChunkRebuilder();
    const [lastBuild, setLastBuild] = React.useState(0);
    const noise = new NoiseGenerator({
        seed,
        height,
        noiseType: 'simplex',
        octaves,
        persistence,
        lacunarity,
        scale,
        exponentiation
    });

    const CellIndex = (p: Vector3, cellSize: number): number[] => {
        const xp = p.x + cellSize * 0.5;
        const yp = p.z + cellSize * 0.5;
        const x = Math.floor(xp / cellSize);
        const z = Math.floor(yp / cellSize);
        return [x, z];
    }

    const [camIndex, setCamIndex] = useState([0, 0]);
    // let camIndex = [0,0];
    const [camera] = useThree((state) => [state.camera]);
    useFrame(({camera, controls}) => {

        const newIndex = CellIndex(camera.position, 100);

        if (newIndex[0] !== camIndex[0] || newIndex[1] !== camIndex[1]) {
            setCamIndex(CellIndex(camera.position, 100));

        }
        // camera

        // builder.Update()
        // if (!builder.Busy) {
        //     // UpdateVisibleChunks_Quadtree(camera);
        // }
    });


    // const [x, z] = camIndex


    useEffect(() => {
        UpdateVisibleChunks_Quadtree(camera.position);

    }, [camIndex, seed, height, width, persistence, lacunarity, scale, exponentiation, position]);


    const UpdateVisibleChunks_Quadtree = (position: Vector3) => {
        function _Key(c: { position: any; bounds?: Box2; dimensions: any; }) {
            return c.position[0] + '/' + c.position[1] + ' [' + c.dimensions[0] + ']';
        }

        const q = new QuadTree({
            min: new Vector2(-width, -width),
            max: new Vector2(width, width),
            minNodeSize: 10,
        });
        q.Insert(position);


        const children = q.GetChildren();

        for (const c of children) {
            // @ts-ignore
            c['noise'] = new HeightGenerator(noise, c.center, 100000, 100000 + 1)
        }

        // let newTerrainChunks: { [key: string]: any } = {};
        // const center = new Vector2();
        // const dimensions = new Vector2();
        // for (let c of children) {
        //     c.bounds.getCenter(center);
        //     c.bounds.getSize(dimensions);
        //
        //     const child = {
        //         position: [center.x, center.y],
        //         bounds: c.bounds,
        //         dimensions: [dimensions.x, dimensions.y],
        //     };
        //
        //     const k = _Key(child);
        //     newTerrainChunks[k] = child;
        // }
        //
        // const intersection = utils.DictIntersection(chunks.current, newTerrainChunks);
        // const difference = utils.DictDifference(newTerrainChunks, chunks.current);
        // const recycle = Object.values(utils.DictDifference(chunks.current, newTerrainChunks));
        //
        // builder._old.push(...recycle);
        //
        // newTerrainChunks = intersection;
        //
        // for (let k in difference) {
        //     const [xp, zp] = difference[k].position;
        //
        //     const offset = new Vector2(xp, zp);
        //     newTerrainChunks[k] = {
        //         position: [xp, zp],
        //         chunk: CreateTerrainChunk(offset, difference[k].dimensions[0]),
        //     };
        // }

        chunks.current = children;
        setLastBuild(Date.now());
    }
    //
    // const CreateTerrainChunk = (offset: Vector2, size: number) => {
    //     return builder.AllocateChunk({
    //         offset: new Vector3(offset.x, offset.y, 0),
    //         width: size,
    //         resolution: 256,
    //         heightGenerators: [new HeightGenerator(noise, offset, 100000, 100000 + 1)],
    //     })
    // }


    return <group ref={ref} position={position}>
        {chunks.current.map((chunk: any) => <TerrainChunk
            key={`${chunk.center.x}/${chunk.center.y} [${chunk.bounds.getSize(new Vector2()).x}]`}
            wireframe={wireframe}
            offset={chunk.center}
            width={chunk.size.x}
            resolution={64}
            noise={chunk.noise}
            build={lastBuild}
        />)}
    </group>
}