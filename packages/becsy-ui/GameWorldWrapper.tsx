import * as React from "react";
import {World} from "@lastolivegames/becsy";
import {RefObject, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import {Render, GameWorld} from "becsy-package";

// export const EventContext = React.createContext<any[]>([]);
export const GameWorldContext = React.createContext<GameWorld | null>(null);
// export const GameWorldRefContext = React.createContext<RefObject<GameWorld | null>>(new RefObject<GameWorld | null>(null));

export const RenderContext = React.createContext<Render | null>(null);

export const GameWorldWrapper = forwardRef((
    {children, defs,/* world,*/ buildCallback, animate}:
        {
            children: React.ReactNode,
            defs?: any[],
            // world?: GameWorld,
            buildCallback?: (world: World) => void,
            animate?: FrameRequestCallback,
        }
, ref) => {

    const worldRef = React.useRef<GameWorld>(/*world ??*/ new GameWorld());
    const [world, setWorld] = React.useState<GameWorld>(worldRef.current);

    // const [running, setRunning] = React.useState(false);
    // const gameWorld = new GameWorld()
    // const [frame, setFrame] = React.useState(0);

    const [render, setRender] = React.useState<Render | null>(null);

    const renderRef = useRef<Render | null>(null);
    // defs = [...defs ? defs : [], Render, {reference: renderRef}];



    useEffect(() => {
        worldRef.current.makeWorld([
            ...defs ? defs : [],
            Render, {reference: renderRef}
        ]).then((world: World) => {
            setRender(renderRef.current);
            buildCallback ? buildCallback(world) : null;
            // console.log('world loaded', world);
            // setWorld(worldRef.current);
        });



    }, [world]);

    const selected = []

    useImperativeHandle(ref, () => {
        return world;
    })

    // console.log(render)
    return <GameWorldContext.Provider value={world}>
        <RenderContext.Provider value={render}>
            {children}
        </RenderContext.Provider>
    </GameWorldContext.Provider>;

})


