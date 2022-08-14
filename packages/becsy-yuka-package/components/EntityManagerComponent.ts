import { component, field } from "@lastolivegames/becsy";
import { EntityManager } from "yuka";

@component
export class EntityManagerComponent {
  @field.object declare manager: EntityManager;
}
