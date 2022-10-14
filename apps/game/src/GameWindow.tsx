import React, {Suspense, useContext, useEffect, useRef, useState} from "react";
import {
    Collectable,
    GameWorld,
    Healing,
    Health,
    Packed,
    PositionComponent,
    Render,
    Selected,
    State,
    Target,
    ToBeDeleted,
    Weapon
} from "becsy-package";
import {EntityListPanel, EntityPanel, GameWorldContext, RenderContext} from "becsy-ui";
import {Entity, System, World} from "@lastolivegames/becsy";

import "becsy-package/systems";
import "becsy-yuka-package/systems";

import {
    BrainComponent,
    EntityManagerSystem,
    MemoryComponent,
    NavMeshComponent,
    PathComponent,
    PathRequestComponent,
    VehicleEntityComponent
} from "becsy-yuka-package";

import {EntityList, EntityManagerWrapper} from "yuka-ui";

import {EntityManager, NavMesh, Polygon, Vector3} from "yuka";
import Stats from "three/examples/jsm/libs/stats.module";
import {Canvas, ThreeEvent, useFrame} from "@react-three/fiber";
import {Box, OrbitControls, Sky,} from "@react-three/drei";

import {Debug, Physics, RigidBody,} from "@react-three/rapier";

import {componentRegistry,} from "yuka-package";

import {createConvexRegionHelper} from "three-yuka-package";

import * as THREE from "three";
import {Vector3ToThree} from "three-package"

import {HealthPack, Robot, PlayerContext} from 'becsy-fiber';
import {Rifle} from "./Rifle";
import {FirstPersonControls} from "becsy-fiber";
import {Toolbar} from "./Toolbar";


import {TerrainChunkManager} from "terrain-generator-package";

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

// export const PlayerContext = React.createContext<{ player: Entity | undefined, setPlayer: any }>(null!);
export const FrameContext = React.createContext<{ frame: number, setFrame: any }>({frame: 0, setFrame: null});
export const NavMeshContext = React.createContext<{ navMesh: NavMesh | undefined, setNavMesh: any }>(null!);

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


export const GameWindow = ({id}: { id: any }) => {


    const [player, setPlayer] = React.useState<Entity>(null!);
    const [navMesh, setNavMesh] = React.useState<NavMesh>(null!);

    const [show, setShow] = React.useState(true);
    const [frame, setFrame] = React.useState(0);


    const [debug, setDebug] = React.useState(false);
    const [orbit, setOrbit] = React.useState(true);

    const [entityManager, setEntityManager] = useState<EntityManager>(null!);
    const managerRef = useRef<EntityManager>(null!);
    const [render, setRender] = React.useState<Render>(null!);
    const renderRef = useRef<Render>(null!);
    const worldRef = useRef<GameWorld>(new GameWorld());

    const [world, setWorld] = React.useState<GameWorld>(null!);

    useEffect(() => {
        worldRef.current.makeWorld([
            Render, {reference: renderRef},
            EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
        ]).then((world: World) => {
            setEntityManager(managerRef.current);

            world.build((s) => {
                setPlayer(s.createEntity().hold());
                const nav = new NavMesh();
                nav.fromPolygons([
                    new Polygon().fromContour([
                        new Vector3(-50, 0, -50),
                        new Vector3(-50, 0, 50),
                        new Vector3(50, 0, 50),
                        new Vector3(50, 0, -50),
                    ]),
                ]);
                setNavMesh(nav);
                s.createEntity(NavMeshComponent, {navMesh: nav});
                setFrame(s.time);
                setRender(renderRef.current)
                setWorld(worldRef.current);
            })
        })
    }, [])

    return (
        <GameWorldContext.Provider value={world}>
            <RenderContext.Provider value={render}>
                <FrameContext.Provider value={{frame, setFrame}}>
                    <PlayerContext.Provider value={{player, setPlayer}}>

                        <div className={"w3-display-container"}>
                            <div id={`gameWindow${id}`}>
                                <NavMeshContext.Provider value={{navMesh, setNavMesh}}>
                                    <GameCanvas debug={debug} orbit={orbit}/>
                                </NavMeshContext.Provider>
                            </div>
                            {/*<Tree scene={scene.current}/>*/}
                            {/*<Suspense fallback={null}>*/}
                            <Toolbar
                                actions={[
                                    {name: 'Debug', action: () => setDebug(!debug)},
                                    {name: orbit ? 'Orbit' : 'First Person', action: () => setOrbit(!orbit)},
                                ]}/>
                            {/*</Suspense>*/}
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
                    <EntityManagerWrapper manager={entityManager}>
                        <EntityList/>
                    </EntityManagerWrapper>
                </FrameContext.Provider>
            </RenderContext.Provider>
        </GameWorldContext.Provider>
    );
    // }
}

