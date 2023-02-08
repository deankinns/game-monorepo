import {useEcsStore} from "react-becsy";
import {useEffect, useRef} from "react";
import * as React from "react";
import dynamic from "next/dynamic";
import {useNavMesh} from "react-yuka";
import {NavMeshComponent, } from "becsy-yuka-package";
import {PathPlanner} from 'yuka-package';

// import 'ui/w3.css';
import '../style/style.scss'

import 'becsy-package/systems';
import 'becsy-yuka-package/systems';
import 'becsy-fiber/systems';

import Layout from '@/components/dom/Layout'

const Scene = dynamic(() => import('@/components/canvas/Scene'), {ssr: true})
const GameWorld = dynamic(() => import('@/components/canvas/GameWorld'), {ssr: false})

export default function App({Component, pageProps}: any) {
    const ref = useRef()
    const [create] = useEcsStore(state => ([state.create]));
    const navMesh = useNavMesh(state => state.navMesh);

    useEffect(() => {create([], world => {
        world.build(s => {
            const pathPlanner = new PathPlanner(navMesh);
            s.createEntity(NavMeshComponent, {navMesh, pathPlanner});
        })
    })}, [create])

    // @ts-ignore
    return <Layout ref={ref}>
        {Component?.canvas && (
            <Scene
                className='pointer-events-none'
                eventSource={ref}
                eventPrefix='client'
            >
                {Component.canvas(pageProps)}
                {Component.hideWorld ? null : <GameWorld />}
            </Scene>
        )}
        <Component {...pageProps} />
    </Layout>
}