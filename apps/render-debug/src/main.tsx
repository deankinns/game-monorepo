import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {PhysicsLoader} from "enable3d";

PhysicsLoader('/ammo',  () => {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById("root")
    );
})

