import * as React from "react";
// import {EntityManager, NavMesh, Polygon, Think, Vector3, Vehicle, GameEntity} from 'yuka';
import {
  ExploreEvaluator,
  GetHealthEvaluator,
  GetWeaponEvaluator,
  PathPlanner,
  HEALTH_PACK,
  TYPE_COLLECTIBLE,
  Health,
  EntityManager,
  NavMesh,
  Polygon,
  Think,
  Vector3,
  Vehicle,
  GameEntity,
  Healing,
  componentWrapper,
  BrainComponent,
  componentRegistry,
  Collectable,
} from "yuka-package";

import { MemorySystem } from "yuka";
import { EntityList, EntityManagerWrapper } from "yuka-ui";

type World = {
  PathPlanner?: PathPlanner;
};


export class GameWindow extends React.Component<any, any> {
  manager: any;

  world: World = {};

  constructor(props: any) {
    super(props);

    this.state = {
      data: {},
      frame: 0,
    };
  }

  componentDidMount() {
    this.manager = new EntityManager();
    const self = this;

    const nav = new NavMesh();
    nav.fromPolygons([
      new Polygon().fromContour([
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 100),
        new Vector3(100, 0, 100),
        new Vector3(100, 0, 0),
      ]),
    ]);
    this.world.PathPlanner = new PathPlanner(nav);

    const timer = requestAnimationFrame(function execute() {
      self.manager.update(1);
      self.world.PathPlanner?.update();
      self.setState({ frame: self.state.frame + 1 });
      requestAnimationFrame(execute);
    });
  }

  addPlayer() {
    const vehicle = new Vehicle(new componentWrapper());
    const brain = new Think(vehicle);
    brain.addEvaluator(new ExploreEvaluator());
    brain.addEvaluator(new GetHealthEvaluator(1, componentRegistry.Healing));
    brain.addEvaluator(new GetWeaponEvaluator(.8, componentRegistry.Weapon));
    // vehicle.brain = brain;
    vehicle.components.add(BrainComponent, { object: brain });

    vehicle.position.x = Math.random() * 1000;
    vehicle.position.z = Math.random() * 1000;
    vehicle.updateNeighborhood = true;
    vehicle.data = { currentTime: 0 };

    vehicle.components.add(componentRegistry.MemoryComponent, {
      system: new MemorySystem(vehicle),
    });

    vehicle.update = (delta: number) => {
      vehicle.prevUpdate = Vehicle.prototype.update;
      vehicle.prevUpdate(delta);
      vehicle.data.currentTime += delta;
      brain.execute();
      brain.arbitrate();

      return vehicle;
    };

    //@ts-ignore
    vehicle.world = this.world;

    this.manager.add(vehicle);
  }

  addHealthPack() {
    const entity = new GameEntity(new componentWrapper());
    entity.position.x = Math.random() * 1000;
    entity.position.z = Math.random() * 1000;

    entity.components.add(componentRegistry.Healing, { amount: 50 });
    entity.components.add(componentRegistry.Collectable, null);

    this.manager.add(entity);
  }

  addRifle() {
    const entity = new GameEntity(new componentWrapper());
    entity.position.x = Math.random() * 1000;
    entity.position.z = Math.random() * 1000;
    entity.components.add(componentRegistry.Weapon, {});
    entity.components.add(componentRegistry.Collectable, null);
    this.manager.add(entity);
  }

  render() {
    return (
      <div id={`gameWindow${this.props.id}`}>
        <div className={"toolbar"}>
          <button onClick={() => this.addPlayer()}>Player</button>
          <button onClick={() => this.addHealthPack()}>Health Pack</button>
          <button onClick={() => this.addRifle()}>Gun</button>
        </div>
        <EntityManagerWrapper manager={this.manager} >
          <EntityList />
        </EntityManagerWrapper>
      </div>
    );
  }
}
