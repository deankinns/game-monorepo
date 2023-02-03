import * as React from "react";
import {Button} from "ui/Button";
import Link from 'next/link';
import {Render} from 'becsy-package'
import {useSystem} from "react-becsy";
import "becsy-package/systems";
import dynamic from "next/dynamic";
import {useEffect} from "react";

const Logo = dynamic(() => import('@/components/canvas/Logo'), {ssr: false})

export default function Page() {
    const renderSystem = useSystem(Render) as Render;
    const [state, setState] = React.useState(renderSystem?.items.current.length)
    //
    // useEffect(() => {
    //     // Page.canvas.
    //     console.log(Page.canvas)
    // })

    return (
        <div>
            <Link href="/info">Info</Link>
            <Link href="/game">Game</Link>
            <h1>Store</h1>
            <Button/>
            <button onClick={() => {
                renderSystem.newEntity()
                setState(renderSystem.items.current.length)
            }}>{state}</button>
        </div>
    );
}

Page.canvas = (props: any) => <Logo scale={0.5} route='/info' position-y={-1}/>

Page.hideWorld = true
