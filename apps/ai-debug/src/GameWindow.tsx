import * as React from "react";
import {EntityManager, Think} from 'yuka';
import {Vehicle, ExploreEvaluator} from 'yuka-package'


export class GameWindow extends React.Component<any, any> {

    manager: any;

    constructor(props: any) {
        super(props);

        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        this.manager = new EntityManager()
        const self = this



        const timer = requestAnimationFrame(function execute() {
            self.manager.update(1 / 60)

            self.setState({data: self.manager.toJSON()});
            requestAnimationFrame(execute)
        })
    }

    addEntity() {
        const vehicle = new Vehicle()
        const brain = new Think(vehicle);
        brain.addEvaluator(new ExploreEvaluator());

        this.manager.add(vehicle)
    }

    render() {
        return (<div id={`gameWindow${this.props.id}`}>
            <div className={'toolbar'}>
                {/*<button onClick={() => this.startStop()}>{this.state.running ? 'Stop' : 'Start'}</button>*/}
                {/*<button onClick={() => this.execute()}>Execute</button>*/}
                {/*<input type="text" value={this.state.name} onChange={this.handleChange}/>*/}
                <button onClick={() => this.addEntity()}>Add</button>
            </div>
            <div>{JSON.stringify(this.state.data)}</div>
        </div>);
    }
}
