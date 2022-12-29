import {Entity} from "@lastolivegames/becsy";
import {CollisionEnterHandler, CollisionEnterPayload, RigidBody, RigidBodyApi} from "@react-three/rapier";
import {Box, CycleRaycast, Html,Line} from "@react-three/drei";
import React, {useEffect, useMemo, useRef, useState, useCallback} from "react";
import {GameEntityComponent} from "becsy-yuka-package";
import {Rifle as Model} from 'fiber-package'
import {useFrame} from "@react-three/fiber";
import {Vector3ToYuka, QuaternionToYuka} from 'yuka-package'
import {Health, Packed, PositionComponent, Target, Weapon} from "becsy-package";
import {Vector3, Quaternion, Mesh, Euler, Group, BufferGeometry, Ray} from "three";
import {RefComponent, useEcsStore} from "react-becsy";
import {button, useControls} from "leva";

import create, {SetState} from 'zustand'
import {Vector3ToThree} from "three-package";

interface Bullet {
    position: Vector3,
    rotation: Quaternion
}

interface BulletState {
    bullets: Bullet[],
    addBullet: (bullet: Bullet) => void,
    removeBullet: (bullet: Bullet) => void,
    setBullets: (bullets: Bullet[]) => void,
}

const useBulletStore = create<BulletState>((set: SetState<any>, get) => ({
    bullets: [],
    addBullet: (bullet: any) => set((state: { bullets: any; }) => ({bullets: [...state.bullets, bullet]})),
    removeBullet: (bullet: any) => set((state: { bullets: any; }) => ({bullets: state.bullets.filter((b: any) => b.position !== bullet.position && b.rotation !== bullet.rotation)})),
    setBullets: (bullets: any) => set({bullets})
}))

export const Rifle = (props: { entity: Entity; onClick: any; position?: any }) => {
    const bodyRef = useRef<RigidBodyApi>(null);
    const ref = useRef<Group>(null);

    const gameEntity = /*useMemo(() =>*/ props.entity.write(GameEntityComponent).entity/*, [props.entity]);*/
    // const weaponComponent = props.entity.read(Weapon);
    const [packed, setPacked] = useState<boolean>(false);
    const [over, setOver] = useState<boolean>(false);

    // const ammo = useRef(0)
    const [projectiles, setProjectiles] = useState<any[]>([])

    const ecs = useEcsStore().ecs;

    const bulletStore = useBulletStore()

    const pos = new Vector3();
    const dir = new Vector3();
    const ray = new Ray()

    useFrame((state, delta, frame) => {
        if (!bodyRef.current) return

        if (packed !== props.entity.has(Packed)) {
            setPacked(() => props.entity.has(Packed));
        }

        if (packed) {
            const holder = props.entity.read(Packed).holder;
            if (!holder || !holder.alive || !holder.has(RefComponent)) return setPacked(false);
            const r = holder.read(RefComponent).ref
            if (!r || !r.current) return

            const {hand, head, obj} = r.current;

            if (!hand || !head || !obj) return

            const v1 = new Vector3();
            hand.getWorldPosition(v1);

            const q1 = new Quaternion();
            obj?.getWorldQuaternion(q1);

            const e = new Euler().setFromQuaternion(bodyRef.current.rotation(), 'XYZ')
            v1.add(new Vector3(.07, .15, .8).applyEuler(e))

            bodyRef.current.setTranslation(v1);
            bodyRef.current.setRotation(q1);
            bodyRef.current.lockRotations(true)
            bodyRef.current.lockTranslations(true)
        } else {

            bodyRef.current.lockRotations(false)
            bodyRef.current.lockTranslations(false)
        }

        Vector3ToYuka(bodyRef.current?.translation(), gameEntity.position)
        QuaternionToYuka(bodyRef.current?.rotation(), gameEntity.rotation);

        // gameEntity.rotateTo(gameEntity.position, new Vector3(0, 0, 0))
        // if (packed) {
        //     const holder = props.entity.read(Packed).holder;
        //     if (holder.has(Target)){
        //         const target = holder.read(Target).position;
        //         holder.read(GameEntityComponent).entity.rotateTo(Vector3ToYuka(target), delta)
        //     }
        //
        //
        // }

        ref.current?.getWorldPosition(pos);
        ref.current?.getWorldDirection(dir);

        ray.set(pos, dir)

        // state.raycaster.set(pos, dir);
        //
        // const intersects = state.raycaster.intersectObjects(state.scene.children, true);
        //
        // for (const intersect of intersects) {
        //     if (intersect.object.name === 'target') {
        //         setOver(true);
        //         return
        //     }
        // }

        if (props.entity.read(Weapon).state === 'firing') {
            // props.entity.write(Weapon).ammo = 0
            fire();
        }
    })

    const reload = () => {
        // ammo.current = 10
        // ecs.enqueueAction((sys, entity) => {
        //     if (entity) {
        //         const maxAmmo = entity.read(Weapon).maxAmmo;
        //         entity.write(Weapon).ammo = maxAmmo
        //         ammo.current = maxAmmo
        //     }
        // }, props.entity)
        const weapon = props.entity.write(Weapon);
        weapon.ammo = weapon.maxAmmo;
    }
    const fire = () => {
        // const ammo = props.entity.read(Weapon).ammo

        // const weapon = props.entity.write(Weapon)
        if (!bodyRef.current) return
        bulletStore.addBullet({
            position: bodyRef.current.translation().clone(),
            rotation: bodyRef.current.rotation().clone()
        })
        // setProjectiles(prev => [...prev, Date.now()])


        // weaponComponent.ammo --;
        // ammo.current--
        // ecs.enqueueAction((sys, entity) => {
        //     if (entity) {
        // weapon.ammo = weapon.ammo - 1;
        // }
        // }, props.entity)
    }

    // useControls("rifle" + props.entity.__id, {
    //     Fire: button(() => fire()),
    //     Reload: button(() => reload())
    // })
    //
    // useEffect(() => {
    //     ecs.enqueueAction((sys, entity) => {
    //         if (entity) {
    //             const weapon = entity.write(Weapon)
    //             weapon.fire = fire
    //             weapon.reload = reload
    //
    //             // ammo.current = weapon.ammo
    //         }
    //     }, props.entity, {fire, reload})
    // }, [])

    // const points = []
    // points.push(new Vector3(0, 0, 0))
    // points.push(new Vector3(0, 0, 100))
    //
    // const lineGeometry = new BufferGeometry().setFromPoints(points)

    return <>
        <RigidBody
            type={"dynamic"}
            ref={bodyRef}
            position={[
                gameEntity.position.x,
                gameEntity.position.y,
                gameEntity.position.z,
            ]}
        >
            <group ref={ref}>
            <Html>
                <p>{props.entity.read(Weapon).state}</p>
                <p>Ammo:&nbsp;{props.entity.read(Weapon).ammo}</p>
                <button onClick={fire}>Fire</button>
            </Html>
            <Model
                // ref={modelRef}
                onClick={props.onClick}
            />
            <Line points={[[0,0,0],[0,0,10]]} color={over ? 'white': 'black'} />
            </group>
        </RigidBody>
        {/*{projectiles.map((p, i) => <Bullet*/}
        {/*    key={p}*/}
        {/*    position={bodyRef.current?.translation().clone()}*/}
        {/*    rotation={bodyRef.current?.rotation().clone()}*/}
        {/*/>)}*/}
    </>
}

