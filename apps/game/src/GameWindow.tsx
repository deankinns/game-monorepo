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
    Weapon
} from "becsy-package";
import {EntityListPanel, EntityPanel, RenderContext} from "becsy-ui";
import {Entity, System, World} from "@lastolivegames/becsy";

import "becsy-package/systems";
import "becsy-yuka-package/systems";

import {
    BrainComponent,
    EntityManagerSystem, GameEntityComponent,
    MemoryComponent,
    NavMeshComponent,
    PathComponent,
    PathRequestComponent,
    VehicleEntityComponent
} from "becsy-yuka-package";

import {SimplifyModifier} from 'three-stdlib'

import {EntityList, EntityManagerWrapper} from "yuka-ui";

import {EntityManager, NavMesh, Polygon, Vector3, CellSpacePartitioning} from "yuka";
import Stats from "three/examples/jsm/libs/stats.module";
import {Canvas, ThreeEvent, useFrame} from "@react-three/fiber";
import {Box, OrbitControls, Sky,} from "@react-three/drei";

import {Debug, Physics, RigidBody,} from "@react-three/rapier";

import {componentRegistry,PathPlanner} from "yuka-package";

import {createConvexRegionHelper, createCellSpaceHelper} from "three-yuka-package";

import * as THREE from "three";
import {Vector3ToThree} from "three-package"

import {HealthPack, Robot, PlayerContext} from 'becsy-fiber';
import {BulletWrapper, Rifle} from "./Rifle";
import {FirstPersonControls} from "becsy-fiber";
import {Toolbar} from "./Toolbar";


import {TerrainChunkManager, GenerateHeight} from "terrain-generator-package";

import {useSystem, useEcsStore, Entity as EntityComponent} from "react-becsy";

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
componentRegistry.Position = PositionComponent;
componentRegistry.Selected = Selected;
componentRegistry.ToBeDeleted = ToBeDeleted;
componentRegistry.Render = Render;
componentRegistry.VehicleEntityComponent = VehicleEntityComponent;
componentRegistry.NavMeshComponent = NavMeshComponent;
componentRegistry.Inventory = Inventory;
componentRegistry.GameEntityComponent = GameEntityComponent;

// export const PlayerContext = React.createContext<{ player: Entity | undefined, setPlayer: any }>(null!);
export const FrameContext = React.createContext<{ frame: number, setFrame: any }>({frame: 0, setFrame: null});
export const NavMeshContext = React.createContext<{ navMesh: NavMesh | undefined, setNavMesh: any }>(null!);
export const EntityManagerContext = React.createContext<EntityManager>(null!);

type GameContext = {
    player: Entity,
    setPlayer: any,
    render: Render,
    setRender: any,
    world: GameWorld,
    setWorld: any,
}

// const GameContext = React.createContext<GameContext>(null!);

// const thing = React.createRef<GameWorld>()


