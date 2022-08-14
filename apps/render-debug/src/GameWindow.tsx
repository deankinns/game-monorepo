import * as React from "react";
import { Suspense } from "react";
// import { Project, PhysicsLoader, Scene3D, THREE } from "enable3d";
import { Vector3 } from "three";
// import { MainScene, LoaderScene, Vehicle } from "enable3d-package";
import {
  createRoot,
  events,
  useFrame,
  Canvas,
  createPortal,
  ReconcilerRoot,
  unmountComponentAtNode,
  render,
} from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import {
  Physics,
  RigidBody,
  Debug,
  CapsuleCollider,
  MeshCollider,
} from "@react-three/rapier";
import { DemoScene } from "./DemoScene";
import { Chair } from "enable3d-fiber-package";
import { ProjectPanel, Dummy, Box, House } from "enable3d-fiber-package";
import { useControls } from "leva";
import Stats from "three/examples/jsm/libs/stats.module";
import { Capsule } from "@react-three/drei";

import { TreeView } from "enable3d-ui";

const stats = Stats();
stats.dom.style.cssText =
  "position:absolute;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
document.body.appendChild(stats.dom);

// import {render} from '@react-three/fiber'

export class GameWindow extends React.Component<any, any> {
  project: any;
  private root: ReconcilerRoot<HTMLCanvasElement> | undefined;

  // scene: Scene3D;

  constructor(props: any) {
    super(props);

    this.state = {
      frame: 0,
      debug: true,
    };

    // this.scene = new MainScene();
  }

  componentDidMount() {
    // this.scene.update = () => {
    //     stats.update()
    // }
    // // const ele = (document.getElementById('gameWindowCanvas') as HTMLCanvasElement)
    // const project = new Project({
    //     scenes: [ MainScene],
    //     parent: `gameWindow${this.props.id}`
    //     // canvas: ele
    // })
    // this.project = project;
    // setTimeout(() => {
    //     for (const scene of project.scenes) {
    //         const o = scene[1].add.box();
    //         const p = createPortal(
    //             <DemoScene scene={scene[1]}/>,
    //             o,
    //             {}
    //         )
    //
    //         // render(p, project.canvas, {})
    //
    //         // console.log(p)
    //         // p.render()
    //     }
    // },10)
    //
    // const root = createRoot(project.renderer.domElement);
    // root.configure({
    //     camera: project.camera,
    //     gl: project.renderer,
    //     events,
    //     shadows: true,
    // })
    // let sceneObj: Scene3D;
    // for (const scene of project.scenes) {
    //     sceneObj = scene[1]
    //     sceneObj.update = (_time, _delta) => {
    //         this.setState({frame: _time})
    //     }
    //     break;
    // }
    // this.root = root
    //
    // // @ts-ignore
    // const vehicle = new Vehicle(sceneObj, {position: new Vector3(0, 10, 0)});
    //
    // setTimeout(() => {
    //     root.render(<>
    //             <ProjectPanel project={this.project as Project} />
    //             <DemoScene scene={sceneObj}/>
    //         </>
    //     );
    // }, 0);
    // console.log(this.project)
  }

  debug = false;

  // toggleDebug() {
  //     this.debug = !this.debug;
  //     // this.projectRef.current.project.physics;
  //
  //
  //     // this.refs.projectPanel.state.scene;
  //     const physics = this.scene?.physics as any;
  //     physics.debug.mode(1 + 2048 + 4096);
  //     if (this.debug) {
  //         physics.debug?.enable();
  //     } else {
  //         physics.debug.disable();
  //     }
  // }

  // projectRef = React.createRef();

  scene: THREE.Object3D | undefined;

  render() {
    // return null

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
                  {/*<MeshCollider type="hull">*/}
                  <Dummy name={'steve'}  />
                  {/*<Dummy position={[0,0,5]} />*/}
                  {/*</MeshCollider>*/}
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
                  {/*<MeshCollider type="hull">*/}
                  <Dummy name={'dave'} />
                  {/*<Dummy position={[0,0,5]} />*/}
                  {/*</MeshCollider>*/}
                </Suspense>

                <Capsule args={[0.5, 2.5]}>
                  <meshBasicMaterial color={"green"} visible={false} />
                </Capsule>
                {/*<CapsuleCollider args={[1,3]} />*/}
              </RigidBody>

              <RigidBody lockTranslations={true} lockRotations={true}>
                <House />
              </RigidBody>
            </Physics>
          </Suspense>
          <FrameCount />
          {/*<PhysicsStats />*/}
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
