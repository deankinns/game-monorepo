import * as React from "react";
import {GameWorld, RenderComponent,} from "becsy-package";
import {EntityList, GameWorldWrapper, GameWorldContext} from "becsy-ui";
import {createRef, useContext,} from "react";


export class GameWindow extends React.Component<any, any> {

    worldRef: React.RefObject<GameWorld>;

    constructor(props: any) {
        super(props);
        this.state = {
            name: "dave",
            running: false,
            frames: 0,
        };


        this.handleChange = this.handleChange.bind(this);

        this.worldRef = createRef();

    }

    async componentDidMount() {

        const self = this;
        const timer = requestAnimationFrame(function execute() {

            self.worldRef.current?.world?.execute();
            requestAnimationFrame(execute);
        });
    }




    handleChange(event: any) {
        this.setState({name: event.target.value});
    }


    children = [];

    render() {
        return (
            <div id={`gameWindow${this.props.id}`} className={"entities"}>
                <GameWorldWrapper ref={this.worldRef}>
                    <Toolbar />
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            gridGap: "1vw",
                        }}
                    >
                        <EntityList />
                    </div>
                </GameWorldWrapper>
            </div>
        );
    }
}

const Toolbar = () => {
    const world = useContext(GameWorldContext)

    const [running, setRunning] = React.useState(false);

    const addEntity = () => {
        world?.enqueueAction(
             (sys: any) => {
                sys.createEntity(RenderComponent, {name: "dave"});
            }
        )
    }

    return <div className={"toolbar"}>
        <button onClick={() => setRunning(!running)}>{running?'stop':'start'}</button>
        <button onClick={() => addEntity()}>Add</button>
    </div>
}
