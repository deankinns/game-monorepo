import * as React from "react";
import {GameWorld, RenderComponent, EventSystem, Render} from "becsy-package";
import {EntityListPanel} from "becsy-ui";
import {createRef, useContext, useEffect, useRef, useState,} from "react";

import {useEcsStore,  useECSStore} from "react-becsy";
import {World} from "@lastolivegames/becsy";

// export class GameWindow extends React.Component<any, any> {
//
//
//
//     worldRef: React.RefObject<GameWorld>;
//
//     constructor(props: any) {
//         super(props);
//         this.state = {
//             name: "dave",
//             running: false,
//             frames: 0,
//         };
//
//
//         this.handleChange = this.handleChange.bind(this);
//
//         this.worldRef = createRef();
//
//     }
//
//     async componentDidMount() {
//
//         const self = this;
//         const timer = requestAnimationFrame(function execute() {
//
//             self.worldRef.current?.world?.execute();
//             requestAnimationFrame(execute);
//         });
//     }
//
//
//
//
//     handleChange(event: any) {
//         this.setState({name: event.target.value});
//     }
//
//
//     children = [];
//
//     render() {
//         return (
//             <div id={`gameWindow${this.props.id}`} className={"entities"}>
//                 {/*<GameWorldWrapper ref={this.worldRef}>*/}
//                 {/*    <Toolbar />*/}
//                 {/*    <div*/}
//                 {/*        style={{*/}
//                 {/*            display: "grid",*/}
//                 {/*            gridTemplateColumns: "1fr 1fr 1fr 1fr",*/}
//                 {/*            gridGap: "1vw",*/}
//                 {/*        }}*/}
//                 {/*    >*/}
//                 {/*        <EntityList />*/}
//                 {/*    </div>*/}
//                 {/*</GameWorldWrapper>*/}
//             </div>
//         );
//     }
// }

export const GameWindow = (props: any) => {
    const renderRef = useRef<Render>(null!);
    const [render, setRender] = React.useState<any>(null!);
    // const ECS = useECS([
    //     Render, {reference: renderRef}
    // ], () => setRender(renderRef.current));

    const ecsStore = useEcsStore();

    useEffect(() => {
        ecsStore.create([
            Render, {reference: renderRef}
        ], () => setRender(renderRef.current));
    }, []);

    return <>
        <Counter/>
        <Toolbar/>
        <div>hello</div>
        {/*<RenderContext.Provider value={render}>*/}
            <EntityListPanel/>
        {/*</RenderContext.Provider>*/}
    </>
}

const Counter = () => {
    const [count, setCount] = useState(0)

    const ECS = useEcsStore().ecs;
    // const ECS = useContext(ECSContext);

    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);

    const animate = (time: number) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;

            // Pass on a function to the setter of the state
            // to make sure we always have the latest state
            setCount(prevCount => (prevCount + deltaTime * 0.01) % 100);

            ECS.update(time, deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once

    return <div>{Math.round(count)}</div>
}

const Toolbar = () => {
    // const world = useContext(GameWorldContext)
    // const world = useContext(ECSContext);
    const world = useEcsStore().ecs;
    const [running, setRunning] = React.useState(false);

    const addEntity = () => {
        world?.enqueueAction(
            (sys: any) => {
                sys.createEntity(RenderComponent, {name: "dave"});
            }
        )
    }

    return <div className={"toolbar"}>
        <button onClick={() => setRunning(!running)}>{running ? 'stop' : 'start'}</button>
        <button onClick={() => addEntity()}>Add</button>
    </div>
}
