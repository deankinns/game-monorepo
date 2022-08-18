import * as React from "react";
import {Component, useContext} from "react";
import {GameEntity, componentRegistry} from "yuka-package";
import {EntityManagerContext} from "./EntityManagerWrapper";

// export class EntityPanel extends Component<any, any> {
//   entity: GameEntity;
//   parent: React.Component;
//
//   has: string[] = [];
//   hasNot: string[] = [];
//
//   constructor(props: { entity: GameEntity; parent: React.Component }) {
//     super(props);
//     this.entity = props.entity;
//     this.parent = props.parent;
//     this.state = {
//       component: "Select",
//     };
//     this.handleChange = this.handleChange.bind(this);
//
//     //@ts-ignore
//   }

export const EntityPanel = ({entity}: { entity: GameEntity }) => {

    // sortComponents() {
    //   this.has = [];
    //   this.hasNot = [];
    //   //@ts-ignore
    //   const types = this.parent.world.world.__dispatcher.registry.types.filter(
    //     (type) => type.__binding && this.name !== "Alive"
    //   );
    //   //@ts-ignore
    //   this.has = types.filter((type) => this.entity.has(type));
    //   //@ts-ignore
    //   this.hasNot = types.filter((type) => !this.entity.has(type));
    // }
    //
    // entityOptions() {
    //   // const keys = ['Select']
    //   // this.sortComponents()
    //   return [{ name: "Select" }, ...this.hasNot].map((k: any) => (
    //     <option key={k.name}>{k.name}</option>
    //   ));
    // }

    // addComponent() {
    //     this.parent.actions.push({
    //         action: (sys: any, entity: any, data: {component: string}) => {
    //
    //             //@ts-ignore
    //             const component = components[data.component]
    //
    //             entity.add(component)
    //         }, entity: this.entity, data: {component: this.state.component}
    //     })
    //
    // }

    const handleChange = (event: any) => {
        // this.setState({ component: event.target.value });
    }

    const entityManager = useContext(EntityManagerContext);

    // render() {
    try {
        return (
            <div className={'w3-white w3-card'}>
                {/*<div>*/}
                {/*    <select value={this.state.component} onChange={this.handleChange}>*/}
                {/*        {this.entityOptions()}*/}
                {/*    </select>*/}
                {/*    /!*<button onClick={() => this.addComponent()}>Add</button>*!/*/}
                {/*</div>*/}

                <div className={`w3-container w3-${entity.components.has(componentRegistry.Health) ? 'blue' : 'red'}`}>
                    <h4>{entity.name} {entity.uuid}</h4>
                </div>

                <div className="w3-container">
                    <textarea
                        className={"w3-code jsHigh"}
                        style={{width: "100%", wordWrap: "break-word", overflow: "auto"}}
                        readOnly={true}
                        value={JSON.stringify(entity.toJSON(), undefined, 2)}
                    />
                </div>


                {/*<p>{JSON.stringify(this.props.entity.data)}</p>*/}

                <div
                    style={{
                        backgroundColor: entity.components.has(componentRegistry.Health) ? 'blue' : 'red',
                        height: 10,
                        width: 10,
                        position: "absolute",
                        top: (entity.position.z * 10) + 500,
                        left: (entity.position.x * 10) + 1000,
                    }}
                ></div>
                {/*<ComponentList parent={this} />*/}

                {/*<button onClick={() => this.parent.actions.push({*/}
                {/*    action: (sys: any, entity: any) => {*/}
                {/*        entity.add(ToBeDeleted);*/}
                {/*    }, entity: this.props.entity*/}
                {/*})}>Delete*/}
                {/*</button>*/}
            </div>
        );
    } catch (e) {
        return <p>Removing ...</p>;
    }
    // }
}
