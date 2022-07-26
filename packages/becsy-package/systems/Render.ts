import {Entity, System, system} from "@lastolivegames/becsy";
import {RenderComponent} from "../components";

@system
export class Render extends System {
    component: any;

    items = this.query(q => q.with(RenderComponent).usingAll.added.removed.write);
    private readonly keysPressed = new Set<string>();

    initialize(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.keysPressed.add(event.key);  // add the pressed key to our set
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keysPressed.delete(event.key);  // remove the released key from our set
        });
    }

    execute() {

        if (this.keysPressed.has('p')) {
            this.createEntity(RenderComponent, {name: 'something'})
        }
        for (const action of this.component.actions) {
            action.action(this, action.entity, action.data);
        }
        this.component.actions = [];

        for (const item of this.items.added) {
            this.component.children.push(item.hold())
        }

        this.accessRecentlyDeletedData(true)
        for (const item of this.items.removed) {
            this.component.children = this.component.children.filter((e: Entity) => {
                return !e.isSame(item);
            });
        }
    }
}