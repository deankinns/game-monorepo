import {component, field, Type} from "@lastolivegames/becsy";

@component
export class Mouse {
    @field(Type.float32) declare clientX: number;
    @field(Type.float32) declare clientY: number;
    @field(Type.float32) declare movementX: number;
    @field(Type.float32) declare movementY: number;
    @field(Type.object) declare states: object;
    @field(Type.object) declare mapping: object;
    @field(Type.boolean) declare pointerLocked: boolean;
    @field(Type.object) declare element: HTMLElement;

    // public buttons: { '0': string; '1': string; '2': string };
    buttons = {
        0: 'left-button',
        1: 'middle-button',
        2: 'right-button',
    };
    public changed = true;


    downHandler = (e: { button: string | number; }): void => {
        // @ts-ignore
        this.setKeyState(this.buttons[e.button], 'down');
        this.changed = true;
    }

    moveHandler = (e: { clientX: number; clientY: number; movementX: any; mozMovementX: any; webkitMovementX: any; movementY: any; mozMovementY: any; webkitMovementY: any; }) => {
        if (this.pointerLocked) {
            this.clientX = window.innerWidth / 2;
            this.clientY = window.innerHeight / 2;
        } else {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
        }

        // this.lastTimestamp = e.timeStamp;
        this.movementX += e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        this.movementY += e.movementY || e.mozMovementY || e.webkitMovementY || 0;
        // console.log('move');
        this.setKeyState('clientX', this.clientX);
        this.setKeyState('clientY', this.clientY);
        this.changed = true;
    }

    upHandler = (e: { button: string | number; }) => {
        // @ts-ignore
        this.setKeyState(this.buttons[e.button], 'up');
        this.changed = true;
    }

    lockHandler = () => {
        this.pointerLocked = !!document.pointerLockElement;
    }

    contextMenuHandler = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        return false;
    }

    wheelHandler = (e: any) => {
        if (isNaN(this.getKeyState('scroll').current)){
            this.setKeyState('scroll', 0)
        }
        this.setKeyState('scroll', this.getKeyState('scroll').current + e.deltaY)
        this.changed = true
    }


    initialize(): void {
        this.states = {};
        const element = this.element ?? document
        // @ts-ignore
        element.addEventListener('mousemove', this.moveHandler, false);
        element.addEventListener('pointerdown', this.downHandler, true);
        element.addEventListener('pointerup', this.upHandler, false);
        element.addEventListener('pointerlockchange', this.lockHandler, false);
        element.addEventListener('contextmenu', this.contextMenuHandler, false);
        element.addEventListener('wheel', this.wheelHandler, false);

        console.log('init mouse')
    }

    reset(): void {
        // @ts-ignore
        this.element.removeEventListener('mousemove', this.moveHandler);
        this.element.removeEventListener('pointerdown', this.downHandler);
        this.element.removeEventListener('pointerup', this.upHandler);
        document.removeEventListener('pointerlockchange', this.lockHandler);
        this.element.removeEventListener('contextmenu', this.contextMenuHandler);
        this.changed = false;
    }

    resetButtons(): void {
        Object.keys(this.states).forEach(key => {
            const state = this.getKeyState(key);
            state.prev = state.current;
        });
        this.movementX = 0;
        this.movementY = 0;
    }

    setKeyState(key: string, value: string | number): void {
        const state = this.getKeyState(key);
        state.prev = state.current;
        state.current = value;
    }

    getKeyState(key: string): any {
        // @ts-ignore
        if (!this.states[key]) {
            // @ts-ignore
            this.states[key] = {
                prev: 'up',
                current: 'up',
            };
        }
        // @ts-ignore
        return this.states[key];
    }
}
