import {Entity} from "@lastolivegames/becsy";
import {GameEntityHelper} from "./GameEntityHelper";
import React from "react";
import {useSystemEntities} from "react-becsy";
import {EntityManagerSystem} from "becsy-yuka-package";

export const GameEntities = () => {
    // const entityManagerSystem = useSystem(EntityManagerSystem) as EntityManagerSystem;
    // const debug = useDebug(state => state.debug);
    //
    // const [items, setItems] = useState(() => new Set<Entity>());
    // // const items = useMemo(() => debug ? [] : entityManagerSystem.entities.current, [debug, entityManagerSystem.entities]);
    // useFrame(() => {
    //     // if (items.length !== entityManagerSystem.entities.current.length) {
    //     //     setItems(entityManagerSystem.entities.current);
    //     // }
    //
    //     entityManagerSystem.entities.added.forEach((e: Entity) => addItem(e))
    //     entityManagerSystem.entities.removed.forEach((e: Entity) => removeItem(e))
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

    const items = useSystemEntities({systemType: EntityManagerSystem, query: 'entities'})

    return <>
        {[...items].map((e: Entity) => {
            if (!e.__valid || !e.alive) return null;
            return <GameEntityHelper e={e} key={e.__id}/>
        })}
    </>
}