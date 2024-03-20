import {TerrainChunkManager} from 'terrain-generator-package';
import React, {useEffect, useRef} from "react";
import {useEcsStore, useEntity, useSystem, RefComponent} from "react-becsy";
import {NavigationSystem, NavMeshComponent} from "becsy-yuka-package";
import {ThreeEvent, useThree} from "@react-three/fiber";
import {NavMesh, Polygon} from "yuka";
import * as THREE from "three";
import {useNavMesh} from "react-yuka";
import {Vector3ToYuka} from "yuka-package";
import {createConvexRegionHelper} from "three-yuka-package";
import {useDebug} from "fiber-package";
import {Object3DComponent} from "becsy-fiber";

const DebugTerrain = () => {
    // const {scene} = useThree()
    // const regionHelper = useRef<THREE.Object3D>(null!);
    // const navMesh = useNavMesh(state => state.navMesh);
    // const [debug] = useDebug(state => [state.debug]);
    //
    //
    // useEffect(() => {
    //     if (navMesh && debug) {
    //         regionHelper.current = createConvexRegionHelper(navMesh);
    //         scene.add(regionHelper.current);
    //     } else {
    //         scene.remove(regionHelper.current);
    //     }
    //
    //     // return () => scene.remove(regionHelper.current);
    // }, [navMesh, debug])
    //
    return null

}

const Terrain = ({seed}: any) => {
    const ref = useRef<any>(null!);

    const [selectEntity, selectedEntity] = useEcsStore(state => ([state.selectEntity, state.selectedEntity]));
    const navigationSystem = useSystem(NavigationSystem) as NavigationSystem;

    // const entity = useEntity([
    //     NavMeshComponent, {navMesh: new NavMesh()},
    //     RefComponent, {ref: ref}
    // ]);


    // const e = useEntity();
    //
    // const [navMesh, spatialIndex] = useNavMesh(state => [state.navMesh, state.spatialIndex]);
    // const running = useRef(false);

    // const generate = (navMesh: NavMesh, polygons: Polygon[]) => {
    //
    //     navMesh = navMesh.fromPolygons(polygons)
    //     navMesh.spatialIndex = spatialIndex
    //     navMesh.updateSpatialIndex()
    //     console.log(navMesh)
    // }
    //
    // useEffect(() => {
    //     // console.log(nav.navMesh, ref.current);
    //
    //     if (navMesh && ref.current && !running.current) {
    //         running.current = true;
    //
    //         // const modifer = new SimplifyModifier();
    //         const polygons = ref.current.groupRef.current.children.map((o: THREE.Object3D) => {
    //             // child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
    //             const child = o.children[0] as THREE.Mesh;
    //
    //             // const y = child.parent?.position.y
    //             const polygon = new Polygon();
    //
    //             const pos = child.geometry.attributes.position;
    //
    //             const v1 = new THREE.Vector3();
    //             v1.fromBufferAttribute(pos, 0);
    //             child.localToWorld(v1);
    //
    //             const v2 = new THREE.Vector3();
    //             // @ts-ignore
    //             v2.fromBufferAttribute(pos, child.geometry.parameters.widthSegments);
    //             child.localToWorld(v2);
    //
    //             const v3 = new THREE.Vector3();
    //             // @ts-ignore
    //             v3.fromBufferAttribute(pos, ((child.geometry.parameters.widthSegments + 1) * (child.geometry.parameters.heightSegments + 1)) - child.geometry.parameters.widthSegments - 1);
    //             child.localToWorld(v3);
    //
    //             const v4 = new THREE.Vector3();
    //             // @ts-ignore
    //             v4.fromBufferAttribute(pos, ((child.geometry.parameters.widthSegments + 1) * (child.geometry.parameters.heightSegments + 1)) - 1);
    //             child.localToWorld(v4);
    //
    //             // for (let i = 0; i < pos.count; i++) {
    //             //
    //             // }
    //             const a3 = [Vector3ToYuka(v4), Vector3ToYuka(v2), Vector3ToYuka(v1), Vector3ToYuka(v3)]
    //
    //
    //             // @ts-ignore
    //             polygon.fromContour(a3);
    //             // return [polygons]
    //             return polygon;
    //         })
    //
    //
    //         generate(navMesh, polygons)
    //
    //         running.current = false;
    //     }
    // }, [navMesh, ref.current])

    return (<>
        <DebugTerrain />
        <TerrainChunkManager
        ref={ref}
        seed={seed}
        onClick={(e: ThreeEvent<MouseEvent>) => {

            switch (e.button) {
                case 0:
                    selectEntity(null);
                    break;
                case 2:
                    if (selectedEntity) {
                        navigationSystem.goTo(selectedEntity, e.point);
                    }
                    break
            }

            e.stopPropagation()
        }}
        onContextMenu={(e: ThreeEvent<MouseEvent>) => {
            if (selectedEntity) {
                navigationSystem.goTo(selectedEntity, e.point);
            }
            e.stopPropagation();
        }}
    /></>)

}

export default Terrain