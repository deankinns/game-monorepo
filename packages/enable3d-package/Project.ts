// import { Project as RootProject } from "enable3d";
// import {Scene3D} from "enable3d/dist/scene3d";
// import { ThreeGraphicsConfig } from '@enable3d/common/dist/types';
// import {Cache, PCFSoftShadowMap, Scene, WebGLRenderer,PerspectiveCamera, OrthographicCamera} from 'three';
// import Cameras from "@enable3d/three-graphics/jsm/plugins/cameras";
// import {AmmoPhysics} from "@enable3d/ammo-physics";
// import { logger } from '@enable3d/common/dist/logger';
// import {ThreeGraphics} from "@enable3d/three-graphics";
//
// interface Scene3DConfig extends Omit<ThreeGraphicsConfig,  'usePhysics' | 'enableXR'> {
//     parent?: string;
//     scenes: typeof Scene3D[];
//     scene: Scene;
// }
//
// interface iProject extends RootProject{
//
// }
//
// export class Project implements RootProject, Partial<ThreeGraphics>{
//     cache: typeof Cache;
//     camera: PerspectiveCamera | OrthographicCamera;
//     cameras: Cameras;
//     canvas: HTMLCanvasElement;
//     parent: HTMLElement;
//     physics: AmmoPhysics;
//     private projectConfig;
//     renderer: WebGLRenderer;
//     scene: Scene;
//     scenes: Map<string, Scene3D>;
//     protected textureAnisotropy: number;
//     protected threeGraphicsConfig: Types.ThreeGraphicsConfig;
//
//     constructor(threeGraphicsConfig: Scene3DConfig) {
//         console.log('project')
//         this.threeGraphicsConfig = threeGraphicsConfig;
//         const { alpha = false, anisotropy = 1, camera, antialias = false, usePhysics = true, renderer, scene } = threeGraphicsConfig;
//         this.textureAnisotropy = anisotropy;
//         this.camera = camera ||  Cameras.Perspective({ z: 25, y: 5 });
//         this.scene = scene || new Scene();
//         // this.renderer.physicallyCorrectLights = true
//         this.renderer = renderer || new WebGLRenderer({ antialias, alpha });
//         // see https://threejs.org/docs/#examples/en/loaders/GLTFLoader
//         // this.renderer.outputEncoding = sRGBEncoding
//         // shadow
//         this.renderer.shadowMap.enabled = true;
//         this.renderer.shadowMap.type = PCFSoftShadowMap;
//         // enable cache
//         this.cache = Cache;
//         this.cache.enabled = true;
//         if (usePhysics) {
//             if (typeof Ammo !== 'undefined')
//                 this.physics = new AmmoPhysics(this.scene, /*threeGraphicsConfig*/);
//             else
//                 logger('Are you sure you included ammo.js?');
//         }
//
//         this.projectConfig = threeGraphicsConfig;
//         this.scenes = new Map();
//         this.renderer.setSize(window.innerWidth, window.innerHeight);
//         if (this.projectConfig.parent)
//             this.parent = document.getElementById(this.projectConfig.parent);
//         else
//             this.parent = document.body;
//         if (!this.parent) {
//             logger(`Parent "${this.projectConfig.parent}" not found! Will add it to the body.`);
//             this.parent = document.body;
//         }
//         // this.parent.appendChild(this.renderer.domElement);
//         this.canvas = this.renderer.domElement;
//         let firstSceneKey = '';
//         this.projectConfig.scenes.forEach((scene, i) => {
//             const s = new scene();
//             if (i === 0)
//                 firstSceneKey = s.sceneKey;
//             const plug = {
//                 // scene configuration
//                 sceneConfig: {
//                     textureAnisotropy: this.textureAnisotropy,
//                     autoStart: false
//                 },
//                 // add core features from three-graphicsconfig: {
//                 renderer: this.renderer,
//                 parent: this.parent,
//                 canvas: this.canvas,
//                 scene: this.scene,
//                 scenes: this.scenes,
//                 camera: this.camera,
//                 cache: this.cache,
//                 physics: this.physics
//             };
//             s.initializeScene(plug);
//             if (i === 0) {
//                 s.setSize(this.parent.clientWidth, this.parent.clientHeight);
//                 s.setPixelRatio(Math.max(1, window.devicePixelRatio / 2));
//             }
//             this.scenes.set(s.sceneKey, s);
//         });
//         // start the first scene
//         this.scenes.get(firstSceneKey)?.start(firstSceneKey);
//     }
// }
