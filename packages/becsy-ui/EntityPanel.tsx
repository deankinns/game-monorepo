import * as React from "react";
import {Component} from "react";
import {Entity, System} from "@lastolivegames/becsy";
// import {GameWindow} from "../../apps/ecs-debug/src/GameWindow";
import {RenderComponent, ToBeDeleted} from "becsy-package";
// import * as components from "../../node_modules/becsy-package"
import {ComponentPanel} from "./ComponentPanel";
import {EntityList} from "./EntityList";
import {ComponentList} from "./ComponentList";

let components = [];

export class EntityPanel extends Component<any, any> {

    entity: Entity;
    parent: React.Component & { actions: any[], world: any };

    has: string[] = []
    hasNot: string[] = []

    constructor(props: { entity: Entity, parent: React.Component & { actions: [], world: any } }) {
        super(props);
        this.entity = props.entity;
        this.parent = props.parent;
        this.state = {
            component: 'Select'
        }
        this.handleChange = this.handleChange.bind(this);

        // components = this.parent.world.world.__dispatcher.registry.types;
    }

    sortComponents() {
        this.has = []
        this.hasNot = []
        //@ts-ignore
        const types = this.parent.world.world.__dispatcher.registry.types.filter(type => type.__binding && type.name !== 'Alive')
        //@ts-ignore
        this.has = types.filter(type => {
            try {
                return this.entity.has(type)
            } catch (e) {
                return false;
            }
        })
        //@ts-ignore
        this.hasNot = types.filter(type => {
            try {
                return !this.entity.has(type)
            } catch (e) {
                return false;
            }
        })
    }

    entityOptions() {
        return [{name: 'Select'}, ...this.hasNot].map((k: any) =>
            <option key={k.name}>{k.name}</option>
        )
    }

    addComponent() {
        this.parent.actions.push({
            action: (sys: any, entity: any, data: { component: string }) => {

                //@ts-ignore
                const types = this.parent.world.world.__dispatcher.registry.types.filter(type => type.name === data.component)
                entity.add(types[0])

            }, entity: this.entity, data: {component: this.state.component}
        })

    }

    handleChange(event: any) {
        this.setState({component: event.target.value});
    }

    render() {
        this.sortComponents()
        try {
            return (
                <div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <select value={this.state.component} onChange={this.handleChange}>
                            {this.entityOptions()}
                        </select>
                        <button onClick={() => this.addComponent()}>Add</button>
                        <button onClick={() => this.parent.actions.push({
                            action: (sys: any, entity: any) => {
                                entity.add(ToBeDeleted);
                            }, entity: this.props.entity
                        })}>Delete
                        </button>
                    </div>
                    <ComponentList parent={this}/>
                </div>
            );
        } catch (e) {
            return <p>Removing ...</p>;
        }


    }
}