export const GameWindow = () => {

    const [player, setPlayer] = React.useState<Entity>(null!);
    const [navMesh, setNavMesh] = React.useState<NavMesh>(null!);

    const [show, setShow] = React.useState(true);
    const [frame, setFrame] = React.useState(0);


    const [debug, setDebug] = React.useState(false);
    const [orbit, setOrbit] = React.useState(true);
    const managerRef = useRef<EntityManager>(null!);

    // const renderRef = useRef<Render>(null!);
    // const [render, setRender] = React.useState<any>(null!);

    const ecsStore = useEcsStore();

    const render = useSystem(Render) as Render

    // const ECS = useECS([
    //     Render, {reference: renderRef},
    //     EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
    // ], (world: World) => {
    //     setRender(renderRef.current)
    // });

    // const EcsStore = useEcsStore();
    useEffect(() => {
        ecsStore.create([
            // Render, {reference: renderRef},
            EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
        ], (world: World) => {
            world.build((s) => {
                setPlayer(s.createEntity().hold());
                const nav = new NavMesh();

                // nav.fromPolygons([
                //     new Polygon().fromContour([
                //         new Vector3(-50, 0, -50),
                //         new Vector3(-50, 0, 50),
                //         new Vector3(50, 0, 50),
                //         new Vector3(50, 0, -50),
                //     ]),
                // ]);
                setNavMesh(nav);
                s.createEntity(NavMeshComponent, {navMesh: nav});
                setFrame(s.time);

                // @ts-ignore
                // managerRef.current.pathPlanner = new PathPlanner(nav)
                // setRender(renderRef.current)
            })
        })
    }, []);


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
            <Suspense fallback={null}>
                <FrameContext.Provider value={{frame, setFrame}}>
                    <RenderContext.Provider value={render}>
                        <NavMeshContext.Provider value={{navMesh, setNavMesh}}>
                        <PlayerContext.Provider value={{player, setPlayer}}>
                            <div className={"w3-display-container"}>
                                <div id={`gameWindow`}>
                                    <NavMeshContext.Provider value={{navMesh, setNavMesh}}>
                                        <EntityManagerContext.Provider value={managerRef.current}>
                                            {render ? <GameCanvas debug={debug} orbit={orbit}/> : null}
                                        </EntityManagerContext.Provider>
                                    </NavMeshContext.Provider>
                                </div>
                                {/*{show ? <div className={"w3-display-middle"}>*/}
                                {/*    <EntityComponent>*/}
                                {/*        <p>hello</p>*/}
                                {/*    </EntityComponent>*/}
                                {/*</div> : null}*/}
                                <Toolbar
                                    actions={[
                                        {name: 'Debug', action: () => setDebug(!debug)},
                                        {name: orbit ? 'Orbit' : 'First Person', action: () => setOrbit(!orbit)},
                                    ]}/>
                                {player?.has(Target) ? (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            maxHeight: "100vh",
                                            overflow: "auto",
                                        }}
                                    >
                                        <EntityPanel
                                            entity={player.read(Target).value}
                                        />
                                    </div>
                                ) : null}
                                <div
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
                            </div>
                        </PlayerContext.Provider>
                        {/*<EntityManagerWrapper manager={entityManager}>*/}
                        {/*    <EntityList/>*/}
                        {/*</EntityManagerWrapper>*/}
                        </NavMeshContext.Provider>
                    </RenderContext.Provider>
                </FrameContext.Provider>
            </Suspense>
        </>
        // <ECS.Provider>
        //
        // </ECS.Provider>
    );
    // }
}

const GameCanvas = ({debug, orbit}: { debug: boolean, orbit: boolean }) => {

    // const {world, player, render} = useContext(GameContext);

    // const world = useContext(GameWorldContext)
    // const world = useContext(ECSContext)
    const world = useEcsStore().ecs;
    const render = useSystem(Render) as Render;

    // const render = useContext(RenderContext)
    const player = useContext(PlayerContext);
    const frame = useContext(FrameContext);

    const entityManager = useContext(EntityManagerContext);

    const navMesh = useContext(NavMeshContext);

    // const [debug, setDebug] = useState(false);
    // const [orbit, setOrbit] = useState(true);

    const goTo = (event: ThreeEvent<MouseEvent>) => {
        if (player.player?.has(Target)) {
            world?.enqueueAction((sys, e, data: { position: { x: number, y: number, z: number } & [number, number, number] }) => {
                const selected = e?.read(Target).value as Entity;
                // console.log(selected.read(Selected));

                if (selected?.has(Target)) {
                    selected.remove(Target);
                }
                    const target = sys.createEntity(PositionComponent, {
                        position: data.position
                    }, Selected, ToBeDeleted, {
                        condition: (entity: Entity) => {
                            const sel = entity.read(Selected).by;
                            for (const by of sel) {
                                const byPos = Vector3ToThree(by.read(PositionComponent).position, new THREE.Vector3());
                                const ePos = Vector3ToThree(entity.read(PositionComponent).position, new THREE.Vector3());
                                // console.log(byPos.distanceTo(ePos));
                                if (byPos.distanceTo(ePos) < 10) {
                                    by.remove(Target)
                                }
                            }

                            return sel.length < 1;
                        }
                    });
                    selected?.add(Target, {value: target});
                // } else {
                //     const target = selected.read(Target).value;
                //     target.write(PositionComponent).position = data.position;
                // }
            }, player.player, {position: event.point.toArray()});
        }

        event.stopPropagation();
    }

    const deselect = (event: ThreeEvent<MouseEvent>) => {
        if (player.player?.has(Target)) {
            player.player?.remove(Target)
        }
    }

    const regionHelper = useRef<THREE.Object3D>(null!);
    const indexHelper = useRef<THREE.Object3D>(null!);
    const scene = useRef<THREE.Scene | undefined>(undefined);
    // const spatialIndex = useRef<CellSpacePartitioning>(new CellSpacePartitioning(1000, 100, 1000, 100, 10, 100));

    useEffect(() => {
        scene.current?.remove(regionHelper.current);
        scene.current?.remove(indexHelper.current);
        if (navMesh.navMesh && debug) {


            // console.log('update')
            regionHelper.current = createConvexRegionHelper(navMesh.navMesh);
            scene.current?.add(regionHelper.current);

            if (navMesh.navMesh.spatialIndex) {

                indexHelper.current = createCellSpaceHelper(navMesh.navMesh.spatialIndex);
                scene.current?.add(indexHelper.current);
            }

        }

    }, [world, render, player, debug])
    // const foo = ({children}) => <>{children}</>

    const firstPersonRef = useRef<any>(null!);

    // useFrame(() => {
    //     if (player.player?.has(Target)) {
    //         const position = player.player.read(Target).value.read(PositionComponent).position;
    //
    //         firstPersonRef.current?.position.set(position.x, position.y, position.z);
    //     }
    //
    //
    // })


    return <Canvas
        onCreated={state => scene.current = state.scene}
        camera={{near: .1, far: 100000, position: [100, 100, 100]}}
    >
        <FrameContext.Provider value={frame}>
            {/*<ECSContext.Provider value={world}>*/}
                <FrameCount/>
                <RenderContext.Provider value={render}>
                    <NavMeshContext.Provider value={navMesh}>
                    <PlayerContext.Provider value={player}>
                        <Physics>
                            {debug ? <Debug/> : null}

                            {<EntityRenderList/>}
                            <BulletWrapper />
                            <Terrain
                                actions={{
                                    deselect, goTo
                                }}
                            />

                        </Physics>
                    </PlayerContext.Provider>
                    </NavMeshContext.Provider>
                </RenderContext.Provider>
            {/*</ECSContext.Provider>*/}
        </FrameContext.Provider>
        <Suspense>
            <Sky/>
            <PlayerContext.Provider value={player}>
                <Controls orbit={orbit}/>
            </PlayerContext.Provider>
            <ambientLight intensity={0.5}/>
            <directionalLight position={[0, 0, 5]} color="teal"/>
        </Suspense>
    </Canvas>
}

