import * as React from "react";

import {Project} from "enable3d";
import {MainScene} from 'enable3d-package';
import {GameWorld, Render, RenderComponent} from 'becsy-package';
import {EntityList} from 'becsy-ui';

import * as becsy_systems from 'becsy-package/systems';
import * as becsy_enable3d_systems from 'becsy-enable3d-package/systems';


export class GameWindow extends React.Component<any, any> {

    actions: any[] = [];
    children = [];
    world: GameWorld | undefined;
    project: Project | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            frames: 0
        }
    }

    async componentDidMount() {
        this.project = new Project({
            scenes: [MainScene],
            parent: `gameWindow${this.props.id}`,
        })

        const systems = [
            ...[
                Render, {component: this},
                becsy_enable3d_systems.SceneManagerSystem, {projectObject: this.project}
            ],
            //@ts-ignore
            ...Object.values(becsy_systems),
            //@ts-ignore
            ...Object.values(becsy_enable3d_systems),
        ]

        // project.
        const world = new GameWorld();
        await world.makeWorld(systems);

        this.world = world;


        this.project.scenes.forEach(scene => {
            scene.update = (time, delta) => {
                // @ts-ignore
                world.world.execute(time, delta)
                this.setState({frames: time});
            }
        })
    }

    addEntity() {
        this.actions.push({
            action: (sys: any) => {
                sys.createEntity(RenderComponent)
            }, entity: null
        })

    }
    debug = false;
    toggleDebug() {
        this.debug = !this.debug;
        const physics = this.project?.physics as any;
        physics.debug.mode(1 + 2048 + 4096);
        if (this.debug) {
            physics.debug?.enable();
        } else {
            physics.debug.disable();
        }
    }

    render() {
        return (
            <div>
                <div id={`gameWindow${this.props.id}`}></div>
                <div className={'toolbar'} style={{top: 0, position: 'absolute'}}>
                    <button onClick={() => this.addEntity()}>Add</button>
                    <button onClick={() => this.toggleDebug()}>debug</button>
                </div>
                <div className="children"
                     style={{top: 0, right: 0, position: 'absolute', height: '100vh', overflow: 'auto'}}>
                    <h5>Entities</h5>
                    <EntityList parent={this}/>
                </div>
            </div>
        );
    }
}
