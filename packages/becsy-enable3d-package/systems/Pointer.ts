import {system, System} from "@lastolivegames/becsy";
import {Mouse, MouseSystem} from 'becsy-package';
import {Raycaster, Vector2} from 'three';
import {Pointer} from "../components/Pointer";
import {CameraComponent} from "../components/Camera";
import {MainScene} from 'enable3d-package';

@system(s => s.after(MouseSystem).afterWritersOf(Pointer))
export class PointerSystem extends System {

    private readonly pointer = this.query(q => q.current.using(Mouse, CameraComponent).read.with(Pointer).added.removed.write);
    private ball: any;

    rayCaster = new Raycaster();

    factory: MainScene | undefined;

    execute() {
        const factory = this.factory as MainScene;
        // const factory = this.enable3d.factory
        // for (const entity of this.pointer.added) {
        //   entity.write(Pointer).raycaster = new Raycaster();
        // }
        for (const entity of this.pointer.current) {
            const mouse = entity.read(Mouse);
            const camera = entity.read(CameraComponent).camera;
            const {width, height} = factory.renderer.domElement
            const coords = new Vector2(
                (mouse.clientX / width) * 2 - 1,
                -(mouse.clientY / height) * 2 + 1
            );
            // this.enable3d.project.renderer.domElement.width
            // this.enable3d.project.renderer.domElement.height
            // let {raycaster} = entity.read(Pointer);

            this.rayCaster.setFromCamera(coords, camera);

            const over = this.rayCaster.intersectObjects(factory.scene.children, true).filter(e => e.object.userData?.debug !== true);

            entity.write(Pointer).ray = this.rayCaster.ray;

            // this.line.points.clear()

            // this.line.needUpdate = true
            // const points = [];
            // points.push(raycaster.ray.origin)
            // points.push(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(100)))
            // this.line = new BufferGeometry().setFromPoints(points);
            // this.line.attributes.position.needsUpdate = true


            // for (const o of entity.read(Pointer).over ?? []) {
            //   o.object.material.wireframe = false;
            // }

            // let overItem;
            // for (const o of over) {
            //   if (this.ball && o.object !== this.ball) {
            //     this.ball.position.copy(o.point)
            //     // overItem = o
            //     break
            //   }
            //
            // }

            // if (over.length > 0) {
            entity.write(Pointer).over = over;
            // }


            // const state = mouse.getKeyState('left-button');

            // if (mouse.getKeyState('right-button').current === 'down') {
            //   this.refreshLine(raycaster.ray.origin, raycaster.ray.direction)
            // }


            // const overItems = entity.read(Pointer).over
            //
            // let minDist = Infinity;
            // let overItem = null
            // for (const item of overItems) {
            //   if (item && item.distance < minDist) {
            //     minDist = item.distance
            //     overItem = item
            //   }
            // }
            //
            // // const overItem = overItems[0]
            // if (overItem) {
            //   if (this.ball) {
            //     this.ball.position.copy(overItem.point)
            //
            //     const sq = Math.sqrt(overItem.distance)
            //     this.ball.scale.set(sq,sq,sq)
            //   }
            //
            //
            //   if (state.current === 'down' && state.prev === 'up') {
            //     const selectedEntity = overItem.object.userData['entity'];
            //     selectedEntity?.add(Selected, {point: overItem.point})
            //     entity.write(Pointer).selected = selectedEntity;
            //   }
            //
            // }


            // this.becsyService.player = entity;
        }

    }
}