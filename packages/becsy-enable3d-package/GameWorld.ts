import { World } from "@lastolivegames/becsy";
import { Project } from "enable3d";
import "./systems";

export class GameWorld {
  world: World | undefined;
  // project: Project;

  async makeWorld(defs: any) {
    this.world = await World.create({ defs });
  }
}
