import React, {Suspense, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    Collectable,
    GameWorld,
    Healing,
    Health, Inventory,
    Packed,
    PositionComponent,
    Render,
    Selected,
    State,
    Target,
    ToBeDeleted,
    Weapon, HealthSystem
} from "becsy-package";
import {EntityListPanel, EntityPanel} from "becsy-ui";
import {Entity, System, World, system, component, field} from "@lastolivegames/becsy";

import "becsy-package/systems";
import "becsy-fiber/systems";
import "becsy-yuka-package/systems";

import {
    BrainComponent,
    EntityManagerSystem,
    GameEntityComponent,
    MemoryComponent,
    NavMeshComponent,
    PathComponent,
    PathRequestComponent,
    VehicleEntityComponent,
    WeaponSystem,
    NavigationSystem,
    GameEntity,
    CombatSystem,
    VisionComponent,
    PerceptionSystem,
    Obstacle
} from "becsy-yuka-package";

import {SimplifyModifier} from 'three-stdlib'

import {EntityList, EntityManagerWrapper} from "yuka-ui";

import {EntityManager, NavMesh, Polygon, Vector3, CellSpacePartitioning} from "yuka";
import Stats from "three/examples/jsm/libs/stats.module";
import {Canvas, ThreeEvent, useFrame} from "@react-three/fiber";
import {Box, Line, OrbitControls, Sky,} from "@react-three/drei";

import {Debug, Physics, RigidBody, RigidBodyApi,} from "@react-three/rapier";

import {componentRegistry, PathPlanner, Vector3ToYuka} from "yuka-package";

import {createConvexRegionHelper, createCellSpaceHelper} from "three-yuka-package";

import * as THREE from "three";
import {Vector3ToThree, QuaternionToThree} from "three-package"

import {HealthPack, Robot, PlayerContext, useRigidBodyComponent, useObject3dComponent} from 'becsy-fiber';
import {Rifle, Bullet, BulletSystem} from "./Rifle";
import {FirstPersonControls} from "becsy-fiber";
import {Toolbar} from "./Toolbar";


import {TerrainChunkManager, GenerateHeight} from "terrain-generator-package";

import {useSystem, useEcsStore, useSystemEntities, Entity as EntityComponent} from "react-becsy";
import create from "zustand";

componentRegistry.Health = Health;
componentRegistry.Packed = Packed;
componentRegistry.Healing = Healing;
componentRegistry.BrainComponent = BrainComponent;
componentRegistry.Collectable = Collectable;
componentRegistry.Target = Target;
componentRegistry.PathRequestComponent = PathRequestComponent;
componentRegistry.PathComponent = PathComponent;
componentRegistry.MemoryComponent = MemoryComponent;
componentRegistry.State = State;
componentRegistry.Weapon = Weapon;
componentRegistry.PositionComponent = PositionComponent;
componentRegistry.Selected = Selected;
componentRegistry.ToBeDeleted = ToBeDeleted;
componentRegistry.Render = Render;
componentRegistry.VehicleEntityComponent = VehicleEntityComponent;
componentRegistry.NavMeshComponent = NavMeshComponent;
componentRegistry.Inventory = Inventory;
componentRegistry.GameEntityComponent = GameEntityComponent;

// export const PlayerContext = React.createContext<{ player: Entity | undefined, setPlayer: any }>(null!);
// export const FrameContext = React.createContext<{ frame: number, setFrame: any }>({frame: 0, setFrame: null});
// export const NavMeshContext = React.createContext<{ navMesh: NavMesh | undefined, setNavMesh: any }>(null!);
// // export const EntityManagerContext = React.createContext<EntityManager>(null!);
//
// type GameContext = {
//     player: Entity,
//     setPlayer: any,
//     render: Render,
//     setRender: any,
//     world: GameWorld,
//     setWorld: any,
// }

// const GameContext = React.createContext<GameContext>(null!);

// const thing = React.createRef<GameWorld>()

