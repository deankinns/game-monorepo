import * as React from "react";

import {Project, PhysicsLoader} from "enable3d";
import {MainScene} from 'enable3d-package';


export class GameWindow extends React.Component<any, any> {

    componentDidMount() {
                new Project({
            scenes: [MainScene],
            parent: `gameWindow${this.props.id}`
        })
    }

    render() {
      return <div id={`gameWindow${this.props.id}`}></div>;
  }
}
