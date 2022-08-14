import { component, field, Type } from "@lastolivegames/becsy";

@component
export class Keyboard {
  @field({ type: Type.object, default: {} }) declare states: object;
  @field(Type.object) declare mapping: object;

  onkeydown = (e: { key: any }) => {
    this.setKeyState(e.key, "down");
  };

  onkeyup = (e: { key: any }) => {
    this.setKeyState(e.key, "up");
  };

  initialize(): void {
    this.states = {};
    window.addEventListener("keydown", this.onkeydown, false);
    window.addEventListener("keyup", this.onkeyup, false);
  }

  reset(): void {
    window.removeEventListener("keydown", this.onkeydown);
    window.removeEventListener("keyup", this.onkeyup);
  }

  resetKeys(): void {
    Object.keys(this.states).forEach((key) => {
      const state = this.getKeyState(key);
      state.prev = state.current;
    });
  }

  setKeyState(key: any, value: string): void {
    const state = this.getKeyState(key);
    state.prev = state.current;
    state.current = value;
  }

  getKeyState(key: string): any {
    // @ts-ignore
    if (!this.states[key]) {
      // @ts-ignore
      this.states[key] = {
        prev: "up",
        current: "up",
      };
    }
    // @ts-ignore
    return this.states[key];
  }

  isPressed(name: string): boolean {
    return this.getKeyState(name).current === "down";
  }
}