const Controls = ({orbit}: { orbit: boolean }) => {

    return orbit ? <OrbitControls/> : <FirstPersonControls/>
}

const Terrain = ({actions: {goTo, deselect}}: any) => {
    const nav = useContext(NavMeshContext);
    // const entityManager = useContext(EntityManagerContext);

    const ref = useRef<any>(null!);

    useEffect(() => {
        // console.log(nav.navMesh, ref.current);

        if (nav.navMesh && ref.current) {

            // const modifer = new SimplifyModifier();
            const polygons = ref.current.groupRef.current.children.map((o: THREE.Object3D) => {
                // child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
                const child = o.children[0] as THREE.Mesh;

                const y = child.parent?.position.y
                const polygon = new Polygon();
                // const x = child.children[0].geometry.boundingSphere.center.x;
                // const y = 0
                // const z = child.position.z;
                const {x, z} = child.position;
                const noise = ref.current.noise

                child.geometry.computeBoundingBox();
                if (!child.geometry.boundingBox) return;
                const half = (child.geometry.boundingBox.max.x - child.geometry.boundingBox.min.x) / 2;

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

                const p1 = child.userData.points[0]
                const p2 = child.userData.points[child.userData.resolution]
                const p3 = child.userData.points[child.userData.points.length - child.userData.resolution - 1]
                const p4 = child.userData.points[child.userData.points.length - 1]

                // const a1 = [
                //     new Vector3(x + half, noise.Get(x + half, z + half) + y, z + half),
                //     new Vector3(x + half, noise.Get(x + half, z - half) + y, z - half),
                //     new Vector3(x - half, noise.Get(x - half, z - half) + y, z - half),
                //     new Vector3(x - half, noise.Get(x - half, z + half) + y, z + half),
                // ];
                const a2 = [
                    new Vector3(x + half, p4, z + half),
                    new Vector3(x + half, p1, z - half),
                    new Vector3(x - half, p2, z - half),
                    new Vector3(x - half, p3, z + half),
                ];
                // const a2 = [
                //     new Vector3(x + half, GenerateHeight(new Vector3(x + half, z + half,0), noise) + y, z + half),
                //     new Vector3(x + half, GenerateHeight(new Vector3(x + half, z - half,0), noise) + y, z - half),
                //     new Vector3(x - half, GenerateHeight(new Vector3(x - half, z - half,0), noise) + y, z - half),
                //     new Vector3(x - half, GenerateHeight(new Vector3(x - half, z + half,0), noise) + y, z + half),
                // ];
                const pos = child.geometry.attributes.position;

                let v1 = new THREE.Vector3();
                v1.fromBufferAttribute(pos, 0);
                child.localToWorld(v1);

                let v2 = new THREE.Vector3();
                // @ts-ignore
                v2.fromBufferAttribute(pos, child.geometry.parameters.widthSegments);
                child.localToWorld(v2);

                let v3 = new THREE.Vector3();
                // @ts-ignore
                v3.fromBufferAttribute(pos, ((child.geometry.parameters.widthSegments + 1) * (child.geometry.parameters.heightSegments + 1)) - child.geometry.parameters.widthSegments - 1);
                child.localToWorld(v3);

                let v4 = new THREE.Vector3();
                // @ts-ignore
                v4.fromBufferAttribute(pos, ((child.geometry.parameters.widthSegments + 1) * (child.geometry.parameters.heightSegments + 1)) - 1);
                child.localToWorld(v4);

                // for (let i = 0; i < pos.count; i++) {
                //
                // }
                const a3 = [v4, v2, v1, v3]


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

            generate(nav, polygons).then(() => {
                // @ts-ignore
                // if (!nav.navMesh.spatialIndex) {
                //     // @ts-ignore
                // nav.navMesh.spatialIndex = entityManager.spatialIndex
                //     nav.navMesh?.updateSpatialIndex()
                // }
            });
        }
    })

    const generate = async (nav: { navMesh: any; setNavMesh?: any; }, polygons: any) => {
        await nav.navMesh.fromPolygons(polygons)


        //
        // nav.navMesh.updateSpatialIndex()

        // if (entityManager.pathPlanner) {
        //     entityManager.pathPlanner.navMesh = nav.navMesh
        // }

        // nav.;
    }

    return <TerrainChunkManager
        ref={ref}
        onClick={deselect}
        onContextMenu={goTo}
    />
}

export const EntityRenderList = () => {

    const render = useContext(RenderContext);
    // const world = useContext(GameWorldContext);
    // const world = useContext(ECSContext);
    const world = useEcsStore().ecs
    const player = useContext(PlayerContext);

    const {frame, setFrame} = useContext(FrameContext);

    const select = (e: Entity) => {
        world?.enqueueAction((sys, entity, data) => {
            if (data?.player?.has(Target)) {
                data?.player?.remove(Target);
            }
            if (!entity?.has(Selected)) {
                entity?.add(Selected);
            }
            data?.player?.add(Target, {value: entity});
            setFrame(sys.time);
        }, e, {player: player?.player});
    };
    //
    // useEffect(() => {
    //
    // }, [player])

    useEffect(() => {
        // console.log('render', render, world);
        if (render) {
            // render.cb = (system) => {
            //     setFrame(system.time);
            // }
            render.cblist.set(EntityRenderList, (system: System) => {
                setFrame(system.time);
            })
        }
        // setFrame(1);
        return () => {
            render?.cblist.delete(EntityRenderList);
        }
    }, [render]);

    // const items = useEcsStore().entities
    const ecsStore = useEcsStore();

    const renderSystem = useMemo(()=> ecsStore.systems.find(s => s instanceof Render), []);
    //
    // const items = (renderSystem as Render)?.items.current
    //
    // newQuery?.current.forEach((e) => {
    //     // console.log('new', e)
    // })

    return <>
        {(renderSystem as Render)?.items.current.map((child: Entity) => {
            let ret = null;
            try {
                child.hold();
                if (child.has(VehicleEntityComponent)) {
                    ret = (
                        <Robot
                            key={child.__id}
                            entity={child}
                            // position={[Math.random() * 100 - 50, 5, Math.random() * 100 - 50]}
                            onClick={() => {
                                select(child);
                                console.log('click')
                            }
                            }
                        />
                    );
                }
                if (child.has(Healing)) {
                    ret = (
                        <HealthPack
                            key={child.__id}
                            entity={child}
                            // position={[Math.random() * 100 - 50, 5, Math.random() * 100 - 50]}
                            onClick={() => select(child)}
                        />
                    );
                }
                if (child.has(Weapon)) {
                    ret = (
                        <Rifle
                            key={child.__id}
                            entity={child}
                            onClick={() => select(child)}
                        />)
                }
                if (ret !== null) {
                    // child.add(Object3DComponent, ret.ref)
                }
            } catch (e) {
                console.log(e);
            }
            return ret;
        })}
    </>
}

export const FrameCount = () => {

    const stats = useRef<Stats>(null!);
    const store = useEcsStore()

    useEffect(() => {
        stats.current = Stats()
        stats.current.dom.style.cssText =
            "position:absolute;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
        document.body.appendChild(stats.current.dom);
    }, [])

    // const world = useContext(ECSContext);
    useFrame((state, delta) => {
        stats.current?.end();
        // world?.update(state.clock.elapsedTime, delta);
        store.update(state.clock.elapsedTime, delta);
        stats.current?.begin();
    });
    return <></>;
};

