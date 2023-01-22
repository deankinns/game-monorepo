import * as React from "react";
import {Button} from "ui/Button";
import Link from 'next/link';
import {GameWorld} from "becsy-package";
import {useEffect} from "react";
import {Render} from 'becsy-package'
import {EntityManagerSystem} from 'becsy-yuka-package'
import {useEcsStore, useSystem} from "react-becsy";

import "becsy-package/systems";
// import "becsy-yuka-package/systems";

export async function getStaticProps() {

    // const renderRef = React.createRef<any>();
    // const managerRef = React.createRef<any>();
    // //
    // // useEcsStore.getState().create([], (world) => {
    // //     world.createEntity();
    // // })
    //
    // // const create = useEcsStore(state => state.create);
    //
    // const world = {}
    // // const world = new GameWorld();
    // // await world.makeWorld([
    // //     Render, {reference: renderRef},
    // //     EntityManagerSystem, {reference: managerRef}
    // // ])
    //
    // return {props: {world, renderRef, managerRef}};

    // const renderSystem = useSystem(Render) as Render;

    return {props: {}};
}

export default function Store() {
    const [count, setCount] = React.useState(0);
    let loaded = false
    const [ecs, update, create] = useEcsStore(state => ([state.ecs, state.update, state.create]));

    const renderSystem = useSystem(Render) as Render;

    useEffect(() => {
        create([], (world) => {
            world.createEntity();
        })
    }, [create])

    // console.log(ecs)
    // const world = React.useRef<GameWorld>();
    //
    // const renderRef = React.useRef<any>(null);
    // const managerRef = React.useRef<any>(null);


    // useEffect(() => {
    //     try {
    //         world.current = new GameWorld()
    //         world.current.makeWorld([
    //             Render, {reference:  renderRef},
    //             EntityManagerSystem, {reference: managerRef}
    //         ])
    //
    //     } catch (e) {
    //
    //     }
    //
    // }, [])

    // console.log(world)
    // World.create({}).then(world => {
    //     console.log(world);
    //
    // })
    // world.world?.build(s => {
    //     console.log(s);
    //
    // })


    const [state, setState] = React.useState(0)

    const requestRef = React.useRef<any>()

    let prev = 0;
    const animate = (time: number) => {
        try {
            update(time, time - prev)
            prev = time

            const l = renderSystem?.items.current.length;

            if (l !== state) {
                setState(prev => l)
            }
            // setState()
            // world.current?.world?.execute(time, 1)
            // console.log('animate', time)
        } catch (e) {
            console.log(e)
        }

        // The 'state' will always be the initial value here
        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once

    // setCount(count + 1);


    return (
        <div>
            <Link href="/info">Info</Link>

            <h1>Store</h1>
            <Button/>
            <button onClick={() => renderSystem.newEntity()}>{state}</button>

        </div>
    );
}
