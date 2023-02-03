import * as React from "react";
// import {EntityManager, NavMesh, Polygon, Think, Vector3, Vehicle, GameEntity} from 'yuka';
import {
  ExploreEvaluator,
  GetHealthEvaluator,
  GetWeaponEvaluator,
  // PathPlanner,
  Vehicle,
  GameEntity,
  BrainComponent,
} from "becsy-yuka-package";

import {
  HEALTH_PACK,
  TYPE_COLLECTIBLE,
  Health,
  componentWrapper,
  componentRegistry,
  Collectable,
  Healing,
  EntityManager,
  NavMesh,
  Polygon,
  Think,
  Vector3,
  PathPlanner
} from "yuka-package";

import { MemorySystem } from "yuka";
import { EntityList, EntityManagerWrapper } from "yuka-ui";

type World = {
  PathPlanner?: PathPlanner;
};

// @ts-ignore
class ThinkOverride<T extends any> extends Think<T> {
  constructor(owner: T) {
    super(owner);
  }
}

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

   // const t = new Think({    });
   // t.addEvaluator(new ExploreEvaluator());
   //
   // t.arbitrate();

    const vehicle = new Vehicle(new componentWrapper());
    const brain = new ThinkOverride(vehicle);
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