const GameCanvas = ({debug, orbit}: { debug: boolean, orbit: boolean }) => {

    // const {world, player, render} = useContext(GameContext);

    const world = useContext(GameWorldContext)
    const render = useContext(RenderContext)
    const player = useContext(PlayerContext);
    const frame = useContext(FrameContext);

    const navMesh = useContext(NavMeshContext);

    // const [debug, setDebug] = useState(false);
    // const [orbit, setOrbit] = useState(true);

    const goTo = (event: ThreeEvent<MouseEvent>) => {
        if (player.player?.has(Target)) {

            world?.enqueueAction((sys, e, data: { position: { x: number, y: number, z: number }&[number, number, number] }) => {
                const selected = e?.read(Target).value as Entity;
                // console.log(selected.read(Selected));

                if (!selected?.has(Target)) {
                    const target = sys.createEntity(PositionComponent, {
                        position: data.position
                    }, Selected, ToBeDeleted, {condition: (entity: Entity) => {
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
                    }});
                    selected?.add(Target, {value: target});
                } else {
                    const target = selected.read(Target).value;
                    target.write(PositionComponent).position = data.position;
                }
            }, player.player, {position: event.point.toArray()});

        }
    }

    const deselect = (event: ThreeEvent<MouseEvent>) => {
        if (player.player?.has(Target)) {
            player.player?.remove(Target)
        }
    }

    const helper = useRef<THREE.Object3D>(null!);
    const scene = useRef<THREE.Scene | undefined>(undefined);
    useEffect(() => {
        if (navMesh.navMesh) {
            scene.current?.remove(helper.current);

            console.log('update')
            helper.current = createConvexRegionHelper(navMesh.navMesh);
            scene.current?.add(helper.current);
        }

    }, [world, render, player])
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
        camera={{ near: .1, far: 100000}}
    >
        <FrameContext.Provider value={frame}>
            <GameWorldContext.Provider value={world}>
                <FrameCount/>
                <RenderContext.Provider value={render}>
                    <PlayerContext.Provider value={player}>

                        <Physics>
                            {debug ? <Debug/> : null}

                            {<EntityRenderList/>}

                            <RigidBody lockRotations={true} lockTranslations={true}>
                                <Box
                                    onClick={(e) => deselect(e)}
                                    onContextMenu={(e) => goTo(e)}
                                    args={[100, 1, 100]}
                                    position={[0, -1, 0]}
                                >
                                    <meshStandardMaterial color={"green"}/>
                                </Box>
                            </RigidBody>

                            <TerrainChunkManager />

                        </Physics>
                    </PlayerContext.Provider>
                </RenderContext.Provider>
            </GameWorldContext.Provider>
        </FrameContext.Provider>
        <Suspense>
            <Sky/>
            <PlayerContext.Provider value={player}>
                <Controls orbit={orbit}/>
            </PlayerContext.Provider>
            <ambientLight intensity={0.1}/>
            <directionalLight position={[0, 0, 5]} color="teal"/>
        </Suspense>
    </Canvas>
}

const Controls = ({orbit}: { orbit: boolean }) => {

    return orbit ? <OrbitControls/> : <FirstPersonControls/>
}

//
// const Tree = ({scene}: { scene: THREE.Scene }) => {
//     // let {scene} = useThree();
//     // const scene = useRef<any | null>(null)// const scene = useThree()?.scene;
//     //
//     // useFrame((state, delta, frame) => {
//     //     scene.current = state.scene;
//     // })
//
//     useEffect(() => {
//
//     }, [scene])
//
//     return <Suspense fallback={null}><TreeView scene={scene}/></Suspense>;
// }

export const EntityRenderList = () => {

    const render = useContext(RenderContext);
    const world = useContext(GameWorldContext);
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

    useEffect(() => {

    }, [player])

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

    return <>
        {render?.items.current.map((child: Entity) => {
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
                                console.log('click')}
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

    useEffect(() => {
        stats.current = Stats()
        stats.current.dom.style.cssText =
            "position:absolute;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
        document.body.appendChild(stats.current.dom);
    }, [])

    const world = useContext(GameWorldContext);
    useFrame((state, delta) => {
        stats.current.begin();
        world?.execute(state.clock.elapsedTime, delta);
        stats.current.end();
    });
    return <></>;
};

