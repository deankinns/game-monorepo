import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {OrbitControls} from '@react-three/drei'

import {Toolbar, NewEntityButton} from 'becsy-ui'
import {useEntities} from "@/hooks/useEntities";
import {randomBytes} from "crypto";
import {Health, Inventory, Weapon, Healing, Collectable} from "becsy-package";
import {
    BrainComponent,
    MemoryComponent,
    VehicleEntityComponent,
    VisionComponent,
    StaticEntityComponent
} from "becsy-yuka-package";
import {useToolbar} from "@/hooks/useToolbar";
import {useEffect} from "react";
// import GameWorld from "@/components/canvas/GameWorld";

// const Terrain = dynamic(() => import('@/components/canvas/Terrain'), {ssr: false})
// const GameEntities = dynamic(() => import('@/components/canvas/GameEntities'), {ssr: false})

const GameWorld = dynamic(() => import('@/components/canvas/GameWorld'), {ssr: false})

export default function Store() {

    const [setToolbarButtons] = useToolbar(state => ([state.setToolbarButtons]));

    useEffect(() => {
        setToolbarButtons(<>
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
        </>)

        return () => setToolbarButtons(null)
    }, [])


    return <p>Info</p>
    // const [ids, add, remove] = useEntities(state => ([state.ids, state.add, state.remove]));
    //
    // return <p>hello</p>;
    //
    // return (
    //     <Toolbar>
    //         <Link href={'/'} passHref>
    //             <a className={'w3-bar-item w3-button'}>Home</a>
    //         </Link>
    //         <Link href={'/game'} passHref>
    //             <a className={'w3-bar-item w3-button'}>game</a>
    //         </Link>
    //         <button onClick={() => add(Date.now() + 'dave')}>+</button>
    //         <span>{ids.length}</span>
    //         <button onClick={() => remove(ids[0])}>-</button>
    //
    //         <NewEntityButton components={[
    //             Health,
    //             VehicleEntityComponent,
    //             Inventory,
    //             BrainComponent,
    //             VisionComponent,
    //             MemoryComponent,
    //         ]}>Player</NewEntityButton>
    //         <NewEntityButton
    //             components={[Healing, Collectable, StaticEntityComponent]}>Health</NewEntityButton>
    //         <NewEntityButton components={[Collectable, Weapon, {
    //             ammo: 10,
    //             maxAmmo: 10
    //         }, StaticEntityComponent]}>Gun</NewEntityButton>
    //     </Toolbar>
    // );
}

Store.canvas = () =>  <>
        <OrbitControls/>
    </>


Store.toolbar = () => <>
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
</>