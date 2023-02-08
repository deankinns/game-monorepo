import Link from "next/link";
import {Toolbar as TB, NewEntityButton} from 'becsy-ui'
import {useEntities} from "@/hooks/useEntities";
import {useToolbar} from "@/hooks/useToolbar";
import {useDebug} from "fiber-package";
import React from "react";

export default function Toolbar() {

    const [children] = useToolbar(state => ([state.children]));
    const toggleDebug = useDebug(state => state.toggleDebug);

    return (
        <TB>
            <Link href='/'>Home</Link>
            <Link href='/info'>Info</Link>
            <Link href='/game'>Game</Link>
            {children}
            <button onClick={toggleDebug}>Debug</button>
        </TB>
    )
}