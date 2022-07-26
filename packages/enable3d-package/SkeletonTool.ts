import ExtendedObject3D from '@enable3d/common/dist/extendedObject3D';
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
// import {config} from "../constants";
const config = {assetDir: 'assets'}

export class SkeletonTool {
  static objects: Map<string, any> = new Map<string, any>();



  static async populate(factory: any): Promise<void> {
    const anims = ['Idle', 'Jumping', 'LookingAround', 'Running', 'Left Turn', 'Right Turn', 'Lifting', 'Throw', 'rifle/rifle aiming idle', 'rifle/Rifle Run', "Falling Idle"];
    await Promise.all(anims.map(e => SkeletonTool.loadObj(factory, e)));
  }

  static async loadObj(factory: { load: { fbx: (arg0: string) => any; }; }, key: string): Promise<ExtendedObject3D> {
    let object = await SkeletonTool.objects.get(key);
    if (!object) {
      // return object;
      // }
      object = await factory.load.fbx(`${config.assetDir}/fbx/${key}.fbx`);
      SkeletonTool.objects.set(key, object);
      object = await SkeletonTool.objects.get(key);
    }

    // @ts-ignore
    const clonedMesh = SkeletonUtils.clone(object);
    // console.log(key, object.animations);
    clonedMesh.animations = await object.animations.map((e: { clone: () => any; }) => e.clone());

    return clonedMesh;
  }

  static getObj(key: string): ExtendedObject3D {
    let object = SkeletonTool.objects.get(key);
    // @ts-ignore
    const clonedMesh = SkeletonUtils.clone(object);
    // console.log(key, object.animations);
    clonedMesh.animations = object.animations.map((e: { clone: () => any; }) => e.clone());
    return clonedMesh;
  }
}
