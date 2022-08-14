// import {Entity, System, system} from "@lastolivegames/becsy";
// import {SceneManagerSystem} from "./SceneManager";
// // import {ProjectComponent} from "../components/Scene";
// import {Object3DComponent} from "../components/Obect3D";
// import {RenderComponent, Deleter, Render as HtmlRender} from "becsy-package";
//
//
// @system(s => s.after(SceneManagerSystem).before(Deleter, HtmlRender))
// export class Render extends System {
//     // project = this.singleton.read(ProjectComponent)
//
//     objects = this.query(q => q.with(Object3DComponent).added.removed.write)
//
//     execute() {
//         this.accessRecentlyDeletedData(true);
//
//         for (const entity of this.objects.removed) {
//             // entity.add(RenderComponent);
//             entity.read(Object3DComponent).object.removeFromParent()
//         }
//
//     }
// }
