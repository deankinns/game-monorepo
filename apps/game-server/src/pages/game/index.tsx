import React from "react";
import Link from "next/link";
import App from "@/pages/game/_app";
import {Box} from "@react-three/drei";
import {Toolbar} from "becsy-ui";
import dynamic from "next/dynamic";
import {useEntities} from "@/hooks/useEntities";

const GameWorld = dynamic(() => import('@/components/canvas/GameWorld'), {ssr: false})

export default function Page() {
    const [state, setState] = React.useState(0)

    const [ids, add, remove] = useEntities(state => ([state.ids, state.add, state.remove]));
    return ( <div>
            <button onClick={() => add(Date.now() + 'dave')}>+</button>
            <span>{ids.length}</span>
            <button onClick={() => remove(ids[0])}>-</button>
        </div>
        // <Toolbar>
        //     <Link href={'/'} passHref>
        //         <a className={'w3-bar-item w3-button'}>Home</a>
        //     </Link>
        //     <Link href={'/info'} passHref>
        //         <a className={'w3-bar-item w3-button'}>Info</a>
        //     </Link>
        //
        // </Toolbar>
    );
}


Page.canvas = (props: any) => {
    return <Box />
}

Page.hideWorld = true

Page.toolbar = (props: any) => {
    return <Toolbar>
        <Link href={'/'} passHref>
            <a className={'w3-bar-item w3-button'}>Home</a>
        </Link>
        <Link href={'/info'} passHref>
            <a className={'w3-bar-item w3-button'}>Info</a>
        </Link>
    </Toolbar>
}