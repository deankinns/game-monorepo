import {ComponentType, Entity} from "@lastolivegames/becsy";
import {EventSystem, ToBeDeleted} from "becsy-package";
import {useSystem} from "./useECS";
import {useEffect, useState} from "react";

export const useCreateEntity = () => {
    const eventSystem = useSystem(EventSystem) as EventSystem;

    const createEntity = (...components: (ComponentType<any> | Record<string, unknown>)[]): Entity => {
        return eventSystem.createEntity(...components);
    }

    const removeEntity = (entity: Entity) => {
        entity.add(ToBeDeleted);
    }

    const [ready, setReady] = useState(false);
    useEffect(() => setReady(true), [eventSystem]);

    return [createEntity, ready];
}