const useDebug = create<{
    debug: boolean,
    setDebug: (debug: boolean) => void
    toggleDebug: () => void
}>((set, get) => ({
    debug: false,
    setDebug: (debug: boolean) => set({debug}),
    toggleDebug: () => set({debug: !get().debug})
}));

interface NavMeshState {
    navMesh: NavMesh,
    spatialIndex: CellSpacePartitioning,
}

const useNavMesh = create<NavMeshState>((get, set) => ({
    navMesh: new NavMesh(),
    spatialIndex: new CellSpacePartitioning(1000, 1000, 1000, 10, 10, 10),
}))

let loaded = false;

export const GameWindow = () => {

    const [player, setPlayer] = React.useState<Entity>(null!);
    const navMesh = useNavMesh(state => state.navMesh);
    // const [navMesh, setNavMesh] = React.useState<NavMesh>(null!);

    // const [show, setShow] = React.useState(false);
    // const [frame, setFrame] = React.useState(0);


    // const [debug, setDebug] = React.useState(false);
    const [orbit, setOrbit] = React.useState(true);
    // const managerRef = useRef<EntityManager>(null!);

    // const renderRef = useRef<Render>(null!);
    // const [render, setRender] = React.useState<any>(null!);

    // const ecsStore = useEcsStore();
    const create = useEcsStore((state) => state.create);
    // const selectedEntity = useEcsStore((state) => state.selectedEntity);
    // const entities = useEcsStore((state) => state.entities.length);

    // const render = useSystem(Render) as Render

    // const ECS = useECS([
    //     Render, {reference: renderRef},
    //     EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
    // ], (world: World) => {
    //     setRender(renderRef.current)
    // });

    // const EcsStore = useEcsStore();
    useEffect(() => {
        if (loaded) return;
        loaded = true;
        create([
            // Render, {reference: renderRef},
            // EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
        ], (world: World) => {
            world.build((s) => {
                setPlayer(s.createEntity().hold());
                // const nav = new NavMesh();

                // nav.fromPolygons([
                //     new Polygon().fromContour([
                //         new Vector3(-50, 0, -50),
                //         new Vector3(-50, 0, 50),
                //         new Vector3(50, 0, 50),
                //         new Vector3(50, 0, -50),
                //     ]),
                // ]);
                // setNavMesh(nav);
                s.createEntity(NavMeshComponent, {navMesh});
                // setFrame(s.time);

                // @ts-ignore
                // managerRef.current.pathPlanner = new PathPlanner(nav)
                // setRender(renderRef.current)
            })
        })
    }, [create, navMesh]);

    const toggleDebug = useDebug(state => state.toggleDebug);

    // useEffect(() => {
    //     const ECS = ecsStore.ecs;
    //     if ( ECS.world) {
    //         ECS.world.build((s) => {
    //             setPlayer(s.createEntity().hold());
    //             const nav = new NavMesh();
    //
    //             // nav.fromPolygons([
    //             //     new Polygon().fromContour([
    //             //         new Vector3(-50, 0, -50),
    //             //         new Vector3(-50, 0, 50),
    //             //         new Vector3(50, 0, 50),
    //             //         new Vector3(50, 0, -50),
    //             //     ]),
    //             // ]);
    //             setNavMesh(nav);
    //             s.createEntity(NavMeshComponent, {navMesh: nav});
    //             setFrame(s.time);
    //
    //             // @ts-ignore
    //             // managerRef.current.pathPlanner = new PathPlanner(nav)
    //             // setRender(renderRef.current)
    //         })
    //     }
    // }, [    ecsStore.ecs.world]);


    return (
        <>

            {/*<Suspense fallback={null}>*/}
            {/*<FrameContext.Provider value={{frame, setFrame}}>*/}
            {/*<RenderContext.Provider value={render}>*/}
            {/*<NavMeshContext.Provider value={{navMesh, setNavMesh}}>*/}
            <PlayerContext.Provider value={{player, setPlayer}}>
                <div className={"w3-display-container"}>
                    <div id={`gameWindow`}>
                        {/*<NavMeshContext.Provider value={{navMesh, setNavMesh}}>*/}
                        {/*<EntityManagerContext.Provider value={managerRef.current}>*/}
                        <GameCanvas orbit={orbit}/>
                        {/*</EntityManagerContext.Provider>*/}
                        {/*</NavMeshContext.Provider>*/}
                    </div>
                    {/*{show ? <div className={"w3-display-middle"}>*/}
                    {/*    <EntityComponent>*/}
                    {/*        <p>hello</p>*/}
                    {/*    </EntityComponent>*/}
                    {/*</div> : null}*/}
                    <Toolbar
                        actions={[
                            {name: 'Debug', action: () => toggleDebug()},
                            {name: orbit ? 'Orbit' : 'First Person', action: () => setOrbit(!orbit)},
                        ]}/>


                    <SelectedEntity/>


                    <SidePanel/>

                </div>
            </PlayerContext.Provider>
            {/*<EntityManagerWrapper manager={entityManager}>*/}
            {/*    <EntityList/>*/}
            {/*</EntityManagerWrapper>*/}
            {/*</NavMeshContext.Provider>*/}
            {/*</RenderContext.Provider>*/}
            {/*</FrameContext.Provider>*/}
            {/*</Suspense>*/}
        </>
        // <ECS.Provider>
        //
        // </ECS.Provider>
    );
    // }
}

