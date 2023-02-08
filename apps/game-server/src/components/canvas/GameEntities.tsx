import {HealthPacks} from "becsy-fiber/src/HealthPacks";
import {Robots} from "becsy-fiber/src/Robots";
import {Weapons} from "becsy-fiber/src/Weapons";
import {BulletWrapper} from "becsy-fiber/src/BulletWrapper";
import {useEntities} from "@/hooks/useEntities";
import {useEcsStore, useEntity} from "react-becsy";
import {RenderComponent} from "becsy-package";
import {Box} from "@react-three/drei";
import {useRef} from "react";
import {Object3DComponent, Robot} from "becsy-fiber";
import {Entity} from "@lastolivegames/becsy";
import {Health, Inventory} from "becsy-package";
import {BrainComponent, MemoryComponent, VehicleEntityComponent, VisionComponent} from "becsy-yuka-package";

export default function GameEntities() {
    const [ids] = useEntities(s => [s.ids]);

    return <>
        <HealthPacks/>
        <Robots />
        <Weapons />
        <BulletWrapper />

        {ids.map((i) => <Test key={i} />)}
    </>
}

const Test = () => {

    const [entity] = useEntity([
        Health,
        // VehicleEntityComponent,
        // Inventory,
        // BrainComponent,
        // VisionComponent,
        // MemoryComponent,
    ]) as [Entity];
    const selectEntity = useEcsStore(state => state.selectEntity);

    return <Box />
    // try {
    //     return <Robot
    //         entity={entity}
    //         onClick={(ev: any) => {
    //             if (entity) {
    //                 selectEntity(entity)
    //             }
    //             ev.stopPropagation()
    //         }}
    //     />;
    // } catch (e) {
    //     return null
    // }

}