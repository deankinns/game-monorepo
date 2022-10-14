import {Vector2} from "three";
import {NoiseGenerator} from "./noise";
import {math} from "./math";

export class HeightGenerator {
    _position: Vector2;
    _radius: number[]
    _generator: any

    constructor(generator: NoiseGenerator, position: Vector2, minRadius: number, maxRadius: number) {
        this._position = position.clone();
        this._radius = [minRadius, maxRadius];
        this._generator = generator;
    }

    Get(x: number, y: number) {
        const distance = this._position.distanceTo(new Vector2(x, y));
        let normalization = 1.0 - math.sat(
            (distance - this._radius[0]) / (this._radius[1] - this._radius[0]));
        normalization = normalization * normalization * (3 - 2 * normalization);

        return [this._generator.Get(x, y), normalization];
    }
}