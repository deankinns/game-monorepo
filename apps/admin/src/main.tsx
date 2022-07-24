import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import {Project,  PhysicsLoader} from "enable3d";
import {MainScene} from 'enable3d-package';

PhysicsLoader('/ammo', () => new Project({
    scenes:[MainScene],
    parent: 'root'
}));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
