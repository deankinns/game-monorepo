import * as React from "react";
// import {EntityManager, NavMesh, Polygon, Think, Vector3, Vehicle, GameEntity} from 'yuka';
import {
    ExploreEvaluator,GetHealthEvaluator, PathPlanner, HEALTH_PACK, TYPE_COLLECTIBLE, Health,
    EntityManager, NavMesh, Polygon, Think, Vector3, Vehicle, GameEntity, Healing
} from 'yuka-package'
import {EntityList} from "./EntityList";

type Thing = Vehicle & {
    brain: Think<Thing>
    world: World
    prevUpdate: any
    data: any
} & any

type Other = GameEntity & {
    type: any,
    data: any
}

type Both = Other & Thing;

type World = {
    PathPlanner?: PathPlanner;
}
//
// type Healing = GameEntity & {
//     healing: number
// }
export class GameWindow extends React.Component<any, any> {

    manager: any;

    world: World = {};

    constructor(props: any) {
        super(props);

        this.state = {
            data: {},
            frame: 0
        }
    }

    componentDidMount() {
        this.manager = new EntityManager()
        const self = this

        const nav = new NavMesh();
        nav.fromPolygons([
            new Polygon().fromContour([
                new Vector3(0, 0, 0),
                new Vector3(0, 0, 1000),
                new Vector3(100, 0, 100),
                new Vector3(1000, 0, 0),
            ])
        ])
        this.world.PathPlanner = new PathPlanner(nav);

        const timer = requestAnimationFrame(function execute() {
            self.manager.update(1)

            // self.manager.entities.forEach(e => {
            //     e.data.deltaTime += 1
            //     // console.log(e as Health)
            // })
            self.world.PathPlanner?.update()
            self.setState({frame: self.state.frame + 1});
            requestAnimationFrame(execute)
        })
    }

    addEntity() {
        const vehicle = new Vehicle() as Thing
        const brain = new Think(vehicle);
        brain.addEvaluator(new ExploreEvaluator());
        brain.addEvaluator(new GetHealthEvaluator(1, HEALTH_PACK))
        vehicle.brain = brain;

        vehicle.position.x = Math.random() * 1000
        vehicle.position.z = Math.random() * 1000
        vehicle.updateNeighborhood = true;
        vehicle.data = {currentTime: 0}
        //
        // const prevUpdate = vehicle.update;
        vehicle.update = (delta: number) => {
            vehicle.prevUpdate = Vehicle.prototype.update
            vehicle.prevUpdate(delta)
            vehicle.data.currentTime += delta;
            brain.execute();
            brain.arbitrate();

            return vehicle;
        }

        // const t  = Thing.update;

        vehicle.world = this.world

        this.manager.add(vehicle)
    }

    addHealhPack() {
        const entity = new GameEntity() as Other;
        entity.position.x = Math.random() * 1000
        entity.position.z = Math.random() * 1000
        entity.type = [HEALTH_PACK, TYPE_COLLECTIBLE]
        entity.data = {}

        entity.addComponent(Healing, {amount: 50});

        this.manager.add(entity)

    }

    render() {
        return (<div id={`gameWindow${this.props.id}`}>
            <div className={'toolbar'}>
                {/*<button onClick={() => this.startStop()}>{this.state.running ? 'Stop' : 'Start'}</button>*/}
                {/*<button onClick={() => this.execute()}>Execute</button>*/}
                {/*<input type="text" value={this.state.name} onChange={this.handleChange}/>*/}
                <button onClick={() => this.addEntity()}>Player</button>
                <button onClick={() => this.addHealhPack()}>Health Pack</button>
            </div>
            {/*<div>{JSON.stringify(this.state.data)}</div>*/}
            <EntityList parent={this} />
        </div>);
    }
}
