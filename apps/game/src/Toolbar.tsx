import React, {useContext} from "react";
import {PlayerContext} from 'becsy-fiber';
import {GameWorldContext} from "becsy-ui";
import {Inventory, Health, Healing, Collectable, Weapon,} from "becsy-package";
import {
    BrainComponent,
    VehicleEntityComponent,
    VisionComponent,
    MemoryComponent,
    StaticEntityComponent
} from "becsy-yuka-package";

export const Toolbar = ({actions}: { actions?: any[] }) => {

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
                world?.enqueueAction((sys) => sys.createEntity(Collectable, Weapon, StaticEntityComponent));
                break;
        }

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