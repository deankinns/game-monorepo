import {Entity} from "@lastolivegames/becsy";
import React from "react";
import {useSystemEntities} from "react-becsy";
import {WeaponSystem} from "becsy-yuka-package/systems/WeaponSystem";
import {Rifle} from "becsy-fiber/src/Rifle";

export const Weapons = () => {
    // const selectEntity = useEcsStore(state => state.selectEntity);
    // const [items, setItems] = useState(() => new Set<Entity>());

    const items = useSystemEntities({systemType: WeaponSystem, query: 'weapons'});

    return <>{([...items].map((e: Entity) => <Rifle
            key={e.__id}
            entity={e}
            // onClick={(ev: any) => {
            //     selectEntity(e)
            //     ev.stopPropagation()
            // }}
        />
    ))}</>;
}