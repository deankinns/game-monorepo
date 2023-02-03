import React from "react";
// import {GameWorldContext} from "becsy-ui";
import {Health, Inventory} from "becsy-package";
import {BrainComponent, MemoryComponent, VehicleEntityComponent, VisionComponent} from "becsy-yuka-package";
import {useCreateEntity} from "react-becsy";
// import {FrameContext} from "./GameWindow";


const NewPlayerButton = () => {
    // const [createEntity] = useCreateEntity();
    //
    // return <button onClick={() => createEntity(
    //     Health,
    //     VehicleEntityComponent,
    //     Inventory,
    //     BrainComponent,
    //     VisionComponent,
    //     MemoryComponent,
    // )}>New Player</button>
    return <NewEntityButton components={[
        Health,
        VehicleEntityComponent,
        Inventory,
        BrainComponent,
        VisionComponent,
        MemoryComponent,
    ]}>new player</NewEntityButton>

}

export const NewEntityButton = ({components, children}: { components: any, children: any }) => {
    const [createEntity] = useCreateEntity();

    // @ts-ignore
    return <button onClick={() => createEntity(...components)}>{children}</button>
}

export const Toolbar = ({actions, children}: any) => {

    // // const world = useContext(ECSContext);
    // // const world = useEcsStore().ecs;
    // const [ecs] = useEcsStore(state => [state.ecs]);
    // // const player = useContext(PlayerContext);
    //
    // // const frame = useContext(FrameContext);
    // // const playerRef = useRef<{head: any, hand: any, obj: any}>({head: null, hand: null, obj: null});
    //
    // const eventSystem = useSystem(EventSystem) as EventSystem;
    //
    // const addEntity = (type: string) => {
    //     // console.log('hello')
    //     // const world = ecsStore.ecs;
    //
    //     switch (type) {
    //         case "player":
    //             eventSystem.createEntity(
    //                 Health,
    //                 VehicleEntityComponent,
    //                 Inventory,
    //                 BrainComponent,
    //                 VisionComponent,
    //                 MemoryComponent,
    //             )
    //
    //             // ecs.enqueueAction((sys: System) => {
    //             //     const e = sys.createEntity(
    //             //         Health,
    //             //         VehicleEntityComponent,
    //             //         Inventory,
    //             //         BrainComponent,
    //             //         VisionComponent,
    //             //         MemoryComponent,
    //             //         // RefComponent, {ref: playerRef}
    //             //         // PositionComponent, {position: {x: 0, y: 10, z: 0}},
    //             //     )
    //             //
    //             //     }
    //             // );
    //             break;
    //         case "health":
    //             // ecs.enqueueAction((sys) =>
    //             //     sys.createEntity(Healing, Collectable, StaticEntityComponent,
    //             //         // PositionComponent, {position: {x: 0, y: 10, z: 10}},
    //             //     )
    //             // );
    //             eventSystem.createEntity(Healing, Collectable, StaticEntityComponent,
    //                 // PositionComponent, {position: {x: 0, y: 10, z: 10}},
    //             )
    //             break;
    //         case "gun":
    //             // ecs.enqueueAction((sys) => sys.createEntity(Collectable, Weapon, {
    //             //     ammo: 10,
    //             //     maxAmmo: 10
    //             // }, StaticEntityComponent));
    //             eventSystem.createEntity(
    //                 Collectable,
    //                 Weapon, {
    //                     ammo: 10,
    //                     maxAmmo: 10
    //                 }, StaticEntityComponent);
    //             break;
    //         case "ammo":
    //             eventSystem.createEntity(Collectable, StaticEntityComponent)
    //             break;
    //         case "obstacle":
    //             eventSystem.createEntity(
    //                 StaticEntityComponent,
    //                 Obstacle, {width: 100, depth: 100}
    //             )
    //             break;
    //     }
    //
    //     // frame.setFrame(frame.frame + 1);
    //
    // }
    // //
    // // useEffect(() => {
    // //     console.log(world)
    // // }, [world])
    //
    // const extraButtons = actions?.map((action: { name: any, action: any }) => <button
    //     className={"w3-bar-item w3-button"}
    //     onClick={action.action} key={action.name}
    // >{action.name}</button>)

    return <div
        className={"w3-bar w3-black"}
        style={{top: 0, position: "absolute", display: "flex", zIndex: 999}}
    >
        {/*<NewPlayerButton />*/}
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => addEntity("player")}*/}
        {/*>*/}
        {/*    Player*/}
        {/*</button>*/}
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => addEntity("health")}*/}
        {/*>*/}
        {/*    Health*/}
        {/*</button>*/}
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => addEntity("gun")}*/}
        {/*>*/}
        {/*    Gun*/}
        {/*</button>*/}
        {/*<button*/}
        {/*    className={"w3-bar-item w3-button"}*/}
        {/*    onClick={() => addEntity("obstacle")}*/}
        {/*>*/}
        {/*    Obstacle*/}
        {/*</button>*/}
        {/*{extraButtons}*/}
        {children}
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

