export const Target = () => "target";
export const BrainComponent = () => "brain";
// export const Health = () => "health";
export const Healing = () => "healing";
export const Packed = () => "packed";
export const Collectable = () => "collectable";
export const PathRequestComponent = () => "PathRequestComponent";
export const PathComponent = () => "PathComponent";
export const MemoryComponent = () => "MemoryComponent";
export const Weapon = () => "Weapon";

export const componentRegistry = {
  Health: "Health" as any,
  Target: Target as any,
  BrainComponent: BrainComponent as any,
  Packed: Packed as any,
  Healing: Healing as any,
  Collectable: Collectable as any,
  PathRequestComponent: PathRequestComponent as any,
  PathComponent: PathComponent as any,
  MemoryComponent: MemoryComponent as any,
  Weapon: Weapon as any,
  State: "State" as any,
  Position: "Position" as any,
  Inventory: {contents: []} as any,
  Selected: "Selected" as any,
  ToBeDeleted: "ToBeDeleted" as any,
  Render: "Render" as any,
  VehicleEntityComponent: "VehicleEntityComponent" as any,
  NavMeshComponent: "NavMeshComponent" as any,
  GameEntityComponent: "GameEntityComponent" as any,
};

export interface componentWrapperInterface {
  alive: boolean;

  has(type: any): boolean;

  read(type: any): any;

  write(type: any): any;

  add(type: any, data: any): void;

  remove(type: any): void;

  hold(): void;
}

export class componentWrapper implements componentWrapperInterface {
  components: any[] = [];
  alive = true;

  has(type: any): boolean {
    return this.components[type] !== undefined;
  }

  read(type: any): any {
    return this.components[type];
  }

  write(type: any): any {
    return this.components[type];
  }

  add(type: any, data: any) {
    this.components[type] = data;
  }

  remove(type: any) {
    delete this.components[type];
  }

  hold() {}
}