const Bullet = ({position, rotation}: any) => {
    const e = new Euler().setFromQuaternion(rotation, 'XYZ')
    const v1 = new Vector3(0, 0, 1).applyEuler(e);
    position.add(v1)
    const v = v1.clone().multiplyScalar(100)
    const age = useRef(0)

    const removeBullet = useBulletStore(state => state.removeBullet)

    useFrame((state, delta, frame) => {
        age.current += delta
        if (age.current > 10) {
            removeBullet({position, rotation})
        }
        // position.add(v)
    })


    return <>
        <RigidBody
            userData={{type: 'bullet'}}
            position={[position.x, position.y, position.z]}
            rotation={[e.x, e.y, e.z]}
            linearVelocity={[v.x, v.y, v.z]}
            ccd={true}
            onCollisionEnter={({ manifold, target, other }) => {
                console.log(
                    "Collision at world position ",
                    manifold.solverContactPoint(0)
                );

                if (other.rigidBodyObject) {
                    console.log(
                        // this rigid body's Object3D
                        target.rigidBodyObject?.name,
                        " collided with ",
                        // the other rigid body's Object3D
                        other.rigidBodyObject.name
                    );

                    if (other.rigidBodyObject.userData.entity.has(Health)) {
                        other.rigidBodyObject.userData.entity.write(Health).health -= 10
                    }
                }
            }}
        >
            <Box args={[.1, .1, .1]}/>
        </RigidBody>
        <axesHelper args={[1]} position={position} rotation={rotation}/>
    </>
}

export const BulletWrapper = () => {
    const bulletStore = useBulletStore()

    useFrame((state, delta, frame) => {
        // for (const bullet of bulletStore.bullets) {
        //     if (Date.now() - bullet.createdAt > 1000) {
        //         bulletStore.removeBullet(bullet)
        //     }
        // }
        const date = Date.now()
        // bulletStore.setBullets(bulletStore.bullets.filter(b => {
        //     return (date - b.createdAt > 5000)
        // }))
    })


    return <>
        {bulletStore.bullets.map((b, i) => <Bullet
            key={i}
            position={b.position}
            rotation={b.rotation}
        />)}
    </>
}

