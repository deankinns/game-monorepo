import { useRef, forwardRef } from 'react'
import {mergeRefs} from 'react-merge-refs'

import { SidePanel, SelectedEntity} from "becsy-ui";
import Link from "next/link";
// import Toolbar from "@/components/dom/Toolbar";
import dynamic from "next/dynamic";

const Toolbar = dynamic(() => import('@/components/dom/Toolbar'), {ssr: true})

const Layout = forwardRef(({ children, ...props }: any, ref) => {
    const localRef = useRef()
    console.log(props)
    return (
        <div
            ref={mergeRefs([ref, localRef])}
            style={{width: '100vw', height: '100vh'}}
            >
            {children}
            <Toolbar />
            <SidePanel />
            <SelectedEntity />
        </div>
    )
})
Layout.displayName = 'Layout'

export default Layout