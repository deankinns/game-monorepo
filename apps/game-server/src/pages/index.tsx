import * as React from "react";
import {Button} from "ui/Button";
import Link from 'next/link';
import {GameWorld} from "becsy-package";
import {useEffect} from "react";
import {Render} from 'becsy-package'
import {EntityManagerSystem} from 'becsy-yuka-package'


export async function getStaticProps() {

    const renderRef = React.createRef<any>();
    const managerRef = React.createRef<any>();

    const world = {}
    // const world = new GameWorld();
    // await world.makeWorld([
    //     Render, {reference: renderRef},
    //     EntityManagerSystem, {reference: managerRef}
    // ])

    return {props: {world, renderRef, managerRef}};
}

export default function Store({world, renderRef, managerRef}: {world: GameWorld, renderRef: React.RefObject<any>, managerRef: React.RefObject<any>}) {
    const [count, setCount] = React.useState(0);
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

    const animate = (time: number) => {
        try {
            // world.current?.world?.execute(time, 1)

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
            <button onClick={() => setCount(count + 1)}>{count}</button>

        </div>
    );
}
