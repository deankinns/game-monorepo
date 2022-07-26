import {Scene3D} from 'enable3d';

export class MainScene extends Scene3D {
    async create() {


        await this.warpSpeed();
        this.haveSomeFun()
    }
}