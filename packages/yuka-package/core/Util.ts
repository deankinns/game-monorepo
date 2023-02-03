import {Quaternion, Vector3} from "yuka";

const v1 = new Vector3;
const q1 = new Quaternion;

export const Vector3ToYuka = (v: {x: number, y: number, z: number}, result: Vector3 = v1) => {
    return result.set(v.x, v.y, v.z);
}

export const QuaternionToYuka = (q: {x: number, y: number, z: number, w: number}, result: Quaternion = q1) => {
    return result.set(q.x, q.y, q.z, q.w);
}