import {system, System} from "@lastolivegames/becsy";
import {Keyboard} from '../components'

@system(s => s.afterWritersOf(Keyboard))
export class KeyboardSystem extends System {
    private readonly mouse = this.query(q => q.with(Keyboard).added.removed.write);

    execute(): void {
        for (const entity of this.mouse.added) {
            entity.write(Keyboard).initialize();
        }
        for (const entity of this.mouse.removed) {
            entity.write(Keyboard).reset();
        }
    }
}