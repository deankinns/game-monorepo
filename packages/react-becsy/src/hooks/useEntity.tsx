import {
    createContext,
    useContext, useEffect, useRef, useState
} from 'react';
import {ComponentType, Entity} from '@lastolivegames/becsy';
import {useCreateEntity} from "./useCreateEntity";
import {useSystem} from "./useECS";
import {EventSystem, ToBeDeleted} from "becsy-package";

export const EntityContext = createContext<Entity | null>(null);

export function useEntity(components: (ComponentType<any> | Record<string, unknown>)[]) {
    const ref = useRef();
    const eventSystem = useSystem(EventSystem) as EventSystem;
    const [entity, setEntity] = useState<Entity>(null!);//() => eventSystem.createEntity(...components).hold());

    const deleteEntity = () => {
        eventSystem.enqueueAction((s, e) => {
            e?.delete()
        }, entity);
    }

    useEffect(() => {
        eventSystem.createAndHold(components, setEntity);
    }, [eventSystem]);
    //
    // useEffect(() => {
    //
    //     return () => deleteEntity()
    // }, []);

    return [entity, ref];

}