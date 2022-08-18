import {Entity, System, system} from "@lastolivegames/becsy";
import {Keyboard, RenderComponent} from "../components";
import {Deleter} from "./Deleter";

@system((s) => s.afterWritersOf(RenderComponent).before(Deleter))
export class Render extends System {
    // component: any;

    reference: any;

    selected: string[] = [];
    // show: any[] = [];

    items = this.query((q) => q.usingAll.current.added.removed.write);
    render = this.query(q => q.with(RenderComponent).added.current.removed.write.usingAll.read);

    private readonly keysPressed = new Set<string>();

    async prepare() {
        this.reference.current = this;
    }

    initialize(): void {


        document.addEventListener("keydown", (event: KeyboardEvent) => {
            this.keysPressed.add(event.key); // add the pressed key to our set
        });

        document.addEventListener("keyup", (event: KeyboardEvent) => {
            this.keysPressed.delete(event.key); // remove the released key from our set
        });

        // this.component.renderSystem = this;
    }

    execute() {
        let refresh = this.items.added.length > 0 || this.items.removed.length > 0 || this.render.added.length > 0 || this.render.removed.length > 0;

        if (this.keysPressed.has("p")) {
            this.createEntity(RenderComponent, {name: "something"});
        }


        const selected = this.selected;

        // @ts-ignore
        // const components = this.__dispatcher.registry.types.filter((type: any) => {
        //   // console.log(type.name, selected)
        //   if (selected.includes(type.name)) {
        //     return true;
        //   }
        // });

        // this.reference.current = this.items.current;

        // this.show = this.items.current.filter((item) =>
        //   item.hasAllOf(...components)
        // );

        if (refresh) {
            // console.log('update')
            this.cb(this)
            // this.component.setState({ frame: this.time });
        }

        // this.accessRecentlyDeletedData(true)

    }

    cblist = new Map();

    cb(system: System) {
        // console.log('cb')
        this.cblist.forEach((cb) => {
            cb(system)
        })
    }
}
