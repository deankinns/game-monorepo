// import {Entity, System, system} from "@lastolivegames/becsy";
// import {CameraComponent, ControlComponent} from "../components";
// import {SceneComponent} from "../components/Scene";
// import {Mouse, Keyboard, Target, Health, Healing} from "becsy-package";
// import {MainScene} from "enable3d-package";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// // import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
// import {FirstPersonControls} from "enable3d";
// import {Object3DComponent} from "../components/Obect3D";
//
//
// @system(s => s.afterWritersOf(ControlComponent, CameraComponent))
// export class ControlSystem extends System {
//     controls = this.singleton.write(ControlComponent)
//     scene = this.singleton.read(SceneComponent)
//
//     // player = this.query(q => q.current.write.using(Target, Object3DComponent).write)
//
//     checkable = this.query(q => q.using(Target, Health, Healing).read)
//
//     orbitControls: OrbitControls | undefined;
//     firstPersonControls: FirstPersonControls | undefined;
//
//     mouse = this.singleton.write(Mouse)
//     keyboard = this.singleton.read(Keyboard)
//     execute() {
//         return
//
//         // const player = this.player.current.at(0) as Entity;
//         // const keyboard = player.read(Keyboard)
//         // let mouse = player.write(Mouse)
//         // const mouse = this.singleton.read(Mouse)
//         const mouse = this.mouse
//         const keyboard = this.keyboard;
//
//         if ((this.scene.scene as MainScene).controls) {
//             this.controls.object = (this.scene.scene as MainScene).controls;
//         }
//
//         const tabState = keyboard.getKeyState('Tab');
//         if (this.controls.object instanceof OrbitControls && tabState.current === 'down') {
//             this.scene.scene.canvas.requestPointerLock()
//         }
//
//         if (document.pointerLockElement === this.scene.scene.canvas ||
//             //@ts-ignore
//             document.mozPointerLockElement === this.scene.scene.canvas) {
//
//             if (this.controls.object instanceof OrbitControls) {
//                 this.controls.object.dispose();
//
//                 let target: any = this.scene.scene.camera;
//
//                 // if (player.has(Target)) {
//                 //     const targetEntity = player.read(Target).value
//                 //     target = targetEntity.read(Object3DComponent).object
//                 // }
//
//                 (this.scene.scene as MainScene).controls = new FirstPersonControls(this.scene.scene.camera, target, {});
//             }
//             ((this.scene.scene as MainScene).controls as FirstPersonControls).update(mouse.movementX, mouse.movementY)
//             this.singleton.write(Mouse).resetButtons()
//         } else {
//
//             if (this.controls.object instanceof FirstPersonControls) {
//
//                 (this.scene.scene as MainScene).controls = new OrbitControls(this.scene.scene.camera, this.scene.scene.canvas);
//             }
//         }
//
//
//     }
//
// }
