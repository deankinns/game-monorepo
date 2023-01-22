import * as React from "react";
import {
    EntityManager,
    NavMesh,
    Polygon,
    Vector3,
    componentRegistry,
} from "yuka-package";
import {EntityList, EntityManagerWrapper} from "yuka-ui";

import {EntityListPanel/*, GameWorldWrapper, GameWorldContext*/} from "becsy-ui";

import "becsy-package/systems";
import "becsy-yuka-package/systems";
import {World} from "@lastolivegames/becsy";
import {
    VehicleEntityComponent,
    StaticEntityComponent,
    BrainComponent,
    VisionComponent,
    MemoryComponent,
    PathRequestComponent,
    PathComponent,
    NavMeshComponent,
    EntityManagerSystem
} from "becsy-yuka-package";

import {
    GameWorld,
    Health,
    Healing,
    Collectable,
    Inventory,
    Target,
    State,
    Packed,
} from "becsy-package";
import {useContext, useEffect, useRef, useState} from "react";

import {useEcsStore, Entity as EntityComponent} from "react-becsy";
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

// export class GameWindow extends React.Component<any, any> {

export const GameWindow = ({id}: { id: any }) => {
    const [frame, setFrame] = useState(0);

    const [entityManager, setEntityManager] = useState<EntityManager | undefined>(undefined);

    const managerRef = useRef<EntityManager | undefined>(undefined);
    const worldRef = useRef<GameWorld | null>(null);

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
        })
    }

    const requestRef = React.useRef(0);
    const previousTimeRef = React.useRef(0);

    // const ECS = useECS([
    //     // Render, {reference: renderRef},
    //     EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
    // ], (world: World) => {
    //     // setRender(renderRef.current)
    //     // setEntityManager(managerRef.current);
    //     cb(world);
    // });
    const [ecs, create, ] = useEcsStore(state => ([state.ecs, state.create]));
    // const ECS = ecsStore.ecs;

    useEffect(() => {
        create([
            EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
        ], cb);
    } , [create, ecs])


    const animate = ((time: number) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            // worldRef.current?.execute(time, deltaTime);
            ecs.world?.execute(time, deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);

        // setFrame(time);
    })


    useEffect(() => {
        requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [])

    return (
        <div id={`gameWindow${id}`}>
            {/*<ECS.Provider            >*/}

                <Toolbar/>
                <div
                    style={{
                        display: "grid",
                        height: "90vh",
                        gridTemplateColumns: "1fr 1fr",
                    }}
                >
                    <div style={{height: "100%", overflow: "auto"}}>
                        <EntityManagerWrapper manager={entityManager}>
                            <EntityList/>
                        </EntityManagerWrapper>
                    </div>
                    <div style={{height: "100%", overflow: "auto"}}>
                        <EntityListPanel/>
                    </div>
                </div>
            {/*</ECS.Provider>*/}
        </div>
    );
}


export const Toolbar = () => {
    // const world = useContext(ECSContext);
    const world = useEcsStore().ecs

    const addEntity = (type: string) => {
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

    return <div className={"toolbar"}>
        <button onClick={() => addEntity("player")}>Player</button>
        <button onClick={() => addEntity("health")}>Health Pack</button>
        <button onClick={() => addEntity("gun")}>Gun</button>
    </div>
}
