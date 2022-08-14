// import {system, System} from "@lastolivegames/becsy";
// import {Render} from "./Render";
// import {Object3DComponent} from "../components/Obect3D";
// import {PhysicsBodyComponent} from "../components/PhysicsBody";
// import {SceneManagerSystem} from "./SceneManager";
// import {ProjectComponent, SceneComponent} from "../components/Scene";
// import {MovingEntity} from "becsy-package";
//
// @system(s => s.before(Render).after(SceneManagerSystem))
// export class PhysicsSystem extends System {
//
//     init = this.query(q => q.with(Object3DComponent).without(PhysicsBodyComponent).current.write)
//     bodies = this.query(q => q.with(PhysicsBodyComponent).added.removed.write)
//
//     moving = this.query(q => q.with(PhysicsBodyComponent).current.using(MovingEntity).write)
//
//     // project = this.singleton.read(ProjectComponent);
//     scene = this.singleton.read(SceneComponent);
//
//     execute() {
//         for (const entity of this.init.current) {
//             const obj = entity.read(Object3DComponent).object
//             if (!entity.has(PhysicsBodyComponent) && obj.body) {
//                 entity.add(PhysicsBodyComponent, {body: obj.body});
//             }
//         }
//
//         for (const entity of this.bodies.added) {
//             if (entity.has(Object3DComponent)) {
//                 const obj = entity.read(Object3DComponent).object
//                 if (!obj.body) {
//                     this.scene.scene.physics.add.existing(obj.body)
//                 }
//             }
//         }
//
//         for (const entity of this.moving.current) {
//             const body = entity.read(PhysicsBodyComponent).body
//             if (entity.has(MovingEntity)) {
//                 let moving = entity.write(MovingEntity);
//                 moving.velocity = body.velocity;
//                 moving.position = body.position;
//             } else if (body) {
//                 entity.add(MovingEntity, {velocity: body.velocity, position: body.position})
//             }
//         }
//
//         this.accessRecentlyDeletedData(true)
//
//         for (const entity of this.bodies.removed) {
//             const body = entity.read(PhysicsBodyComponent).body
//             this.scene.scene.physics.destroy(body)
//         }
//     }
// }
