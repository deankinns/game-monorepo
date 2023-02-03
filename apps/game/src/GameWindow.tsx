import React, {useEffect} from "react";
import {
    Collectable,
    Healing,
    Health,
    Inventory,

    Weapon
} from "becsy-package";
import { World} from "@lastolivegames/becsy";

import "becsy-package/systems";
import "becsy-fiber/systems";
import "becsy-yuka-package/systems";

import {
    BrainComponent,
    MemoryComponent,
    VisionComponent,
    NavMeshComponent,
    VehicleEntityComponent,
    StaticEntityComponent,
} from "becsy-yuka-package";

import {PathPlanner} from "yuka-package";

// import {PlayerContext} from 'becsy-fiber';
import {SelectedEntity, SidePanel, Toolbar, NewEntityButton} from "becsy-ui";

import {useEcsStore} from "react-becsy";
import {useDebug} from "fiber-package";
import {useNavMesh} from "react-yuka";
import {GameCanvas} from "./GameCanvas";

// componentRegistry.Health = Health;
// componentRegistry.Packed = Packed;
// componentRegistry.Healing = Healing;
// componentRegistry.BrainComponent = BrainComponent;
// componentRegistry.Collectable = Collectable;
// componentRegistry.Target = Target;
// componentRegistry.PathRequestComponent = PathRequestComponent;
// componentRegistry.PathComponent = PathComponent;
// componentRegistry.MemoryComponent = MemoryComponent;
// componentRegistry.State = State;
// componentRegistry.Weapon = Weapon;
// componentRegistry.PositionComponent = PositionComponent;
// componentRegistry.Selected = Selected;
// componentRegistry.ToBeDeleted = ToBeDeleted;
// componentRegistry.Render = Render;
// componentRegistry.VehicleEntityComponent = VehicleEntityComponent;
// componentRegistry.NavMeshComponent = NavMeshComponent;
// componentRegistry.Inventory = Inventory;
// componentRegistry.GameEntityComponent = GameEntityComponent;

let loaded = false;

export const GameWindow = () => {

    // const [player, setPlayer] = React.useState<Entity>(null!);
    const navMesh = useNavMesh(state => state.navMesh);
    const [orbit, setOrbit] = React.useState(true);
    const create = useEcsStore((state) => state.create);


    useEffect(() => {
        if (loaded) return;
        loaded = true;
        create([
            // Render, {reference: renderRef},
            // EntityManagerSystem, {reference: managerRef, timeMultiplier: 1}
        ], (world: World) => {
            world.build((s) => {
                // setPlayer(s.createEntity().hold());

                const pathPlanner = new PathPlanner(navMesh);

                s.createEntity(NavMeshComponent, {navMesh, pathPlanner});
                // setFrame(s.time);

                // @ts-ignore
                // managerRef.current.pathPlanner = new PathPlanner(nav)
                // setRender(renderRef.current)
            })
        })
    }, [create, navMesh]);

    const toggleDebug = useDebug(state => state.toggleDebug);


    return (<div className={"w3-display-container"}>
        <div id={`gameWindow`}>
            <GameCanvas orbit={orbit}/>
        </div>

        <Toolbar>
            <NewEntityButton components={[
                Health,
                VehicleEntityComponent,
                Inventory,
                BrainComponent,
                VisionComponent,
                MemoryComponent,
            ]}>Player</NewEntityButton>
            <NewEntityButton
                components={[Healing, Collectable, StaticEntityComponent]}>Health</NewEntityButton>
            <NewEntityButton components={[Collectable, Weapon, {
                ammo: 10,
                maxAmmo: 10
            }, StaticEntityComponent]}>Gun</NewEntityButton>
            <button onClick={toggleDebug}>Debug</button>
            <button onClick={() => setOrbit(!orbit)}>{orbit ? 'Orbit' : 'First Person'}</button>
        </Toolbar>

        <SelectedEntity/>

        <SidePanel/>

    </div>);
}



