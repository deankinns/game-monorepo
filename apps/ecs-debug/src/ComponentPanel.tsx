import * as React from "react";
import { Entity} from "@lastolivegames/becsy";
import {EntityPanel} from "./EntityPanel";
import * as components from "becsy-package"

export class ComponentPanel extends React.Component<any, any> {
    constructor(props: { component: any, parent: EntityPanel }) {
        super(props);
    }


    removeComponent(component: any) {
        this.props.parent.parent.actions.push({
            action: (sys: any, entity: Entity, data: {component: any}) => {
                entity.remove(data.component)
            },
            entity: this.props.parent.entity,
            data: {component}
        })

    }

    render() {

        //@ts-ignore
        // const componentClass = components[this.props.component]
        let component;
        try {
            //@ts-ignore
            component = this.props.parent.entity.read(this.props.component)
        } catch (e) {
            return (<div>invalid {this.props.component.name}</div>);
        }


        const data = []
        if (this.props.component.prototype.constructor.schema) {
            for (const [key, value] of Object.entries(this.props.component.prototype.constructor.schema)) {
                data.push({key, value: component[key]})
            }
        }


        return (<div>
                <div>{this.props.component.name}</div>
                <div>{JSON.stringify(data)}</div>
                <button onClick={() => this.removeComponent(this.props.component)}>-</button>
            </div>


        )
    }
}