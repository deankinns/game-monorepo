import * as THREE from "three";

export const Vector3ToThree = (v: { x: number, y: number, z: number }, result: THREE.Vector3) => {
    return result.set(v.x, v.y, v.z);
}


export const QuaternionToThree = (q: { x: number, y: number, z: number, w: number }, result: THREE.Quaternion = new THREE.Quaternion) => {
    return result.set(q.x, q.y, q.z, q.w);
}