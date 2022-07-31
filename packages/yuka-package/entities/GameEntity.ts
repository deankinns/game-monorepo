import {GameEntity as YukaGameEntity} from "yuka";

interface LooseObject {
    [key: string]: any
}

interface componentWrapperInterface {
    // components: []
    components: LooseObject;

    hasComponent(component: any): boolean;

    addComponent(component: any, data: any): this;

    removeComponent(component: any): this;

    getComponent(component: any): any;
}

class componentWrapper implements componentWrapperInterface {
    components = {};

    hasComponent(component: any) {
        return this.components.hasOwnProperty(component)
    }

    addComponent(component: any, data: any) {

        // @ts-ignore
        this.components[component] = data;
        // this.components[component] = data;

        return this;
    }

    removeComponent(component: any) {
        // @ts-ignore
        delete this.components[component]

        return this;
    }

    getComponent(component: any) {
        // @ts-ignore
        return this.components[component]
    }


}

function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null)
            );
        });
    });
}

export class GameEntity extends YukaGameEntity implements YukaGameEntity, componentWrapper{

    components = [];

    addComponent(component: any, data: any): this {
        return this;
    }

    getComponent(component: any): any {
        return component;
    }

    hasComponent(component: any): boolean {
        return false;
    }

    removeComponent(component: any): this {
        return this;
    }


}

// applyMixins(YukaGameEntity, [componentWrapper]);

applyMixins(GameEntity, [YukaGameEntity, componentWrapper])