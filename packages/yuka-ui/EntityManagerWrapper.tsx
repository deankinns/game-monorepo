import {EntityManager} from "yuka";
import * as React from "react";

export const EntityManagerContext = React.createContext<EntityManager|undefined>(undefined);

export const EntityManagerWrapper = ({children, manager}: {children: React.ReactNode, manager?: EntityManager }) => {
    return <EntityManagerContext.Provider value={manager}>{children}</EntityManagerContext.Provider>;
}