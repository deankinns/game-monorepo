import React, {useContext, useRef} from "react";
import {PlayerContext} from 'becsy-fiber';
// import {GameWorldContext} from "becsy-ui";
import {Inventory, Health, Healing, Collectable, Weapon, PositionComponent, EventSystem} from "becsy-package";
import {
    BrainComponent,
    VehicleEntityComponent,
    VisionComponent,
    MemoryComponent,
    StaticEntityComponent, Obstacle
} from "becsy-yuka-package";
import {RefComponent, useEcsStore, useSystem} from "react-becsy";
import {System} from "@lastolivegames/becsy";
// import {FrameContext} from "./GameWindow";

export const Toolbar = ({actions}: { actions?: any[] }) => {

    // const world = useContext(ECSContext);
    // const world = useEcsStore().ecs;
    const [ecs] = useEcsStore(state => [state.ecs]);
    // const player = useContext(PlayerContext);

    // const frame = useContext(FrameContext);
    // const playerRef = useRef<{head: any, hand: any, obj: any}>({head: null, hand: null, obj: null});

    const eventSystem = useSystem(EventSystem) as EventSystem;

    const addEntity = (type: string) => {
        // console.log('hello')
        // const world = ecsStore.ecs;

        switch (type) {
            case "player":
                eventSystem.createEntity(
                    Health,
                    VehicleEntityComponent,
                    Inventory,
                    BrainComponent,
                    VisionComponent,
                    MemoryComponent,
                )

                // ecs.enqueueAction((sys: System) => {
                //     const e = sys.createEntity(
                //         Health,
                //         VehicleEntityComponent,
                //         Inventory,
                //         BrainComponent,
                //         VisionComponent,
                //         MemoryComponent,
                //         // RefComponent, {ref: playerRef}
                //         // PositionComponent, {position: {x: 0, y: 10, z: 0}},
                //     )
                //
                //     }
                // );
                break;
            case "health":
                // ecs.enqueueAction((sys) =>
                //     sys.createEntity(Healing, Collectable, StaticEntityComponent,
                //         // PositionComponent, {position: {x: 0, y: 10, z: 10}},
                //     )
                // );
                eventSystem.createEntity(Healing, Collectable, StaticEntityComponent,
                    // PositionComponent, {position: {x: 0, y: 10, z: 10}},
                )
                break;
            case "gun":
                // ecs.enqueueAction((sys) => sys.createEntity(Collectable, Weapon, {
                //     ammo: 10,
                //     maxAmmo: 10
                // }, StaticEntityComponent));
                eventSystem.createEntity(
                    Collectable,
                    Weapon, {
                    ammo: 10,
                    maxAmmo: 10
                }, StaticEntityComponent);
                break;
            case "ammo":
                eventSystem.createEntity(Collectable, StaticEntityComponent)
                break;
            case "obstacle":
                eventSystem.createEntity(
                    StaticEntityComponent,
                    Obstacle, {width: 100, depth: 100}
                )
                break;
        }

        // frame.setFrame(frame.frame + 1);

    }
    //
    // useEffect(() => {
    //     console.log(world)
    // }, [world])

    const extraButtons = actions?.map(action => <button
        className={"w3-bar-item w3-button"}
        onClick={action.action} key={action.name}
    >{action.name}</button>)

    return <div
        className={"w3-bar w3-black"}
        style={{top: 0, position: "absolute", display: "flex"}}
    >
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("player")}
        >
            Player
        </button>
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("health")}
        >
            Health
        </button>
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("gun")}
        >
            Gun
        </button>
        <button
            className={"w3-bar-item w3-button"}
            onClick={() => addEntity("obstacle")}
        >
            Obstacle
        </button>
        {extraButtons}
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