import {useNavMesh} from "react-yuka/UseNavMesh";
import {Canvas, ThreeEvent} from "@react-three/fiber";
import React, {Suspense, useEffect, useRef} from "react";
import * as THREE from "three";
import {useDebug} from "../../../packages/fiber-package/src/UseDebug";
import {Debug, Physics} from "@react-three/rapier";
import {Robots} from "becsy-fiber/src/Robots";
import {GameEntities} from "./GameEntities";
import {HealthPacks} from "becsy-fiber/src/HealthPacks";
import {Weapons} from "becsy-fiber/src/Weapons";
import {BulletWrapper} from "becsy-fiber/src/BulletWrapper";
import {Terrain} from "./Terrain";
import {Obstacles} from "./Obstacles";
import {Paths} from "./Paths";
import {Targets} from "./Targets";
import {Sky} from "@react-three/drei";
import {Controls} from "./Controls";
import {FrameCount} from "./FrameCount";
import {useEcsStore, useSystem} from "react-becsy";
import {NavigationSystem} from "becsy-yuka-package";

import {createConvexRegionHelper, createCellSpaceHelper} from "three-yuka-package";

export const GameCanvas = ({orbit}: { orbit: boolean }) => {

    // const {world, player, render} = useContext(GameContext);

    // const world = useContext(GameWorldContext)
    // const world = useContext(ECSContext)
    // const world = useEcsStore().ecs;
    const {ecs, selectedEntity, selectEntity} = useEcsStore(state => ({
        ecs: state.ecs,
        selectedEntity: state.selectedEntity,
        selectEntity: state.selectEntity
    }));
    // const selectedEntity = useEcsStore(state => state.selectedEntity);
    // const render = useSystem(Render) as Render;

    // const render = useContext(RenderContext)
    // const player = useContext(PlayerContext);
    // const frame = useContext(FrameContext);

    // const entityManager = useContext(EntityManagerContext);

    // const navMesh = useContext(NavMeshContext);
    const navMesh = useNavMesh(state => state.navMesh);

    // const [debug, setDebug] = useState(false);
    // const [orbit, setOrbit] = useState(true);

    const navigationSystem = useSystem(NavigationSystem) as NavigationSystem;

    const goTo = (event: ThreeEvent<MouseEvent>) => {

        if (selectedEntity) {
            navigationSystem.goTo(selectedEntity, event.point);
            // ecs.enqueueAction((sys, e, data) => {
            //     if (!e) return;
            //     if (e.has(Target)) {
            //         e.remove(Target);
            //     }
            //     const target = sys.createEntity(PositionComponent, {
            //         position: data.position
            //     }, Selected, ToBeDeleted, {
            //         condition: (entity: Entity) => {
            //             const sel = entity.read(Selected).by;
            //             for (const by of sel) {
            //                 const byPos = Vector3ToThree(by.read(PositionComponent).position, new THREE.Vector3());
            //                 const ePos = Vector3ToThree(entity.read(PositionComponent).position, new THREE.Vector3());
            //                 // console.log(byPos.distanceTo(ePos));
            //                 if (byPos.distanceTo(ePos) < 10) {
            //                     by.remove(Target)
            //                 }
            //             }
            //
            //             return sel.length < 1;
            //         }
            //     });
            //     e.add(Target, {value: target});
            //
            // }, selectedEntity, {position: event.point.toArray()});
        }

        // if (player.player?.has(Target)) {
        //     ecs?.enqueueAction((sys, e, data: { position: { x: number, y: number, z: number } & [number, number, number] }) => {
        //         const selected = e?.read(Target).value as Entity;
        //         // console.log(selected.read(Selected));
        //
        //         if (selected?.has(Target)) {
        //             selected.remove(Target);
        //         }
        //         const target = sys.createEntity(PositionComponent, {
        //             position: data.position
        //         }, Selected, ToBeDeleted, {
        //             condition: (entity: Entity) => {
        //                 const sel = entity.read(Selected).by;
        //                 for (const by of sel) {
        //                     const byPos = Vector3ToThree(by.read(PositionComponent).position, new THREE.Vector3());
        //                     const ePos = Vector3ToThree(entity.read(PositionComponent).position, new THREE.Vector3());
        //                     // console.log(byPos.distanceTo(ePos));
        //                     if (byPos.distanceTo(ePos) < 10) {
        //                         by.remove(Target)
        //                     }
        //                 }
        //
        //                 return sel.length < 1;
        //             }
        //         });
        //         selected?.add(Target, {value: target});
        //         // } else {
        //         //     const target = selected.read(Target).value;
        //         //     target.write(PositionComponent).position = data.position;
        //         // }
        //     }, player.player, {position: event.point.toArray()});
        // }

        event.stopPropagation();
    }

    const deselect = (event: ThreeEvent<MouseEvent>) => {
        selectEntity(null);
        event.stopPropagation()
        // if (player.player?.has(Target)) {
        //     player.player?.remove(Target)
        // }
    }

    const regionHelper = useRef<THREE.Object3D>(null!);
    const indexHelper = useRef<THREE.Object3D>(null!);
    const scene = useRef<THREE.Scene | undefined>(undefined);
    // const spatialIndex = useRef<CellSpacePartitioning>(new CellSpacePartitioning(1000, 100, 1000, 100, 10, 100));

    const debug = useDebug(state => state.debug);

    useEffect(() => {
        scene.current?.remove(regionHelper.current);
        scene.current?.remove(indexHelper.current);
        if (navMesh && debug) {


            // console.log('update')
            regionHelper.current = createConvexRegionHelper(navMesh);
            scene.current?.add(regionHelper.current);

            if (navMesh.spatialIndex) {

                indexHelper.current = createCellSpaceHelper(navMesh.spatialIndex);
                scene.current?.add(indexHelper.current);
            }

        }

    }, [ecs, debug, navMesh])
    // const foo = ({children}) => <>{children}</>

    // const firstPersonRef = useRef<any>(null!);

    // useFrame(() => {
    //     if (player.player?.has(Target)) {
    //         const position = player.player.read(Target).value.read(PositionComponent).position;
    //
    //         firstPersonRef.current?.position.set(position.x, position.y, position.z);
    //     }
    //
    //
    // })

    // const entities = useEcsStore(state => state.entities);

    // const test = useSystem(TestSystem) as TestSystem;

    // const healthPacks = useSystem(HealthPackSystem) as HealthPackSystem;
    // const weapons = useSystem(WeaponSystem) as WeaponSystem;

    return <Canvas
        // frameloop="demand"
        onCreated={state => scene.current = state.scene}
        camera={{near: .1, far: 999999, position: [100, 100, 100]}}
        onAnimationStart={(e) => {
            console.log('start', e)
        }}
    >
        {/*<FrameContext.Provider value={frame}>*/}
        {/*<ECSContext.Provider value={world}>*/}

        {/*<RenderContext.Provider value={render}>*/}
        {/*<NavMeshContext.Provider value={navMesh}>*/}
        {/*<PlayerContext.Provider value={player}>*/}
        <Physics>
            {debug ? <Debug/> : null}

            {/*{<EntityRenderList/>}*/}
            {/*{test?.render()}*/}
            <Robots/>
            <GameEntities/>
            {/*{healthPacks?.render()}*/}
            <HealthPacks/>
            <Weapons/>
            {/*{weapons?.render()}*/}
            <BulletWrapper/>
            <Terrain
                actions={{
                    deselect, goTo
                }}
            />
            <Obstacles/>
        </Physics>
        <Paths/>
        <Targets/>


        {/*</PlayerContext.Provider>*/}
        {/*</NavMeshContext.Provider>*/}
        {/*</RenderContext.Provider>*/}
        {/*</ECSContext.Provider>*/}
        {/*</FrameContext.Provider>*/}
        <Suspense>
            <Sky/>
            {/*<PlayerContext.Provider value={player}>*/}
            <Controls orbit={orbit}/>
            {/*</PlayerContext.Provider>*/}
            <ambientLight intensity={0.5}/>
            <directionalLight position={[0, 0, 5]} color="teal"/>
        </Suspense>
        <FrameCount/>
    </Canvas>
}