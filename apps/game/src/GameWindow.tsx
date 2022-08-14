import React, {useRef, Suspense, useContext, useEffect, useState} from "react";
import {
    GameWorld,
    Render,
    Health,
    Healing,
    Collectable,
    Inventory,
    Target,
    MovingEntity,
    Packed,
    State
} from "becsy-package";
import {EntityListPanel, EntityPanel, GameWorldWrapper, RenderContext, GameWorldContext} from "becsy-ui";
import {System, Entity, World} from "@lastolivegames/becsy";

import "becsy-package/systems";
import "becsy-yuka-package/systems";

import {
    VehicleEntityComponent,
    GameEntityComponent,
    StaticEntityComponent,
    BrainComponent,
    MemoryComponent,
    VisionComponent,
    PathRequestComponent,
    PathComponent,
    NavMeshComponent,
    EntityManagerSystem
} from "becsy-yuka-package";

import {Dummy} from "fiber-package";
import {TreeView} from "enable3d-ui";

import {EntityManagerContext, EntityManagerWrapper, EntityList} from "yuka-ui";

import {EntityManager, NavMesh, Polygon, Vector3, Quaternion} from "yuka";
import Stats from "three/examples/jsm/libs/stats.module";
import {Canvas, ThreeEvent, useFrame, useThree} from "@react-three/fiber";
import {
    OrbitControls,
    FlyControls,
    Sky,
    Stars,
    FirstPersonControls,
    PointerLockControls,
    Box,
} from "@react-three/drei";

import {
    Physics,
    RigidBody,
    Debug,
    BallCollider,
    RigidBodyApi,
} from "@react-three/rapier";

import {componentRegistry, Vehicle} from "yuka-package";

import * as THREE from "three";

const stats = Stats();
stats.dom.style.cssText =
    "position:absolute;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
document.body.appendChild(stats.dom);

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

const PlayerContext = React.createContext<{ player: Entity | undefined, setPlayer: any }>({
    player: undefined,
    setPlayer: () => {
    }
});
const FrameContext = React.createContext<{ frame: number, setFrame: any }>({frame: 0, setFrame: null});


export const GameWindow = ({id}: { id: any }) => {

    const [player, setPlayer] = React.useState<Entity | undefined>(undefined);

    const [show, setShow] = React.useState(true);
    // const [scene, setScene] = React.useState(false);

    const [frame, setFrame] = React.useState(0);
    const select = (target: Entity) => {
        if (player?.has(Target)) {
            player?.remove(Target);
        }
        player?.add(Target, {value: target});
        // setState({frame: this.state.frame + 1});
    }

    // goTo(event: ThreeEvent<MouseEvent>) {
    //     if (this.player?.has(Target)) {
    //         const selected = this.player?.read(Target).value as Entity;
    //         this.enqueueAction((sys) => {
    //             if (!selected.has(Target)) {
    //                 const target = sys.createEntity(MovingEntity, {
    //                     position: event.point.toArray(),
    //                 });
    //                 selected.add(Target, {value: target});
    //             }
    //         }, selected);
    //     }
    // }

    // setInterval(() => {
    //     setFrame(frame + 1);
    // }  , 1000);

    const [debug, setDebug] = React.useState(false);
    const [orbit, setOrbit] = React.useState(true);

    const [entityManager, setEntityManager] = useState<EntityManager | undefined>(undefined);
    const managerRef = useRef<EntityManager | undefined>(undefined);
    const worldRef = useRef<GameWorld | null>(null);

    // const scene = useRef<THREE.Scene | undefined>(undefined);

    const cb = (world: World) => {
        setEntityManager(managerRef.current);

        world.build((s) => {
            const nav = new NavMesh();
            nav.fromPolygons([
                new Polygon().fromContour([
                    new Vector3(0, 0, 0),
                    new Vector3(0, 0, 100),
                    new Vector3(100, 0, 100),
                    new Vector3(100, 0, 0),
                ]),
            ]);
            s.createEntity(NavMeshComponent, {navMesh: nav});
            setFrame(s.time);
            setPlayer(s.createEntity().hold());
        })
    }

    useEffect(() => {
        console.log(frame)
    }, [frame]);

    // render() {
    return (

        <GameWorldWrapper
            ref={worldRef}
            defs={[EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}]}
            buildCallback={cb}
        >
            <FrameContext.Provider value={{frame, setFrame}}>
                <PlayerContext.Provider value={{player, setPlayer}}>

                    <div className={"w3-display-container"}>
                        <div id={`gameWindow${id}`}>
                            <GameCanvas/>
                        </div>
                        {/*<Tree scene={scene.current}/>*/}
                        <Suspense fallback={null}><Toolbar/></Suspense>
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
        </GameWorldWrapper>

    );
    // }
}

