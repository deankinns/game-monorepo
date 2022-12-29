import React, {Component, ContextType, ReactNode, useContext, useEffect, useRef, useState} from "react";
// import {ECSContext} from "./ECS";
import {Entity as _Entity} from "@lastolivegames/becsy";
import {ToBeDeleted} from 'becsy-package';
import {EntityContext} from "../hooks/useEntity";

// const createEntity =
//
// export const Entity = ({children}: any) => {
//     const ECS = useContext(ECSContext);
//     // const entity = useRef<_Entity>(null!);
//     const [entity, setEntity] = useState<_Entity>(null!);
//     // let entity: _Entity|null = null;
//     // const setEntity = (e: _Entity) => { entity = e; };
//     let sent = false;
//
//     useEffect(() => {
//         if (!sent) {
//             ECS.enqueueAction((sys, e, {setEntity}) => {
//                 // data.ref.current = sys.createEntity().hold();
//                 setEntity(sys.createEntity().hold())
//             }, null, {setEntity});
//         }
//         sent = true;
//
//         return () =>
//             ECS.enqueueAction((sys, e) => {
//                 e?.delete()
//             }, entity);
//             // entity.current = null!;
//
//     }, [])
//
//     return <EntityContext.Provider value={entity}>
//         {children}
//     </EntityContext.Provider>
// }

interface EntityProps {
    children: ReactNode;
    entity: _Entity;
}

export const Entity = ({children, entity}: EntityProps) => {
    return (
        <EntityContext.Provider value={entity}>
            {children}
        </EntityContext.Provider>
    );
}

// export class Entity extends Component<EntityProps> {
//     static contextType = ECSContext;
//     declare context: ContextType<typeof ECSContext>;
//
//     public entity: _Entity | null = null;
//
//     constructor(props: EntityProps) {
//         super(props);
//
//         // this.setEntity = this.setEntity.bind(this);
//
//         if (props.entity) {
//             this.entity = props.entity;
//         }
//     }
//
//     setEntity = (e: _Entity) => {
//         this.entity = e;
//     };
//
//     componentDidMount() {
//         if (!this.entity) {
//             this.context.enqueueAction((sys, e, {setEntity}) => {
//                 // data.ref.current = sys.createEntity().hold();
//                 setEntity(sys.createEntity().hold())
//             }, null, {setEntity: this.setEntity});
//         }
//     }
//
//     componentWillUnmount() {
//         this.context.enqueueAction((sys, e) => {
//             e?.add(ToBeDeleted)
//             e?.delete()
//         }, this.entity);
//         this.entity = null;
//     }
//
//     render() {
//         return (
//             <EntityContext.Provider value={this.entity}>
//                 {this.props.children}
//             </EntityContext.Provider>
//         );
//     }
// }