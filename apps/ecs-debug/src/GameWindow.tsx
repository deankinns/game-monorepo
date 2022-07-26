import * as React from "react";
import {GameWorld, RenderComponent, Render} from "becsy-package";
import {EntityPanel} from "./EntityPanel";
import {EntityList} from "./EntityList";

import * as systems from 'becsy-package';

export class GameWindow extends React.Component<any, any> {

    world: GameWorld;
    actions: any;
    timer: any

    constructor(props: any) {
        super(props);
        this.state = {
            name: 'dave',
            running: false,
            frames: 0
        }
        this.world = new GameWorld();

        // window.BECSY = this.world;
        this.actions = [];
        const self = this

        this.timer = () => requestAnimationFrame(function execute() {
            self.world.world?.execute();
            self.setState({frames: self.world.world?.stats.frames})
            // window.postMessage({
            //     name: 'update',
            //     data: self.world.world?.stats,
            //     source: 'becsy-inspector'
            // })
            if (self.state.running) requestAnimationFrame(execute)
        })

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        await this.world.makeWorld([
            Render, {component: this}
        ]);


        this.world.world?.createEntity(RenderComponent, {name: this.state.name})
    }

    execute() {
        this.world.world?.execute()
        console.log(this.world.world?.stats)

        // window.postMessage({
        //     name: 'update',
        //     data: this.world.world?.stats,
        //     source: 'becsy-inspector'
        // })

        // window.BECSY = this.world.world?.stats;
    }

    addEntity() {
        this.actions.push({
            action: (sys: any) => {
                sys.createEntity(RenderComponent, {name: this.state.name})
            }, entity: null
        })

    }

    handleChange(event: any) {
        this.setState({name: event.target.value});
    }

    startStop() {
        this.setState({running: !this.state.running})
        this.timer();
    }

    children = [];


    render() {
        return <div id={`gameWindow${this.props.id}`} className={'entities'}>
            <div className={'toolbar'}>
                <button onClick={() => this.startStop()}>{this.state.running ? 'Stop' : 'Start'}</button>
                <button onClick={() => this.execute()}>Execute</button>
                <input type="text" value={this.state.name} onChange={this.handleChange}/>
                <button onClick={() => this.addEntity()}>Add</button>
            </div>

            <div className="children">
                <EntityList parent={this}/>
            </div>
        </div>;
    }
}
