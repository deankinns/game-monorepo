import {useEffect, useRef} from "react";
import Stats from "three/examples/jsm/libs/stats.module";
import {useFrame} from "@react-three/fiber";
import {useEcsStore} from "react-becsy";

export const FrameCount = () => {

    const stats = useRef<Stats>(null!);
    const update = useEcsStore(state => state.update);

    useEffect(() => {
        stats.current = Stats()
        stats.current.dom.style.cssText =
            "position:absolute;bottom:0;right:0;cursor:pointer;opacity:0.9;z-index:10000";
        document.body.appendChild(stats.current.dom);
    }, [])

    // const world = useContext(ECSContext);
    useFrame((state, delta, frame) => {
        stats.current?.end();
        update(frame, delta);
        // world?.update(state.clock.elapsedTime, delta);
        // update(state.clock.elapsedTime, delta);
        stats.current?.begin();
    });
    return null;
};