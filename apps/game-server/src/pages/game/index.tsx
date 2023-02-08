import React, {useEffect} from "react";
import { OrbitControls} from "@react-three/drei";
import {useToolbar} from "@/hooks/useToolbar";
import { NewEntityButton} from 'becsy-ui'
import {Health, Inventory, Weapon, Healing, Collectable} from "becsy-package";
import {
    BrainComponent,
    MemoryComponent,
    VehicleEntityComponent,
    VisionComponent,
    StaticEntityComponent
} from "becsy-yuka-package";
import Link from "next/link";
import {useEcsStore} from "react-becsy";

export default function Page() {
    const [setToolbarButtons] = useToolbar(state => ([state.setToolbarButtons]));
    const [selectedEntity] = useEcsStore(state => ([state.selectedEntity]));

    useEffect(() => {
        document.exitPointerLock()

        setToolbarButtons(<>
            <NewEntityButton components={[
                Health,
                VehicleEntityComponent,
                Inventory,
                BrainComponent,
                VisionComponent,
                MemoryComponent,
            ]}>Player</NewEntityButton>
            <NewEntityButton
                components={[Healing, Collectable, StaticEntityComponent]}>Health</NewEntityButton>
            <NewEntityButton components={[Collectable, Weapon, {
                ammo: 10,
                maxAmmo: 10
            }, StaticEntityComponent]}>Gun</NewEntityButton>
        </>)

        return () => setToolbarButtons(null)
    }, [])

    return <div>
        <p>game</p>
        {selectedEntity && <Link href={'/fps/' + selectedEntity.__id}>Info</Link>}
    </div>
}

Page.canvas = (props: any) => {
    return <OrbitControls/>
}
