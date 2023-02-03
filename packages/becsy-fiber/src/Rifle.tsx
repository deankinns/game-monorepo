import {Entity} from "@lastolivegames/becsy";
import {interactionGroups, RigidBody, RigidBodyApi} from "@react-three/rapier";
import React, {useEffect, useRef} from "react";
import {GameEntityComponent, WeaponSystem} from "../../../node_modules/becsy-yuka-package";
import {Rifle as Model} from 'fiber-package'
import {useFrame} from "@react-three/fiber";
import {PositionComponent, Weapon} from "becsy-package";
import {Group} from "three";
import {useEcsStore, useSystem} from "react-becsy";
import {PhysicsSystem} from "becsy-fiber"
//
// interface Bullet {
//     position: Vector3,
//     rotation: Quaternion
// }

// interface BulletState {
//     bullets: Bullet[],
//     addBullet: (bullet: Bullet) => void,
//     removeBullet: (bullet: Bullet) => void,
//     setBullets: (bullets: Bullet[]) => void,
// }
//
// const useBulletStore = create<BulletState>((set: SetState<any>, get) => ({
//     bullets: [],
//     addBullet: (bullet: any) => set((state: { bullets: any; }) => ({bullets: [...state.bullets, bullet]})),
//     removeBullet: (bullet: any) => set((state: { bullets: any; }) => ({bullets: state.bullets.filter((b: any) => b.position !== bullet.position && b.rotation !== bullet.rotation)})),
//     setBullets: (bullets: any) => set({bullets})
// }))

