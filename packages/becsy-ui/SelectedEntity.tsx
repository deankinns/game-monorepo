import React from "react";
import {useEcsStore} from "../../node_modules/react-becsy";
import {EntityPanel} from "../../node_modules/becsy-ui";

export const SelectedEntity = () => {
    const selectedEntity = useEcsStore((state) => state.selectedEntity);

    return <div
        style={{
            position: "absolute",
            bottom: 0,
            maxHeight: "100vh",
            overflow: "auto",
        }}
    >
        {selectedEntity ? <EntityPanel
            entity={selectedEntity}
        /> : null}
        {/*<p style={{paddingLeft: '20vw'}}>{entities}</p>*/}
    </div>
}