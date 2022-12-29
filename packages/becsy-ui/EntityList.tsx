import * as React from "react";
import {EntityPanel} from "./EntityPanel";
import {GameWindow} from "../../apps/ecs-debug/src/GameWindow";
import {Entity, System} from "@lastolivegames/becsy";
import {createRef, useContext, useEffect, useRef, useState} from "react";
import { RenderContext} from "./GameWorldWrapper";
import {Render} from "becsy-package";
import {useSystem} from 'react-becsy';

export const EntityList = ({
    entities,
    filters,
}: {
    entities?: Entity[],
    filters?: any,
}) => {
    const [frame, setFrame] = useState<number>(0)
    // const render = useContext(RenderContext)

    const render = useSystem(Render) as Render
    //
    // useEffect(() => {
    //
    // }, [s]);
    useEffect(() => {
        // console.log('render list', render)
        if (render) {
            // render.cb = (system) => {
            //     setFrame(system.time);
            // }
            render.cblist.set(EntityList, (system: System) => {
                setFrame(system.time);
            })
        }

        return () => {
            render?.cblist.delete(EntityList);
        }
    }, [ render ]);

    return <>
        {((entities ? entities : render?.items.current.filter(e => {
            if (filters && filters.length > 0) {
                return e.hasAllOf(...filters)
            }
            return true;
        })) ?? []).map((entity: Entity) => (
            <EntityPanel
                key={`entity${entity.__id}`}
                entity={entity}
                // parent={props.parent}
            />
        ))}
    </>;
}
