import {Euler, Quaternion, Vector3} from "three";
import {RigidBody} from "@react-three/rapier";
import {Box} from "@react-three/drei";
import React from "react";
import {Health, PositionComponent} from "becsy-package";

const q = new Quaternion();
const p = new Vector3();
export const Bullet = ({entity}: any) => {

    if (!entity.has(PositionComponent)) return null

    const {position, rotation} = entity.read(PositionComponent)

    q.set(rotation.x, rotation.y, rotation.z, rotation.w)
    p.set(position.x, position.y, position.z)

    const e = new Euler().setFromQuaternion(q, 'XYZ')
    const v1 = new Vector3(0, 0, 1).applyEuler(e);
    p.add(v1)
    const v = v1.clone().multiplyScalar(500)
    // const age = useRef(0)
    //
    // const removeBullet = useBulletStore(state => state.removeBullet)

    // useFrame((state, delta, frame) => {
    //     age.current += delta
    //     if (age.current > 10) {
    //         removeBullet({position, rotation})
    //     }
    //     // position.add(v)
    // })


    return <RigidBody
        userData={{entity}}
        position={[position.x, position.y, position.z]}
        rotation={[e.x, e.y, e.z]}
        linearVelocity={[v.x, v.y, v.z]}
        ccd={true}
        onCollisionEnter={({manifold, target, other}) => {
            // console.log(
            //     "Collision at world position ",
            //     manifold.solverContactPoint(0)
            // );

            if (other.rigidBodyObject && other.rigidBodyObject.userData.entity) {
                // console.log(
                //     // this rigid body's Object3D
                //     target.rigidBodyObject?.name,
                //     " collided with ",
                //     // the other rigid body's Object3D
                //     other.rigidBodyObject.name
                // );

                if (other.rigidBodyObject.userData.entity.has(Health)) {
                    other.rigidBodyObject.userData.entity.write(Health).health -= 10
                }
            }
        }}
    >
        <Box args={[.1, .1, .1]}/>
    </RigidBody>

}