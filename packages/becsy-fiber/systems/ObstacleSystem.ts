import {system, System} from "@lastolivegames/becsy";
import {Obstacle, GameEntityComponent} from 'becsy-yuka-package';
import {Object3DComponent} from "../components";
import {Mesh} from "three";
import {MeshGeometry, Vector3} from 'yuka'

@system(s => s.afterWritersOf(Obstacle, GameEntityComponent))
export class ObstacleSystem extends System {

    obstacles = this.query(q => q.with(Obstacle, GameEntityComponent, Object3DComponent).added.write);

    execute() {
        for (const entity of this.obstacles.added) {
            const gameEntity = entity.read(GameEntityComponent).entity;
            const object3D = entity.read(Object3DComponent).object as Mesh;
            const position = object3D.geometry.attributes.position?.array as Float32Array;
            const index = object3D.geometry.index?.array as Uint32Array;
            if (!position || !index) continue;

            const geometry = new MeshGeometry(position, index)
            gameEntity.lineOfSightTest = (ray, point): Vector3 | null => {
                return geometry.intersectRay(ray, gameEntity.worldMatrix, true, point)
            }
        }
    }


}