import {Quaternion, Vector3} from "yuka";

export const Vector3ToYuka = (v: {x: number, y: number, z: number}, result: Vector3 = new Vector3) => {
    return result.set(v.x, v.y, v.z);
}

export const QuaternionToYuka = (q: {x: number, y: number, z: number, w: number}, result: Quaternion) => {
    return result.set(q.x, q.y, q.z, q.w);
}