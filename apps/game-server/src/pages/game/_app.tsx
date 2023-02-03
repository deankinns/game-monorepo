import {Box, OrbitControls} from "@react-three/drei";
import Layout from "@/components/dom/Layout";
import * as React from "react";
import dynamic from "next/dynamic";
import {useRef} from "react";
import Link from "next/link";
import {Toolbar, NewEntityButton} from 'becsy-ui'



const Scene = dynamic(() => import('@/components/canvas/Scene'), {ssr: true})

export default function App({ Component, pageProps }: any) {
    const ref = useRef()

    return <Layout ref={ref} >
        <Component {...pageProps} />
        {Component?.canvas && (
            <Scene
                className='pointer-events-none'
                eventSource={ref}
                eventPrefix='client'
            >
                {Component.canvas(pageProps)}
                <OrbitControls />
            </Scene>
        )}
    </Layout>
}