const GameCanvas = () => {

    const world = useContext(GameWorldContext)
    const render = useContext(RenderContext)
    const player = useContext(PlayerContext);
    const frame = useContext(FrameContext);

    const [debug, setDebug] = useState(false);
    const [orbit, setOrbit] = useState(true);

    return <Canvas>
        <FrameContext.Provider value={frame}>
            <GameWorldContext.Provider value={world}>
                <RenderContext.Provider value={render}>
                    <PlayerContext.Provider value={player}>
                        <FrameCount/>
                        <Physics>
                            {debug ? <Debug/> : null}

                            {<EntityRenderList/>}

                            <RigidBody lockRotations={true} lockTranslations={true}>
                                <Box
                                    // onClick={(e) => this.goTo(e)}
                                    args={[100, 1, 100]}
                                    position={[0, -1, 0]}
                                >
                                    <meshStandardMaterial color={"green"}/>
                                </Box>
                            </RigidBody>
                        </Physics>
                    </PlayerContext.Provider>
                </RenderContext.Provider>
            </GameWorldContext.Provider>
        </FrameContext.Provider>
        <Suspense>
            <Sky/>
            {orbit ? <OrbitControls/> : <PointerLockControls/>}
            <ambientLight intensity={0.1}/>
            <directionalLight position={[0, 0, 5]} color="teal"/>
        </Suspense>
    </Canvas>
}

const Tree = ({scene}: { scene: THREE.Scene }) => {
    // let {scene} = useThree();
    // const scene = useRef<any | null>(null)// const scene = useThree()?.scene;
    //
    // useFrame((state, delta, frame) => {
    //     scene.current = state.scene;
    // })

    useEffect(() => {

    }, [scene])

    return <Suspense fallback={null}><TreeView scene={scene}/></Suspense>;
}

const EntityRenderList = (/*{render, world}: { render: Render, world: GameWorld }*/) => {
    // const [frame, setFrame] = useState<number>(0)
    const render = useContext(RenderContext);
    const world = useContext(GameWorldContext);

    const {frame, setFrame} = useContext(FrameContext);

    const {player} = useContext(PlayerContext);
    // const manager = useContext(EntityManagerContext);

    // useFrame((state, delta, frame) => {
    //     setFrame(frame);
    // })
    //
    const select = (e: Entity) => {
        world?.enqueueAction((sys, entity) => {
            if (player?.has(Target)) {
                player?.remove(Target);
            }
            player?.add(Target, {value: entity});
            // setFrame(sys.time)
            // frame.set(sys.time);
            setFrame(sys.time);
        }, e)
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
                            onClick={() => select(child)}
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

const Toolbar = () => {

    const world = useContext(GameWorldContext);
    const player = useContext(PlayerContext);

    const addEntity = (type: string) => {
        // console.log('hello')

        switch (type) {
            case "player":
                world?.enqueueAction((sys) =>
                    sys.createEntity(
                        Health,
                        VehicleEntityComponent,
                        Inventory,
                        BrainComponent,
                        VisionComponent,
                        MemoryComponent
                    )
                );
                break;
            case "health":
                world?.enqueueAction((sys) =>
                    sys.createEntity(Healing, Collectable, StaticEntityComponent)
                );
                break;
            case "gun":
                world?.enqueueAction((sys) => sys.createEntity(Collectable));
                break;
        }

    }
    //
    // useEffect(() => {
    //     console.log(world)
    // }, [world])

    return <div
        className={"w3-bar w3-black"}
        style={{top: 0, position: "absolute", display: "flex"}}
    >
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("player")}
        >
            Add Player
        </button>
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("health")}
        >
            Add Health
        </button>
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("gun")}
        >
            Add Gun
        </button>
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => {*/}
        {/*        this.setState({orbit: !this.state.orbit});*/}
        {/*        if (this.state.orbit) {*/}
        {/*            // document.getElementById('gameCanvas').requestPointerLock()*/}
        {/*        }*/}
        {/*    }}*/}
        {/*>*/}
        {/*    {this.state.orbit ? "orbit" : "first person"}*/}
        {/*</button>*/}
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => this.setState({debug: !this.state.debug})}*/}
        {/*>*/}
        {/*    debug*/}
        {/*</button>*/}
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => {*/}
        {/*        if (this.player?.has(Target)) {*/}
        {/*            this.player?.remove(Target);*/}
        {/*        }*/}

        {/*        this.setState({frame: this.world.world?.stats.frames});*/}
        {/*    }}*/}
        {/*>*/}
        {/*    -*/}
        {/*</button>*/}
    </div>
}

