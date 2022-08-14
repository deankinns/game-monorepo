import * as React from "react";
import { Suspense } from "react";
import { Scene3D } from "enable3d";
import { THREE } from "enable3d";
import { Canvas, extend, useFrame } from "@react-three/fiber";
// import { AmmoPhysics } from "@enable3d/ammo-physics";

extend(THREE);

export const ProjectPanel = (props: { scene: Scene3D; children?: any[] }) => {
  return (
    <Canvas
      id={"gameCanvas"}
      gl={(canvas) =>
        new THREE.WebGLRenderer({ canvas, logarithmicDepthBuffer: true })
      }
      onCreated={async (state) => {
        const parent = document.body;
        // const physics = new AmmoPhysics(state.scene);
        const plug = {
          // scene configuration
          sceneConfig: {
            textureAnisotropy: 1,
            autoStart: false,
          },
          // add core features from three-graphicsconfig: {
          renderer: state.gl,
          parent: parent,
          canvas: state.gl.domElement,
          scene: state.scene,
          // scenes: this.scenes,
          camera: state.camera,
          cache: THREE.Cache,
          // physics, //: this.physics
        };

        await props.scene.initializeScene(plug);
        await props.scene.init();
        // @ts-ignore
        await props.scene._preload();
        // @ts-ignore
        await props.scene._create();
        // @ts-ignore
        props.scene._isRunning = true;

        //@ts-ignore
        state.set({ scene3d: props.scene });
      }}
    >
      <PhysicsWrapper scene={props.scene} />
      {props.children}
    </Canvas>
  );
};

const PhysicsWrapper = (props: { scene: Scene3D }) => {
  // useFrame(() => console.log('hello'), -1);
  useFrame(async (callback, delta) => {
    const time = callback.clock.elapsedTime;
    const d = delta * 1000;
    // const time = callback.clock.elapsedTime
    // // // const delta = callback.clock.delta
    props.scene.update?.(parseFloat(time.toFixed(3)), parseInt(d.toString()));
    await props.scene.physics?.update(d);
    await props.scene.physics?.updateDebugger();
    await props.scene.animationMixers.update(d);
    // props.scene.preRender();
    // if (props.scene.composer)
    //     props.scene.composer.render();
    // else
    //     this.renderer.render(this.scene, this.camera);
    // this.postRender();
  }, -100);
  return null;
};
