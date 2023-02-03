import Link from "next/link";
import {Toolbar as TB, NewEntityButton} from 'becsy-ui'
import {useEntities} from "@/hooks/useEntities";
import {useToolbar} from "@/hooks/useToolbar";

export default function Toolbar() {

    const [children] = useToolbar(state => ([state.children]));

    return (
        <TB>
            <Link href='/'>Home</Link>
            <Link href='/info'>Info</Link>
            <Link href='/game'>Game</Link>
            {children}
        </TB>
    )
}