import * as React from "react";
import {Component, useContext, useEffect, useMemo, useRef} from "react";
import {ComponentEnum, ComponentType, Entity, System} from "@lastolivegames/becsy";
// import {GameWindow} from "../../apps/ecs-debug/src/GameWindow";
import {RenderComponent, ToBeDeleted} from "becsy-package";
// import * as components from "../../node_modules/becsy-package"
import {ComponentPanel} from "./ComponentPanel";
import {EntityList} from "./EntityList";
import {ComponentList} from "./ComponentList";
// import {GameWorldContext} from "./GameWorldWrapper";
import {useEcsStore, useSystem} from "react-becsy";

import {Deleter} from 'becsy-package'

let components = [];


// export class EntityPanel extends Component<any, any> {
//   entity: Entity;
//   parent: React.Component & { enqueueAction: any; world: any };
//
//   has: string[] = [];
//   hasNot: string[] = [];
//
//   static worldContext = GameWorldContext;
//
//   constructor(props: {
//     entity: Entity;
//     parent: React.Component & { enqueueAction: any; world: any };
//   }) {
//     super(props);
//     this.entity = props.entity;
//     this.parent = props.parent;
//     this.state = {
//       component: "Select",
//       show: false,
//     };
//     this.handleChange = this.handleChange.bind(this);
//
//     // components = this.parent.world.world.__dispatcher.registry.types;
//   }

export const EntityPanel = ({entity}: { entity: Entity }) => {

    // const world = useContext(GameWorldContext);
    // const world = useContext(ECSContext);
    const [world, selectEntity] = useEcsStore(state => [state.ecs, state.selectEntity])
    // const [has, setHas] = React.useState([]);
    // const [hasNot, setHasNot] = React.useState([]);
    const [show, setShow] = React.useState(false);

    const [component, setComponent] = React.useState("Select");

    const deleterSystem = useSystem(Deleter)  as Deleter;

    // const types = useRef()

    // const types = useMemo(() => {

    const {types, has, hasNot} = useMemo(() => {
        //@ts-ignore
        const types = world.world?.__dispatcher.registry.types.filter(
            (type: any) => type.__binding && type.name !== "Alive"
        );
        const has = types.filter((type: ComponentType<any> | ComponentEnum) => {
            try {
                return entity.has(type);
            } catch (e) {
                return false;
            }
        })

        const hasNot = types.filter((type: ComponentType<any> | ComponentEnum) => {
            try {
                return !entity.has(type);
            } catch (e) {
                return false;
            }
        })
        return {types, has, hasNot}
    }, [entity, world]);

    // const sortComponents = () => {
    //
    //     // const world = EntityPanel.worldContext;
    //     // if (world) {
    //     //     console.log(world);
    //     // }
    //
    //     // this.has = [];
    //     // this.hasNot = [];
    //     //@ts-ignore
    //     // const types = world.world.__dispatcher.registry.types.filter(
    //     //     (type: any) => type.__binding && type.name !== "Alive"
    //     // );
    //     //@ts-ignore
    //     setHas(prev => types.filter((type) => {
    //         try {
    //             return entity.has(type);
    //         } catch (e) {
    //             return false;
    //         }
    //     }));
    //     //@ts-ignore
    //     setHasNot(prev => types.filter((type) => {
    //         try {
    //             return !entity.has(type);
    //         } catch (e) {
    //             return false;
    //         }
    //     }));
    //
    // }

    const entityOptions = () => {
        return [{name: "Select"}, ...hasNot].map((k: any) => (
            <option key={k.name}>{k.name}</option>
        ));
    }

    const addComponent = () => {
        world?.enqueueAction(
            (sys, entity, data: { component: string }) => {
                //@ts-ignore
                const types = world?.world?.__dispatcher.registry.types.filter(
                    (type: any) => type.name === data.component
                );
                if (!entity?.has(types[0])) {
                    entity?.add(types[0]);
                }
            },
            entity,
            {component}
        );

        // sortComponents();
        setComponent("Select");
    }

    const deleteEntity = () => {
        // world?.enqueueAction(
        //     (sys, entity) => {
        //         entity?.delete();
        //     },
        //     entity
        // );
        deleterSystem?.deleteEntity(entity);
    }

    //
    // useEffect(() => {
        // sortComponents()
    // }, [entity]);
    // const handleChange = (event: any) => {
    //   // this.setState({ component: event.target.value });
    // }

    // render() {
    // this.sortComponents();
    try {
        return (
            <div className={"w3-card w3-white"}>
                <div
                    className={"w3-container w3-grey"}
                    style={{display: "flex", flexDirection: "row"}}
                >
                    <p>
                        {entity.__id}
                    </p>
                    <select value={component} onChange={e => setComponent(e.target.value)}>
                        {entityOptions()}
                    </select>
                    <button onClick={() => addComponent()}>Add</button>
                    <button
                        onClick={() => deleteEntity()
                            // this.parent.enqueueAction((sys: any, entity: any) => {
                            //   entity.add(ToBeDeleted);
                            // }, this.props.entity)
                        }
                    >
                        Delete
                    </button>

                    <button onClick={(e) => {
                        setShow(!show);
                        e.stopPropagation()
                    } /*this.setState({ show: !this.state.show })*/}>
                        {show ? "hide" : "show"}
                    </button>
                    <button onClick={() => selectEntity(entity)}>select</button>
                    <button onClick={() => console.log(entity)}>log</button>
                </div>

                {show ? <ComponentList components={has} entity={entity}/> : null}
            </div>
        );
    } catch (e) {
        return <p>Removing ...</p>;
    }
    // }
}
