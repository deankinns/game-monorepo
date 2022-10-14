import * as React from "react";
import {Suspense} from "react";
import {useFrame, Canvas, ReconcilerRoot,} from "@react-three/fiber";
import {Physics, RigidBody, Debug,} from "@react-three/rapier";
import {DemoScene} from "./DemoScene";
import Stats from "three/examples/jsm/libs/stats.module";
import {TreeView} from "three-ui";
import {MarchingCubesScene} from "./MarchingCubes";
import {OrbitControls} from "@react-three/drei";

const stats = Stats();
stats.dom.style.cssText =
    "position:absolute;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
document.body.appendChild(stats.dom);


export class GameWindow extends React.Component<any, any> {

    private root: ReconcilerRoot<HTMLCanvasElement> | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            frame: 0,
            debug: true,
        };
    }

    componentDidMount() {

    }

    debug = false;

    scene: THREE.Object3D | undefined;

    render() {

        return (
            <div style={{display: "grid"}}>
                <Canvas onCreated={(state) => {
                    this.scene = state.scene
                    state.camera.far = 100000000;
                }}>
                    <OrbitControls />
                    <Suspense fallback={null}>
                        <Physics>
                            {this.state.debug ? <Debug/> : null}
                            <DemoScene/>
                            {/*<MarchingCubesScene*/}
                            {/*    resolution={40}*/}
                            {/*    maxPolyCount={40000}*/}
                            {/*    planeX={false}*/}
                            {/*    planeY={true}*/}
                            {/*    planeZ={false}*/}
                            {/*/>*/}
                        </Physics>
                    </Suspense>
                    <FrameCount/>
                </Canvas>
                <div
                    className={"toolbar"}
                    style={{position: "absolute", display: "flex"}}
                >
                    <button onClick={() => this.setState({debug: !this.state.debug})}>
                        debug {this.state.debug ? "on" : "off"}
                    </button>
                    <span>{this.state.frame}</span>
                </div>
                <TreeView scene={this.scene}/>
            </div>
        );
    }
}

const FrameCount = () => {
    useFrame(() => stats.update());
    return null;
};
