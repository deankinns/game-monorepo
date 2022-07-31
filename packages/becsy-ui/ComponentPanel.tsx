import * as React from "react";
import {Entity} from "@lastolivegames/becsy";
import {EntityPanel} from "./EntityPanel";
import {toJSON, fromJSON, stringify} from 'flatted';

export class ComponentPanel extends React.Component<any, any> {
    constructor(props: { component: any, parent: EntityPanel }) {
        super(props);
    }


    removeComponent(component: any) {
        this.props.parent.parent.actions.push({
            action: (sys: any, entity: Entity, data: { component: any }) => {
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

        let dataStr = ''
        try {
            dataStr = JSON.stringify(data)
        } catch (e) {
            // dataStr = data.toJSON();

        }
        const cache: any[] = [];
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <h6 style={{flex: 1}}>{this.props.component.name}</h6>
                    <button onClick={() => this.removeComponent(this.props.component)}>-</button>
                </div>
                <div style={{maxWidth: '30vw', wordWrap: 'break-word', overflow: 'auto'}}>
                    {dataStr}
                </div>
            </div>
        )
    }
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                // return;
            }
            seen.add(value);
        }

        return value;
    };
};

class RecursiveMap extends Map {
    static fromJSON(any: any) {
        // @ts-ignore
        return new this(fromJSON(any));
    }

    toJSON() {
        return toJSON([...this.entries()]);
    }
}

function simpleStringify(object) {
    var simpleObject = {};
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof (object[prop]) == 'object') {
            continue;
        }
        if (typeof (object[prop]) == 'function') {
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};

function censor(censor) {
    var i = 0;

    return function (key, value) {
        if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';

        ++i; // so we know we aren't using the original object anymore

        return value;
    }
}

//
// function stringify(val, depth, replacer, space) {
//     depth = isNaN(+depth) ? 1 : depth;
//     function _build(key, val, depth, o, a) { // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
//         return !val || typeof val != 'object' ? val : (a=Array.isArray(val), JSON.stringify(val, function(k,v){ if (a || depth > 0) { if (replacer) v=replacer(k,v); if (!k) return (a=Array.isArray(v),val=v); !o && (o=a?[]:{}); o[k] = _build(k, v, a?depth:depth-1); } }), o||(a?[]:{}));
//     }
//     return JSON.stringify(_build('', val, depth), null, space);
// }