const SelectedEntity = () => {
    const selectedEntity = useEcsStore((state) => state.selectedEntity);

    return <div
        style={{
            position: "absolute",
            bottom: 0,
            maxHeight: "100vh",
            overflow: "auto",
        }}
    >
        {selectedEntity ? <EntityPanel
            entity={selectedEntity}
        /> : null}
        {/*<p style={{paddingLeft: '20vw'}}>{entities}</p>*/}
    </div>
}

const SidePanel = () => {
    const [show, setShow] = useState(false);

    return <div
        className={"w3-container w3-light-grey"}
        style={{
            top: 0,
            right: 0,
            position: "absolute",
            height: "100vh",
            overflow: "auto",
        }}
    >
        <button onClick={() => setShow(!show)}>
            {show ? ">>" : "<<"}
        </button>
        {show ? <EntityListPanel/> : null}
    </div>
}

const GameCanvas = ({orbit}: { orbit: boolean }) => {

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
        camera={{near: .1, far: 100000, position: [100, 100, 100]}}
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

const Controls = ({orbit}: { orbit: boolean }) => {

    return orbit ? <OrbitControls/> : <FirstPersonControls/>
}

const Terrain = ({actions: {goTo, deselect}}: any) => {
    // const nav = useContext(NavMeshContext);
    // const entityManager = useContext(EntityManagerContext);
    const [navMesh, spatialIndex] = useNavMesh(state => [state.navMesh, state.spatialIndex]);

    const ref = useRef<any>(null!);
    const running = useRef(false);

    const generate = (navMesh: NavMesh, polygons: Polygon[]) => {
        // if (!running.current) {
        //     running.current = true;
        navMesh.fromPolygons(polygons)
        navMesh.spatialIndex = spatialIndex
        navMesh.updateSpatialIndex()
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
//
// export const EntityRenderList = () => {
//
//     // const ecs = useEcsStore(state => state.ecs)
//     // const entities = useEcsStore(state => state.entities)
//     const selectEntity = useEcsStore(state => state.selectEntity)
//     const update = useEcsStore(state => state.update)
//
//     // const count = useEcsStore(state => state.entities.length)
//     // const { ecs, entities } = useEcsStore(state => {state.ecs, state.entities})
//     // const render = useContext(RenderContext);
//     // const ecsStore = useEcsStore();
//     // const world = useContext(GameWorldContext);
//     // const world = useContext(ECSContext);
//     // const world = useEcsStore().ecs
//     // const player = useContext(PlayerContext);
//
//     // const {frame, setFrame} = useContext(FrameContext);
//
//     const render = useSystem(Render) as Render;
//     const entities = render.items.current
//
//     const select = (e: Entity) => {
//         // const world = ecsStore.ecs
//
//         selectEntity(e)
//         return true
//
//         // ecs?.enqueueAction((sys, entity, data) => {
//         //     if (data?.player?.has(Target)) {
//         //         data?.player?.remove(Target);
//         //     }
//         //     if (!entity?.has(Selected)) {
//         //         entity?.add(Selected);
//         //     }
//         //     data?.player?.add(Target, {value: entity});
//         //     // setFrame(sys.time);
//         // }, e, {player: player?.player});
//     };
//     //
//     // useEffect(() => {
//     //
//     // }, [player])
//
//     // useEffect(() => {
//     //     // console.log('render', render, world);
//     //     if (render) {
//     //         // render.cb = (system) => {
//     //         //     setFrame(system.time);
//     //         // }
//     //         render.cblist.set(EntityRenderList, (system: System) => {
//     //             // setFrame(system.time);
//     //         })
//     //     }
//     //     // setFrame(1);
//     //     return () => {
//     //         render?.cblist.delete(EntityRenderList);
//     //     }
//     // }, [render]);
//
//     // const items = useEcsStore().entities
//     // const ecsStore = useEcsStore();
//
//     // const renderSystem = useMemo(()=> ecsStore.systems.find(s => s instanceof Render), []);
//     //
//     // const items = (renderSystem as Render)?.items.current
//     //
//     // newQuery?.current.forEach((e) => {
//     //     // console.log('new', e)
//     // })
//     // const e: Entity[] = [];
//     // const [e, setE] = useState<Entity[]>([]);
//
//     // const [count, setCount] = useState(0);
//
//     useFrame((state, delta, frame) => {
//         update(delta, frame);
//         // setCount(frame);
//         //     // const a = (renderSystem as Render)?.items.added;
//         //
//         //     // for (const entity of (renderSystem as Render)?.items.added) {
//         //     //     if (!e.includes(entity)) {
//         //     //         // setE([...e, entity])
//         //     //         ecsStore.addEntity(entity);
//         //     //     }
//         //     //
//         //     // }
//         //     //
//         //     // for (const entity of (renderSystem as Render)?.items.removed) {
//         //     //     if (!e.includes(entity)) {
//         //     //         // setE([...e, entity])
//         //     //         ecsStore.removeEntity(entity);
//         //     //     }
//         //     //
//         //     // }
//         //
//         //     // if (a.length !== e.length) {
//         //     //     setE(prevState => prevState.concat(a));
//         //     // }
//         //
//         //
//     })
//     // useEffect(() => {
//     //     setE((renderSystem as Render).items.current.map(e => e.hold()));
//     // }, [renderSystem, (renderSystem as Render).items.current])
//
//     // const items = ecsStore.entities.map((child: Entity) => {
//     //     let ret = null;
//     //     try {
//     //         child.hold();
//     //         if (child.has(VehicleEntityComponent)) {
//     //             ret = (
//     //                 <Robot
//     //                     key={child.__id}
//     //                     entity={child}
//     //                     // position={[Math.random() * 100 - 50, 5, Math.random() * 100 - 50]}
//     //                     onClick={() => {
//     //                         select(child);
//     //                         console.log('click')
//     //                     }
//     //                     }
//     //                 />
//     //             );
//     //         }
//     //         if (child.has(Healing)) {
//     //             ret = (
//     //                 <HealthPack
//     //                     key={child.__id}
//     //                     entity={child}
//     //                     // position={[Math.random() * 100 - 50, 5, Math.random() * 100 - 50]}
//     //                     onClick={() => select(child)}
//     //                 />
//     //             );
//     //         }
//     //         if (child.has(Weapon)) {
//     //             ret = (
//     //                 <Rifle
//     //                     key={child.__id}
//     //                     entity={child}
//     //                     onClick={() => select(child)}
//     //                 />)
//     //         }
//     //         if (ret !== null) {
//     //             // child.add(Object3DComponent, ret.ref)
//     //         }
//     //     } catch (e) {
//     //         console.log(e);
//     //     }
//     //     return ret;
//     // })
//
//     return <>
//         {/*{ecsStore.entities.map((child: Entity) => {*/}
//         {/* {items}*/}
//         {entities.map((child: Entity) => {
//             let ret = null;
//             try {
//                 // child.hold();
//                 // if (child.has(VehicleEntityComponent)) {
//                 //     ret = (
//                 //         <Robot
//                 //             key={child.__id}
//                 //             entity={child}
//                 //             // position={[Math.random() * 100 - 50, 5, Math.random() * 100 - 50]}
//                 //             onClick={(event: any) => select(child) && event.stopPropagation()}
//                 //         />
//                 //     );
//                 // }
//                 if (child.has(Healing)) {
//                     ret = (
//                         <HealthPack
//                             key={child.__id}
//                             entity={child}
//                             // position={[Math.random() * 100 - 50, 5, Math.random() * 100 - 50]}
//                             onClick={(event: any) => select(child) && event.stopPropagation()}
//                         />
//                     );
//                 }
//                 if (child.has(Weapon)) {
//                     ret = (
//                         <Rifle
//                             key={child.__id}
//                             entity={child}
//                             onClick={(event: any) => select(child) && event.stopPropagation()}
//                         />)
//                 }
//                 if (ret !== null) {
//                     // child.add(Object3DComponent, ret.ref)
//                 }
//             } catch (e) {
//                 console.log(e);
//             }
//             return ret;
//         })}
//     </>
// }

export const FrameCount = () => {

    const stats = useRef<Stats>(null!);
    const update = useEcsStore(state => state.update);

    useEffect(() => {
        stats.current = Stats()
        stats.current.dom.style.cssText =
            "position:absolute;bottom:0;right:0;cursor:pointer;opacity:0.9;z-index:10000";
        document.body.appendChild(stats.current.dom);
    }, [])

    // const world = useContext(ECSContext);
    useFrame((state, delta, frame) => {
        stats.current?.end();
        update(frame, delta);
        // world?.update(state.clock.elapsedTime, delta);
        // update(state.clock.elapsedTime, delta);
        stats.current?.begin();
    });
    return null;
};
//
// @system
// class TestSystem extends System {
//
//     state: any = null;
//
//     items = this.query(q => q.with(VehicleEntityComponent).current.read);
//
//     render = () => (this.items?.current.map((e: Entity) => <Robot
//             key={e.__id}
//             entity={e}
//             onClick={(ev: any) => {
//                 useEcsStore.getState().selectEntity(e)
//                 ev.stopPropagation()
//             }}
//         />
//     ));
// }
//
// // @ts-ignore
// const useSystemEntities = ({systemType, query, setItems}) => {
//
//     // @ts-ignore
//     const system = useSystem(systemType) as systemType;
//
//     const addItems = (e: Entity[]) => {
//         // @ts-ignore
//         setItems((prev) => {
//             const newSet = new Set(prev);
//             // newSet.add(e)
//             e.forEach((e: Entity) => newSet.add(e));
//             return newSet;
//         });
//     }
//
//     const removeItems = (e: Entity[]) => {
//         // @ts-ignore
//         setItems((prev) => {
//             const newSet = new Set(prev);
//             // newSet.delete(e);
//             e.forEach((e: Entity) => newSet.delete(e));
//             return newSet;
//         });
//     }
//
//     useFrame(() => {
//         // system[query].added.forEach((e: Entity) => addItem(e))
//         // system[query].removed.forEach((e: Entity) => removeItem(e))
//         if (system[query].added.length > 0) {
//             addItems(system[query].added);
//         }
//         if (system[query].removed.length > 0) {
//             removeItems(system[query].removed);
//         }
//
//     })
// }

const Robots = () => {
    // const testSystem = useSystem(EntityManagerSystem) as EntityManagerSystem;
    const selectEntity = useEcsStore(state => state.selectEntity);
    // const [robots, setRobots] = useState(() => new Set<Entity>());
    //
    // useFrame(() => {
    //     testSystem.vehicleEntities.added.forEach((e: Entity) => addItem(e))
    //     testSystem.vehicleEntities.removed.forEach((e: Entity) => removeItem(e))
    // })
    // const addItem = (e: Entity) => {
    //     setRobots((prev) => new Set(prev).add(e));
    // }
    // const removeItem = (e: Entity) => {
    //     setRobots((prev) => {
    //         const newSet = new Set(prev);
    //         newSet.delete(e);
    //         return newSet;
    //     });
    // }

    const items = useSystemEntities({systemType: EntityManagerSystem, query: 'vehicleEntities'})

    return <>{[...items]?.map((e: Entity) => <Robot
        key={e.__id}
        entity={e.hold()}
        onClick={(ev: any) => {
            selectEntity(e)
            ev.stopPropagation()
        }}
    />)
    }</>

}

const GameEntities = () => {
    // const entityManagerSystem = useSystem(EntityManagerSystem) as EntityManagerSystem;
    // const debug = useDebug(state => state.debug);
    //
    // const [items, setItems] = useState(() => new Set<Entity>());
    // // const items = useMemo(() => debug ? [] : entityManagerSystem.entities.current, [debug, entityManagerSystem.entities]);
    // useFrame(() => {
    //     // if (items.length !== entityManagerSystem.entities.current.length) {
    //     //     setItems(entityManagerSystem.entities.current);
    //     // }
    //
    //     entityManagerSystem.entities.added.forEach((e: Entity) => addItem(e))
    //     entityManagerSystem.entities.removed.forEach((e: Entity) => removeItem(e))
    // })
    //
    // const addItem = (e: Entity) => {
    //     setItems((prev) => new Set(prev).add(e));
    // }
    // const removeItem = (e: Entity) => {
    //     setItems((prev) => {
    //         const newSet = new Set(prev);
    //         newSet.delete(e);
    //         return newSet;
    //     });
    // }

    const items = useSystemEntities({systemType: EntityManagerSystem, query: 'entities'})

    return <>
        {[...items].map((e: Entity) => {
            if (!e.__valid || !e.alive) return null;
            return <Helper e={e} key={e.__id}/>
        })}
    </>
}

const Helper = ({e}: { e: Entity }) => {
    const ref = useRef<THREE.Group>(null!);
    useFrame(() => {
        if (e.__valid && e.alive && e.has(GameEntityComponent)) {
            const gameEntity = e.read(GameEntityComponent).entity as GameEntity;
            // const {position, rotation} = e.read(PositionComponent);
            Vector3ToThree(gameEntity.position, ref.current.position);
            QuaternionToThree(gameEntity.rotation, ref.current.quaternion);
        }
    })

    return <group
        ref={ref}
    >
        <axesHelper
            key={e.__id}
            args={[1]}
        />
    </group>
}

const HealthPacks = () => {
    // const healthSystem = useSystem(HealthSystem) as HealthSystem;
    // const selectEntity = useEcsStore(state => state.selectEntity);
    // const [items, setItems] = useState(() => new Set<Entity>());
    //
    // useFrame(() => {
    //     healthSystem.healing.added.forEach((e: Entity) => addItem(e))
    //     healthSystem.healing.removed.forEach((e: Entity) => removeItem(e))
    // })
    //
    // const addItem = (e: Entity) => {
    //     setItems((prev) => new Set(prev).add(e));
    // }
    // const removeItem = (e: Entity) => {
    //     setItems((prev) => {
    //         const newSet = new Set(prev);
    //         newSet.delete(e);
    //         return newSet;
    //     });
    // }
    const items = useSystemEntities({systemType: HealthSystem, query: 'healing'});

    return <>{[...items]?.map((e: Entity) => {
        if (!e.__valid || !e.alive) return null;
        return <HealthPack
            key={e.__id}
            entity={e.hold()}
        />
    })}</>
}


const Crate = ({entity}: { entity: Entity }) => {
    const {height, width, depth} = entity.read(Obstacle);
    const {x, y, z} = entity.read(PositionComponent).position;
    const selectEntity = useEcsStore((state) => state.selectEntity);
    const bodyRef = useRef<RigidBodyApi>(null!);
    const meshRef = useRef<THREE.Object3D>(null!);

    useRigidBodyComponent(entity, bodyRef)
    useObject3dComponent(entity, meshRef)

    return <RigidBody
        position={[x, y, z]}
        ref={bodyRef}
    ><Box
        ref={meshRef}
        onClick={(ev: any) => {
            selectEntity(entity);
            ev.stopPropagation();
        }}
        args={[width, height, depth]}
    /></RigidBody>
}

const Obstacles = () => {
    const items = useSystemEntities({systemType: PerceptionSystem, query: 'obstacles'});

    return <>{[...items]?.map((e: Entity) => {
        // const {height, width, depth} = e.read(Obstacle);
        // const {x, y, z} = e.read(PositionComponent).position;

        return <Crate
            key={e.__id}
            entity={e}
        />
    })}</>
}

const Weapons = () => {
    // const selectEntity = useEcsStore(state => state.selectEntity);
    // const [items, setItems] = useState(() => new Set<Entity>());

    const items = useSystemEntities({systemType: WeaponSystem, query: 'weapons'});

    return <>{([...items].map((e: Entity) => <Rifle
            key={e.__id}
            entity={e}
            // onClick={(ev: any) => {
            //     selectEntity(e)
            //     ev.stopPropagation()
            // }}
        />
    ))}</>;
}

const BulletWrapper = () => {
    // const [items, setItems] = useState(() => new Set<Entity>());

    const items = useSystemEntities({systemType: BulletSystem, query: 'bullets'});

    return <>
        {[...items].map((bullet: Entity) => {
            if (!bullet.__valid || !bullet.alive) return null;

            // const {position, rotation} = bullet.read(PositionComponent);

            return <Bullet
                key={bullet.__id}
                entity={bullet.hold()}
                // position={new THREE.Vector3(position.x, position.y, position.z)}
                // rotation={new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)}
            />
        })}
    </>
}
//
// @component
// class RigidBodyComponent {
//     @field.object declare body: RigidBodyApi;
// }
//
// @system(s => s.afterWritersOf(RigidBodyComponent))
// class PhysicsSystem extends System {
//     bodies = this.query(q => q.with(RigidBodyComponent).current.write);
// }

const Paths = () => {
    // const navigationSystem = useSystem(NavigationSystem) as NavigationSystem;
    const items = useSystemEntities({systemType: NavigationSystem, query: 'running'});

    return <>{[...items].map((e: Entity) => {
            if (!e.__valid || !e.alive || !e.has(PathComponent)) return null;
            const path = e.read(PathComponent).path;
            if (!path || path.length < 2) return null;
            return <Line
                key={e.__id}
                points={path.map(v => new THREE.Vector3(v.x, v.y, v.z))}
            />
        }
    )}</>
}


const Targets = () => {


    const items = useSystemEntities({systemType: CombatSystem, query: 'entities'});
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCount(count + 1)
        }, 1000)
    }, [count]);

    return <>
        {[...items].map((e: Entity) => {
            const gameEntity = e.read(GameEntityComponent).entity;
            if (!gameEntity || !e.has(Target)) return null;
            const target = e.read(Target).value;
            if (!target || !target.has(PositionComponent)) return null;
            const {position} = target.read(PositionComponent);

            let color = 'red';
            if (e.has(MemoryComponent) && target.has(GameEntityComponent)) {
                const memory = e.read(MemoryComponent).system;
                const targetGameEntity = target.read(GameEntityComponent).entity;
                if (memory.hasRecord(targetGameEntity)) {
                    const record = memory.getRecord(targetGameEntity);
                    if (record.visible) {
                        color = 'green';
                    }
                }
            }

            return <Line
                key={e.__id}
                color={color}
                points={[[
                    gameEntity.position.x,
                    gameEntity.position.y,
                    gameEntity.position.z
                ], [
                    position.x,
                    position.y,
                    position.z
                ]]}
            />
        })}</>;
}