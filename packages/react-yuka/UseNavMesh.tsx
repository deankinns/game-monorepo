import {CellSpacePartitioning, NavMesh} from "yuka";
import {create} from "zustand";
import {devtools} from "zustand/middleware";

interface NavMeshState {
    navMesh: NavMesh,
    spatialIndex: CellSpacePartitioning,
}

export const useNavMesh = create<NavMeshState>()(devtools((get, set) => ({
    navMesh: new NavMesh(),
    spatialIndex: new CellSpacePartitioning(1000, 1000, 1000, 10, 10, 10),
})))