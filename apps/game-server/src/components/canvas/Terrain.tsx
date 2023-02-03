import {TerrainChunkManager} from 'terrain-generator-package';
import React, {useRef} from "react";
import {useEcsStore, useSystem} from "react-becsy";
import {NavigationSystem} from "becsy-yuka-package";
import {ThreeEvent} from "@react-three/fiber";

const Terrain = ({seed}: any) => {
    const ref = useRef<any>(null!);

    const [selectEntity, selectedEntity] = useEcsStore(state => ([state.selectEntity, state.selectedEntity]));
    const navigationSystem = useSystem(NavigationSystem) as NavigationSystem;

    return <TerrainChunkManager
        ref={ref}
        seed={seed}
        onClick={(e: ThreeEvent<MouseEvent>) => {
            selectEntity(null);
            e.stopPropagation()
        }}
        onContextMenu={(e: ThreeEvent<MouseEvent>) => {
            if (selectedEntity) {
                navigationSystem.goTo(selectedEntity, e.point);
            }
            e.stopPropagation();
        }}
    />

}

export default Terrain