import { Scene3D } from "enable3d";
import { SkeletonTool } from "./SkeletonTool";

export class MainScene extends Scene3D {
  controls: any;

  constructor() {
    // define the key and if you want it to be an WebXR scene or not
    super({ key: "MainScene", enableXR: false });
  }
  initializeScene(plugins: any) {
    plugins.camera.far = 100000000;
    plugins.camera.near = 0.1;
    super.initializeScene(plugins);
  }

  async preload() {
    // SkeletonTool.populate(this)
  }

  async create() {
    // const ws = await this.warpSpeed();
    // this.haveSomeFun()
    // this.controls = ws.orbitControls;
  }
}

export class LoaderScene extends Scene3D {
  async create() {
    setTimeout(() => this.start("MainScene", { level: 1 }), 1000);
  }
}
