import * as React from "react";
import {Component, useContext, useEffect} from "react";
import {Entity, System} from "@lastolivegames/becsy";
// import {GameWindow} from "../../apps/ecs-debug/src/GameWindow";
import {RenderComponent, ToBeDeleted} from "becsy-package";
// import * as components from "../../node_modules/becsy-package"
import {ComponentPanel} from "./ComponentPanel";
import {EntityList} from "./EntityList";
import {ComponentList} from "./ComponentList";
import {GameWorldContext} from "./GameWorldWrapper";

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

export const EntityPanel = (props: { entity: Entity }) => {

    const world = useContext(GameWorldContext);
    const [has, setHas] = React.useState([]);
    const [hasNot, setHasNot] = React.useState([]);
    const [show, setShow] = React.useState(false);

    const [component, setComponent] = React.useState("Select");

    const sortComponents = () => {

        // const world = EntityPanel.worldContext;
        // if (world) {
        //     console.log(world);
        // }

        // this.has = [];
        // this.hasNot = [];
        //@ts-ignore
        const types = world.world.__dispatcher.registry.types.filter(
            (type: any) => type.__binding && type.name !== "Alive"
        );
        //@ts-ignore
        setHas(types.filter((type) => {
            try {
                return props.entity.has(type);
            } catch (e) {
                return false;
            }
        }));
        //@ts-ignore
        setHasNot(types.filter((type) => {
            try {
                return !props.entity.has(type);
            } catch (e) {
                return false;
            }
        }));

    }

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
            props.entity,
            {component}
        );

        sortComponents();
        setComponent("Select");
    }

    const deleteEntity = () => {
        world?.enqueueAction(
            (sys, entity) => {
                entity?.delete();
            },
            props.entity
        );
    }

    //
    useEffect(() => {
        sortComponents()
    }, [props.entity]);
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
                        {props.entity.__id}
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

                    <button onClick={() => setShow(!show) /*this.setState({ show: !this.state.show })*/}>
                        {show ? "hide" : "show"}
                    </button>
                </div>

                {show ? <ComponentList components={has} entity={props.entity}/> : null}
            </div>
        );
    } catch (e) {
        return <p>Removing ...</p>;
    }
    // }
}