const Robot = (props: { entity: Entity; onClick: any; position?: any }) => {
    const bodyRef = useRef<RigidBodyApi>(null);
    const boxRef = useRef<THREE.Mesh>(null);
    const vehicle = props.entity.read(GameEntityComponent).entity as Vehicle;

    const dummyRef = useRef<{ setSelectedAction: any } | null>();

    useFrame(() => {
        const vehiclePos = Vector3YukaToThree(vehicle.position);
        const vehicleRot = QuaternionYukaToThree(vehicle.rotation);

        boxRef.current?.position.copy(vehiclePos);
        boxRef.current?.quaternion.copy(vehicleRot);

        if (!bodyRef.current) return;

        const currentVel = bodyRef.current.linvel();
        const vehicleVel = vehicle.velocity;
        const angle = bodyRef.current.rotation().angleTo(vehicleRot);

        bodyRef.current?.setLinvel({
            x: vehicleVel.x,
            y: currentVel.y,
            z: vehicleVel.z,
        });
        bodyRef.current?.setAngvel({x: 0, y: angle, z: 0})

        vehicle.position.copy(Vector3ThreeToYuka(bodyRef.current.translation()));
        vehicle.rotation.copy(QuaternionThreeToYuka(bodyRef.current.rotation()));

        const speed = currentVel.length()
        const maxSpeed = vehicle.maxSpeed;

        if (vehicle.components.has(State)) {
            const v = vehicle.components.read(State).value;
            dummyRef.current?.setSelectedAction(v);
        } else if (currentVel.y > 0.1 || currentVel.y < -0.001) {
            dummyRef.current?.setSelectedAction('Falling Idle');
        } else if (speed > maxSpeed * .1) {
            dummyRef.current?.setSelectedAction('Running');
        } else if (speed > maxSpeed * .01) {
            dummyRef.current?.setSelectedAction('Walking');
        } else {
            dummyRef.current?.setSelectedAction('LookingAround');
        }

    }, -1);

    return (
        <>
            <RigidBody
                ref={bodyRef}
                colliders={false}
                position={[vehicle.position.x, vehicle.position.y, vehicle.position.z]}
                enabledRotations={[false, true, false]}
            >
                <Suspense fallback={null}>
                    <Dummy ref={dummyRef} onClick={props.onClick}/>
                </Suspense>
                <BallCollider args={[0.5]} position={[0, 1.1, 0]}/>
                <BallCollider args={[0.5]} position={[0, 0, 0]}/>
                <BallCollider args={[0.5]} position={[0, -1.2, 0]}/>
            </RigidBody>
        </>
    );
};

const HealthPack = (props: {
    entity: Entity;
    onClick: any;
    position?: any;
}) => {
    const bodyRef = useRef<RigidBodyApi>(null);
    const gameEntity = props.entity.read(GameEntityComponent).entity;

    useFrame(() => {
        if (bodyRef.current) {
            gameEntity.position.copy(Vector3ThreeToYuka(bodyRef.current?.translation()));
            gameEntity.rotation.copy(QuaternionThreeToYuka(bodyRef.current?.rotation()));
        }
    })

    return <RigidBody
        ref={bodyRef}
        position={[
            gameEntity.position.x,
            gameEntity.position.y,
            gameEntity.position.z,
        ]}
    >
        <Box args={[1, 0.5, 0.8]} onClick={props.onClick}>
            <meshStandardMaterial color={"orange"}/>
        </Box>
    </RigidBody>

};

const Rifle = (props: { entity: Entity; onClick: any; position?: any }) => {
    const gameEntity = props.entity.read(GameEntityComponent).entity;

    return <RigidBody
        position={[
            gameEntity.position.x,
            gameEntity.position.y,
            gameEntity.position.z,
        ]}
    >
        <Box args={[0.1, 0.1, 0.8]} onClick={props.onClick}>
            <meshStandardMaterial color={"orange"}/>
        </Box>
    </RigidBody>
}

const FrameCount = () => {
    const world = useContext(GameWorldContext);
    useFrame((state, delta) => {
        stats.update();
        world?.execute(state.clock.elapsedTime, delta);
    });
    return <></>;
};

const Vector3ThreeToYuka = (v: THREE.Vector3) => {
    return new Vector3(v.x, v.y, v.z);
}

const Vector3YukaToThree = (v: Vector3) => {
    return new THREE.Vector3(v.x, v.y, v.z);
}

const QuaternionThreeToYuka = (q: THREE.Quaternion) => {
    return new Quaternion(q.x, q.y, q.z, q.w);
}

const QuaternionYukaToThree = (q: Quaternion) => {
    return new THREE.Quaternion(q.x, q.y, q.z, q.w);
}