import React, {useState} from "react";
import {EntityListPanel} from "../../node_modules/becsy-ui";

export const SidePanel = () => {
    const [show, setShow] = useState(false);

    return <div
        className={"w3-container w3-light-grey"}
        style={{
            top: 0,
            right: 0,
            position: "absolute",
            height: "100vh",
            overflow: "auto",
            zIndex: 999,
        }}
    >
        <button onClick={() => setShow(!show)}>
            {show ? ">>" : "<<"}
        </button>
        {show ? <EntityListPanel/> : null}
    </div>
}