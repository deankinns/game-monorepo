import * as React from "react";
import { Suspense } from "react";
import {
  useFrame,
  Canvas,
  ReconcilerRoot,
} from "@react-three/fiber";

import {
  Physics,
  RigidBody,
  Debug,
} from "@react-three/rapier";
import { DemoScene } from "./DemoScene";

import { ProjectPanel, Dummy, Box, House } from "enable3d-fiber-package";

import { useControls } from "leva";
import Stats from "three/examples/jsm/libs/stats.module";
import { Capsule } from "@react-three/drei";

import { TreeView } from "enable3d-ui";

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
      <div style={{ display: "grid" }}>
        <Canvas onCreated={(state) => (this.scene = state.scene)}>
          <Suspense fallback={null}>
            <Physics>
              {this.state.debug ? <Debug /> : null}
              <DemoScene />

              <RigidBody
                colliders="hull"
                position={[0, 5, 0]}
                enabledRotations={[false, true, false]}
              >
                <Suspense fallback={null}>
                  <Dummy name={'steve'}  />
                </Suspense>

                <Capsule args={[0.5, 2.5]}>
                  <meshBasicMaterial color={"green"} visible={false} />
                </Capsule>
                {/*<CapsuleCollider args={[1,3]} />*/}
              </RigidBody>
              <RigidBody
                colliders="hull"
                position={[5, 5, 0]}
                enabledRotations={[false, true, false]}
              >
                <Suspense fallback={null}>
                  <Dummy name={'dave'} />
                </Suspense>

                <Capsule args={[0.5, 2.5]}>
                  <meshBasicMaterial color={"green"} visible={false} />
                </Capsule>
              </RigidBody>

              <RigidBody lockTranslations={true} lockRotations={true}>
                <House />
              </RigidBody>
            </Physics>
          </Suspense>
          <FrameCount />
        </Canvas>
        <div
          className={"toolbar"}
          style={{ position: "absolute", display: "flex" }}
        >
          <button onClick={() => this.setState({ debug: !this.state.debug })}>
            debug
          </button>
          <span>{this.state.frame}</span>
        </div>
        <TreeView scene={this.scene} />
      </div>
    );
  }
}

const FrameCount = () => {
  useFrame(() => stats.update());
  return <></>;
};
