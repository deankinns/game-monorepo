import {GameEntity as YukaGameEntity, Vector3} from "yuka";
import {componentRegistry, componentWrapperInterface} from "./Components";

// export function applyMixins(derivedCtor: any, constructors: any[]) {
//     constructors.forEach((baseCtor) => {
//         Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
//             Object.defineProperty(
//                 derivedCtor.prototype,
//                 name,
//                 Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
//                 Object.create(null)
//             );
//         });
//     });
// }

export class GameEntity extends YukaGameEntity {
    constructor(private _components: componentWrapperInterface) {
        super();
    }

    get components() {
        return this._components;
    }

    handleMessage(telegram: {
        message: any;
        sender: any;
        receiver: any;
    }): boolean {
        return telegram.message(telegram.sender, telegram.receiver);
    }

    // update(delta: number): this {
    //     super.update(delta);
    //
    //     if (this._components.has(componentRegistry.Target)) {
    //         const target = this._components.read(componentRegistry.Target).value;
    //     }
    //
    //     return this;
    // }

    // addComponent(component: any, data: any): this {
    //     return this;
    // }
    //
    // getComponent(component: any): any {
    //     return component;
    // }
    //
    // hasComponent(component: any): boolean {
    //     return false;
    // }
    //
    // removeComponent(component: any): this {
    //     return this;
    // }
}

// applyMixins(YukaGameEntity, [componentWrapper]);

// applyMixins(GameEntity, [YukaGameEntity, componentWrapper])
