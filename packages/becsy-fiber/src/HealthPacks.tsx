import {Entity} from "@lastolivegames/becsy";
import React from "react";
import {useSystemEntities} from "react-becsy";
import {HealthSystem} from 'becsy-package'
import {HealthPack} from "becsy-fiber/src/HealthPack";

export const HealthPacks = () => {
    // const healthSystem = useSystem(HealthSystem) as HealthSystem;
    // const selectEntity = useEcsStore(state => state.selectEntity);
    // const [items, setItems] = useState(() => new Set<Entity>());
    //
    // useFrame(() => {
    //     healthSystem.healing.added.forEach((e: Entity) => addItem(e))
    //     healthSystem.healing.removed.forEach((e: Entity) => removeItem(e))
    // })
    //
    // const addItem = (e: Entity) => {
    //     setItems((prev) => new Set(prev).add(e));
    // }
    // const removeItem = (e: Entity) => {
    //     setItems((prev) => {
    //         const newSet = new Set(prev);
    //         newSet.delete(e);
    //         return newSet;
    //     });
    // }
    const items = useSystemEntities({systemType: HealthSystem, query: 'healing'});

    return <>{[...items]?.map((e: Entity) => {
        if (!e.__valid || !e.alive) return null;
        return <HealthPack
            key={e.__id}
            entity={e.hold()}
        />
    })}</>
}