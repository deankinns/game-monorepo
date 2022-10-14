// import 'https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js';
// import perlin from 'https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module/perlin.js';

import {math} from './math.js';
// import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";
import SimplexNoise, {createNoise2D} from "simplex-noise";

import Alea from "alea";

// export const noise = (function() {

class _PerlinWrapper {
    constructor() {
    }

    noise2D(x:number, y:number) {
        return 1// perlin(x, y) * 2.0 - 1.0;
    }
}

class _RandomWrapper {
    _values: {[key: string]: number};
    constructor() {
        this._values = {};
    }

    _Rand(x: number, y: number) {
        const k = x + '.' + y;
        if (!(k in this._values)) {
            this._values[k] = Math.random() * 2 - 1;
        }
        return this._values[k];
    }

    noise2D(x: number, y: number) {
        // Bilinear filter
        const x1 = Math.floor(x);
        const y1 = Math.floor(y);
        const x2 = x1 + 1;
        const y2 = y1 + 1;

        const xp = x - x1;
        const yp = y - y1;

        const p11 = this._Rand(x1, y1);
        const p21 = this._Rand(x2, y1);
        const p12 = this._Rand(x1, y2);
        const p22 = this._Rand(x2, y2);

        const px1 = math.lerp(xp, p11, p21);
        const px2 = math.lerp(xp, p12, p22);

        return math.lerp(yp, px1, px2);
    }
}
type NoiseParams = {seed: any, noiseType: string, scale: number, height: number, octaves: number, lacunarity: number, persistence: number, exponentiation: number}

export class NoiseGenerator {
    private _params: NoiseParams;
    private _noise: { rand: _RandomWrapper; perlin: _PerlinWrapper; simplex: any };
    constructor(params: NoiseParams) {
        this._params = params;
        this._noise = {
            simplex: createNoise2D(Alea(this._params.seed)),
            perlin: new _PerlinWrapper(),
            rand: new _RandomWrapper(),
        };
    }

    Get(x: number, y: number) {
        const xs = x / this._params.scale;
        const ys = y / this._params.scale;
        // @ts-ignore
        const noiseFunc = this._noise[this._params.noiseType]??this._noise.perlin;
        const G = 2.0 ** (-this._params.persistence);
        let amplitude = 1.0;
        let frequency = 1.0;
        let normalization = 0;
        let total = 0;
        for (let o = 0; o < this._params.octaves; o++) {
            const noiseValue = noiseFunc(
                xs * frequency, ys * frequency) * 0.5 + 0.5;
            total += noiseValue * amplitude;
            normalization += amplitude;
            amplitude *= G;
            frequency *= this._params.lacunarity;
        }
        total /= normalization;
        return Math.pow(
            total, this._params.exponentiation) * this._params.height;
    }
}

//
//   return {
//     Noise: _NoiseGenerator
//   }
// })();
