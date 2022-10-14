import React from "react";

const utils = {
    DictIntersection: function (dictA: any, dictB: any) {
        const intersection: { [key: string]: any } = {};
        for (let k in dictB) {
            if (k in dictA) {
                intersection[k] = dictA[k];
            }
        }
        return intersection
    },

    DictDifference: function (dictA: any, dictB: any) {
        const diff = {...dictA};
        for (let k in dictB) {
            delete diff[k];
        }
        return diff;
    }
};

//
// class TerrainChunkRebuilder {
//     private _params: any;
//     private _pool: { [key: number]: { _params: object }[] };
//     private _queued: object[];
//     private _active: any;
//     _old: any[];
//     private _new: any[];
//
//     constructor(params?: any) {
//         this._pool = {};
//         this._params = params;
//         this._Reset();
//     }
//
//     AllocateChunk(params: any) {
//         const w = params.width;
//
//         if (!(w in this._pool)) {
//             this._pool[w] = [];
//         }
//
//         let c = null;
//         if (this._pool[w].length > 0) {
//             c = this._pool[w].pop() as { _params: any };
//             c._params = params;
//         } else {
//             c = params;
//         }
//
//         // c.Hide();
//
//         this._queued.push(c);
//
//         return c;
//     }
//
//     _RecycleChunks(chunks: any[]) {
//         for (let c of chunks) {
//             if (!(c.chunk.width in this._pool)) {
//                 this._pool[c.chunk.width] = [];
//             }
//
//             //c.chunk.Hide();
//             this._pool[c.chunk.width].push(c.chunk);
//         }
//     }
//
//     _Reset() {
//         this._active = null;
//         this._queued = [];
//         this._old = [];
//         this._new = [];
//     }
//
//     get Busy() {
//         return this._active;
//     }
//
//     Update2() {
//         for (let b of this._queued) {
//             // b._Rebuild().next();
//             this._new.push(b);
//         }
//         this._queued = [];
//
//         if (this._active) {
//             return;
//         }
//
//         if (!this._queued.length) {
//             this._RecycleChunks(this._old);
//             for (let b of this._new) {
//                 b.Show();
//             }
//             this._Reset();
//         }
//     }
//
//     Update() {
//         if (this._active) {
//             const r = this._active.next();
//             if (r.done) {
//                 this._active = null;
//             }
//         } else {
//             const b = this._queued.pop() as any;
//             if (b) {
//                 // this._active = b._Rebuild();
//                 this._new.push(b);
//             }
//         }
//
//         if (this._active) {
//             return;
//         }
//
//         if (!this._queued.length) {
//             this._RecycleChunks(this._old);
//             for (let b of this._new) {
//                 // b.Show();
//             }
//             this._Reset();
//         }
//     }
// }

