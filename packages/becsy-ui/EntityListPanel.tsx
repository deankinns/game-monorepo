import * as React from "react";
import {EntityList} from "./EntityList";
import {useContext, useEffect} from "react";
// import { RenderContext} from "./GameWorldWrapper";
import {Entity} from "@lastolivegames/becsy";

import {useEcsStore, useSystem} from 'react-becsy'
import {Render} from "becsy-package";

// export class EntityListPanel extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props);
//
//     this.state = {
//       selected: [],
//     };
//   }

export const EntityListPanel = () => {

    const [selected, setSelected] = React.useState([] as any[]);

    // const world = useContext(ECSContext);
    // const world = useContext(GameWorldContext);
    const ecs = useEcsStore(state => state.ecs);
    // const world = useEcsStore().ecs;
    const render = useSystem(Render) as Render
    // const render = useContext(RenderContext);

    const select = (event: { target: { value: any, checked: boolean } }, type: any) => {

        if (event.target.checked) {
            // if (!this.props.parent.selected.includes(event.target.value)) {
            // this.setState(prevState => ({selected: [...prevState.selected, event.target.value]}))
            // this.props.parent.selected.push(event.target.value)

            // const prev = selected;
            // prev.push(type);
            // this.props.parent.selected = prev;
            // this.setState({ selected: prev });
            setSelected(prevState => [...prevState, type]);

            // }
        } else {
            // const newSel = selected.filter(
            //     (e: any) => e !== type
            // );
            // this.props.parent.selected = newSel;
            // this.setState({ selected: newSel });
            setSelected(prevState => prevState.filter((e: any) => e !== type));
            // this.setState(prevState => ({selected: prevState.selected.filter(day => day !== event.target.value)}));
            // this.props.parent.selected = this.props.parent.selected.filter((e: any) => e !== event.target.value)
        }

        // return true
    }

    const listTypes = () => {
        // console.log(selected)
        // const world = ecsStore?.ecs;
        try {
            //@ts-ignore
            return ecs.world?.__dispatcher.registry.types
                .filter((type: any) => type.name !== "Alive")
                .map((e: any) => (
                    <p key={e.name}>
                        <label>
                            {e.name}{" "}
                            <input
                                // checked={selected.includes(e.name)}
                                onChange={(ev) => select(ev, e)}
                                type={"checkbox"}
                                value={e.name}
                            />
                        </label>
                    </p>
                ));
        } catch (e) {
        }
    }

    return (
        <div>
            <form
                style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr"}}
            >
                {listTypes()}
            </form>
            <div>
                <EntityList filters={selected}/>
            </div>
        </div>
    );

}
