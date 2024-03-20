import {useNavMesh} from "../../../packages/react-yuka/UseNavMesh";
import React, {useEffect, useRef} from "react";
import {NavMesh, Polygon} from "yuka";
import * as THREE from "three";
import {Vector3ToYuka} from "yuka-package";
import {TerrainChunkManager} from 'terrain-generator-package'

import {createConvexRegionHelper} from "three-yuka-package";

export const Terrain = ({actions: {goTo, deselect}}: any) => {
    // const nav = useContext(NavMeshContext);
    // const entityManager = useContext(EntityManagerContext);
    const [navMesh, spatialIndex] = useNavMesh(state => [state.navMesh, state.spatialIndex]);

    const ref = useRef<any>(null!);
    const running = useRef(false);

    const generate = (navMesh: NavMesh, polygons: Polygon[]) => {
        // if (!running.current) {
        //     running.current = true;
        navMesh = navMesh.fromPolygons(polygons)
        navMesh.spatialIndex = spatialIndex
        navMesh.updateSpatialIndex()

        console.log(navMesh)
        //     running.current = false;
        // }


        //
        // nav.navMesh.updateSpatialIndex()

        // if (entityManager.pathPlanner) {
        //     entityManager.pathPlanner.navMesh = nav.navMesh
        // }

        // nav.;
    }

    useEffect(() => {
        // console.log(nav.navMesh, ref.current);

        if (navMesh && ref.current && !running.current) {
            running.current = true;

            // const modifer = new SimplifyModifier();
            const polygons = ref.current.groupRef.current.children.map((o: THREE.Object3D) => {
                // child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
                const child = o.children[0] as THREE.Mesh;

                // const y = child.parent?.position.y
                const polygon = new Polygon();
                // // const x = child.children[0].geometry.boundingSphere.center.x;
                // // const y = 0
                // // const z = child.position.z;
                // const {x, z} = child.position;
                // const noise = ref.current.noise
                //
                // child.geometry.computeBoundingBox();
                // if (!child.geometry.boundingBox) return;
                // const half = (child.geometry.boundingBox.max.x - child.geometry.boundingBox.min.x) / 2;

                // const index = child.geometry.getIndex();


                // const simplified = child.clone();
                // const count = Math.floor( child.geometry.attributes.position.count - (5 * 3) );
                // simplified.geometry = modifer.modify(simplified.geometry, count);
                //
                // let gp = simplified.geometry.attributes.position;
                // let wPos = [];
                // for(let i = 0;i < gp.count; i++){
                //     let p = new THREE.Vector3().fromBufferAttribute(gp, i); // set p from `position`
                //     simplified.localToWorld(p); // p has wordl coords
                //     wPos.push(new Vector3(p.x,p.y,p.z));
                // }

                // const a1 = GenerateHeight(new THREE.Vector3(x + half, 0, z + half), noise, {x: 0, y: 0});

                // const p1 = child.userData.points[0]
                // const p2 = child.userData.points[child.userData.resolution]
                // const p3 = child.userData.points[child.userData.points.length - child.userData.resolution - 1]
                // const p4 = child.userData.points[child.userData.points.length - 1]

                // const a1 = [
                //     new Vector3(x + half, noise.Get(x + half, z + half) + y, z + half),
                //     new Vector3(x + half, noise.Get(x + half, z - half) + y, z - half),
                //     new Vector3(x - half, noise.Get(x - half, z - half) + y, z - half),
                //     new Vector3(x - half, noise.Get(x - half, z + half) + y, z + half),
                // ];
                // const a2 = [
                //     new Vector3(x + half, p4, z + half),
                //     new Vector3(x + half, p1, z - half),
                //     new Vector3(x - half, p2, z - half),
                //     new Vector3(x - half, p3, z + half),
                // ];
                // const a2 = [
                //     new Vector3(x + half, GenerateHeight(new Vector3(x + half, z + half,0), noise) + y, z + half),
                //     new Vector3(x + half, GenerateHeight(new Vector3(x + half, z - half,0), noise) + y, z - half),
                //     new Vector3(x - half, GenerateHeight(new Vector3(x - half, z - half,0), noise) + y, z - half),
                //     new Vector3(x - half, GenerateHeight(new Vector3(x - half, z + half,0), noise) + y, z + half),
                // ];
                const pos = child.geometry.attributes.position;

                const v1 = new THREE.Vector3();
                v1.fromBufferAttribute(pos, 0);
                child.localToWorld(v1);

                const v2 = new THREE.Vector3();
                // @ts-ignore
                v2.fromBufferAttribute(pos, child.geometry.parameters.widthSegments);
                child.localToWorld(v2);

                const v3 = new THREE.Vector3();
                // @ts-ignore
                v3.fromBufferAttribute(pos, ((child.geometry.parameters.widthSegments + 1) * (child.geometry.parameters.heightSegments + 1)) - child.geometry.parameters.widthSegments - 1);
                child.localToWorld(v3);

                const v4 = new THREE.Vector3();
                // @ts-ignore
                v4.fromBufferAttribute(pos, ((child.geometry.parameters.widthSegments + 1) * (child.geometry.parameters.heightSegments + 1)) - 1);
                child.localToWorld(v4);

                // for (let i = 0; i < pos.count; i++) {
                //
                // }
                const a3 = [Vector3ToYuka(v4), Vector3ToYuka(v2), Vector3ToYuka(v1), Vector3ToYuka(v3)]


                // @ts-ignore
                polygon.fromContour(a3);
                // return [polygons]
                return polygon;
            })
            //
            // const polygons: Polygon[] = [];
            // const modifer = new SimplifyModifier();
            //
            // for (const child of ref.current.groupRef.current.children) {
            //     const simplified = child.clone();
            //     const count = Math.floor( child.geometry.attributes.position.count - (4 * 3) );
            //     simplified.geometry = modifer.modify(simplified.geometry, count);
            //     const index = simplified.geometry.getIndex();
            //     for (let i = 0; i < index.count; i += 3) {
            //
            //         const a = index.getX(i);
            //         const b = index.getX(i + 1);
            //         const c = index.getX(i + 2);
            //         const polygon = new Polygon();
            //         // polygon
            //         polygon.fromContour([
            //             new Vector3(
            //                 index.getX(i),
            //                 index.getY(i),
            //                 index.getZ(i)
            //             ),
            //             new Vector3(
            //                 index.getX(i +1),
            //                 index.getY(i+1),
            //                 index.getZ(i+1)
            //             ),
            //             new Vector3(
            //                 index.getX(i+2),
            //                 index.getY(i+2),
            //                 index.getZ(i+2)
            //             ),
            //         ])
            //         polygons.push(polygon)
            //
            //
            //         // points.push(new Vector3(a,b,c))
            //
            //     }
            // }
            // nav.navMesh.

            generate(navMesh, polygons)

            running.current = false;
        }
    })


    return <TerrainChunkManager
        ref={ref}
        onClick={deselect}
        onContextMenu={goTo}
    />
}