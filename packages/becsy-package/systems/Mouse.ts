import {system, System} from "@lastolivegames/becsy";
import {Mouse as MouseComponent} from '../components'

@system(s => s.afterWritersOf(MouseComponent))
export class MouseSystem extends System {
    private readonly mouse = this.query(q => q.with(MouseComponent).added.removed.write);

    execute(): void {
        for (const entity of this.mouse.added) {
            entity.write(MouseComponent).initialize();
        }
        this.accessRecentlyDeletedData(true)
        for (const entity of this.mouse.removed) {
            entity.write(MouseComponent).reset();
        }
    }
}