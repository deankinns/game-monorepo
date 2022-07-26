import * as React from "react";
import {Component} from "react";
import {Entity, System} from "@lastolivegames/becsy";
import {GameWindow} from "./GameWindow";
import {RenderComponent, ToBeDeleted} from "becsy-package";
import * as components from "becsy-package"
import {ComponentPanel} from "./ComponentPanel";
import {EntityList} from "./EntityList";
import {ComponentList} from "./ComponentList";


export class EntityPanel extends Component<any, any> {

    entity: Entity;
    parent: GameWindow;

    has: string[] = []
    hasNot: string[] = []

    constructor(props: { entity: Entity, parent: GameWindow }) {
        super(props);
        this.entity = props.entity;
        this.parent = props.parent;
        this.state = {
            component: 'Select'
        }
        this.handleChange = this.handleChange.bind(this);

        //@ts-ignore

    }

    sortComponents() {
        this.has = []
        this.hasNot = []
        //@ts-ignore
        const types = this.parent.world.world.__dispatcher.registry.types.filter(type => type.__binding && this.name !== 'Alive')
        //@ts-ignore
        this.has = types.filter(type => this.entity.has(type))
        //@ts-ignore
        this.hasNot = types.filter(type => !this.entity.has(type))
    }

    entityOptions() {
        // const keys = ['Select']
        // this.sortComponents()
        return [{name:'Select'}, ...this.hasNot].map((k: any) =>
            <option key={k.name}>{k.name}</option>
        )
    }

    addComponent() {
        this.parent.actions.push({
            action: (sys: any, entity: any, data: {component: string}) => {

                //@ts-ignore
                const component = components[data.component]

                entity.add(component)
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
                    <div>
                        <select value={this.state.component} onChange={this.handleChange}>
                            {this.entityOptions()}
                        </select>
                        <button onClick={() => this.addComponent()}>Add</button>
                    </div>

                    <p>{this.props.entity.read(RenderComponent).name}</p>

                    <ComponentList parent={this} />

                    <button onClick={() => this.parent.actions.push({
                        action: (sys: any, entity: any) => {
                            entity.add(ToBeDeleted);
                        }, entity: this.props.entity
                    })}>Delete
                    </button>
                </div>
            );
        } catch (e) {
            return <p>Removing ...</p>;
        }


    }
}