export const Rifle = (props: { entity: Entity;  }) => {
    const bodyRef = useRef<RigidBodyApi>(null);
    const ref = useRef<Group>(null);

    // const gameEntity = /*useMemo(() =>*/ props.entity.write(GameEntityComponent).entity/*, [props.entity]);*/
    // const weaponComponent = props.entity.read(Weapon);
    // const [packed, setPacked] = useState<boolean>(false);
    // const [over, setOver] = useState<boolean>(false);

    // const ammo = useRef(0)
    // const [projectiles, setProjectiles] = useState<any[]>([])

    // const ecs = useEcsStore().ecs;



    const weaponSystem = useSystem(WeaponSystem) as WeaponSystem;
    const physicsSystem = useSystem(PhysicsSystem) as PhysicsSystem;
    const selectEntity = useEcsStore((state) => state.selectEntity);

    // const addBullet = useBulletStore(state => state.addBullet)

    // const pos = new Vector3();
    // const dir = new Vector3();
    // const ray = new Ray()

    useFrame((state, delta, frame) => {
        if (
            !props.entity.__valid || !props.entity.alive ||
            !bodyRef.current || !props.entity.has(GameEntityComponent)
        ) return

        // if (packed !== props.entity.has(Packed)) {
        //     setPacked(prev => packed);
        // }

        // if (props.entity.has(Packed)) {
        //     const holder = props.entity.read(Packed).holder;
        //     if (!holder || !holder.alive || !holder.has(RefComponent)) return setPacked(false);
        //     const r = holder.read(RefComponent).ref
        //     if (!r || !r.current) return
        //
        //     const {hand, head, obj} = r.current;
        //
        //     if (!hand || !head || !obj) return
        //
        //     const v1 = new Vector3();
        //     hand.getWorldPosition(v1);
        //
        //     const q1 = new Quaternion();
        //     obj?.getWorldQuaternion(q1);
        //
        //     const e = new Euler().setFromQuaternion(bodyRef.current.rotation(), 'XYZ')
        //     v1.add(new Vector3(.07, .15, .8).applyEuler(e))
        //
        //     bodyRef.current.setTranslation(v1);
        //     bodyRef.current.setRotation(q1);
        //     bodyRef.current.lockRotations(true)
        //     bodyRef.current.lockTranslations(true)
        // } else {
        //
        //     bodyRef.current.lockRotations(false)
        //     bodyRef.current.lockTranslations(false)
        // }

        // const gameEntity = props.entity.write(GameEntityComponent).entity

        // Vector3ToYuka(bodyRef.current?.translation(), gameEntity.position)
        // QuaternionToYuka(bodyRef.current?.rotation(), gameEntity.rotation);

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

        // ref.current?.getWorldPosition(pos);
        // ref.current?.getWorldDirection(dir);

        // ray.set(pos, dir)

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

        if (props.entity.has(Weapon) && props.entity.read(Weapon).state === 'firing') {
            // props.entity.write(Weapon).ammo = 0
            fire();
        }

    })

    useEffect(() => {
        // const gameEntity = props.entity.write(GameEntityComponent).entity
        // new Vector3(gameEntity.position.x, gameEntity.position.y, gameEntity.position.z));
        if (bodyRef.current) {
            bodyRef.current.setTranslation(props.entity.read(PositionComponent).position);
            physicsSystem.addBody(props.entity, bodyRef.current);
        }


    }, [physicsSystem, props.entity]);

    const reload = () => {
        // ammo.current = 10
        // ecs.enqueueAction((sys, entity) => {
        //     if (entity) {
        //         const maxAmmo = entity.read(Weapon).maxAmmo;
        //         entity.write(Weapon).ammo = maxAmmo
        //         ammo.current = maxAmmo
        //     }
        // }, props.entity)
        // const weapon = props.entity.write(Weapon);
        // weapon.ammo = weapon.maxAmmo;

        if (props.entity.read(Weapon).state !== 'ready') return
        weaponSystem.reload(props.entity)
    }
    const fire = () => {
        if (props.entity.read(Weapon).state !== 'ready') return
        weaponSystem.fire(props.entity)
        // const ammo = props.entity.read(Weapon).ammo

        // const weapon = props.entity.write(Weapon)
        // if (!bodyRef.current) return
        // addBullet({
        //     position: bodyRef.current.translation().clone(),
        //     rotation: bodyRef.current.rotation().clone()
        // })
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
            // position={[
            //     gameEntity.position.x,
            //     gameEntity.position.y,
            //     gameEntity.position.z,
            // ]}
            collisionGroups={interactionGroups([2], [0])}
        >
            <group ref={ref}>
                {/*<Html>*/}
                {/*    <div style={{fontSize: 'xx-small'}}>*/}
                {/*        <div className="w3-panel w3-white">*/}
                {/*            <p>{props.entity.read(Weapon).state}</p>*/}
                {/*            <p>Ammo:&nbsp;{props.entity.read(Weapon).ammo}</p>*/}
                {/*        </div>*/}
                {/*        <button className={'w3-tiny'} onClick={fire}>Fire</button>*/}
                {/*        <button className={'w3-tiny'} onClick={reload}>Reload</button>*/}
                {/*    </div>*/}
                {/*</Html>*/}
                <Model
                    // ref={modelRef}
                    onClick={ev => {
                        selectEntity(props.entity);
                        ev.stopPropagation();
                    }}
                />
                {/*<Line points={[[0, 0, 0], [0, 0, 10]]} color={over ? 'white' : 'black'}/>*/}
            </group>
        </RigidBody>
        {/*{projectiles.map((p, i) => <Bullet*/}
        {/*    key={p}*/}
        {/*    position={bodyRef.current?.translation().clone()}*/}
        {/*    rotation={bodyRef.current?.rotation().clone()}*/}
        {/*/>)}*/}
    </>
}

//
// export const BulletWrapper = () => {
//     // const bulletStore = useBulletStore()
//     //
//     // useFrame((state, delta, frame) => {
//     //     // for (const bullet of bulletStore.bullets) {
//     //     //     if (Date.now() - bullet.createdAt > 1000) {
//     //     //         bulletStore.removeBullet(bullet)
//     //     //     }
//     //     // }
//     //     const date = Date.now()
//     //     // bulletStore.setBullets(bulletStore.bullets.filter(b => {
//     //     //     return (date - b.createdAt > 5000)
//     //     // }))
//     // })
//     //
//     //
//     // return <>
//     //     {bulletStore.bullets.map((b, i) => <Bullet
//     //         key={i}
//     //         position={b.position}
//     //         rotation={b.rotation}
//     //     />)}
//     // </>
//     const bulletSystem = useSystem(BulletSystem) as BulletSystem
//     const [items, setItems] = useState<Entity[]>([]);
//     // const items = useMemo(() => debug ? [] : entityManagerSystem.entities.current, [debug, entityManagerSystem.entities]);
//     useFrame(() => {
//         if (items.length !== bulletSystem.bullets.current.length) {
//             setItems(bulletSystem.bullets.current);
//         }
//     })
//
//
//     // const count = useEcsStore(state => state.count)
//
//     return <>
//         {items.map((bullet) => {
//             const {position, rotation} = bullet.read(PositionComponent);
//
//             return <Bullet
//                 key={bullet.__id}
//                 position={new Vector3(position.x, position.y, position.z)}
//                 rotation={new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)}
//             />
//         })}
//     </>
//
// }


