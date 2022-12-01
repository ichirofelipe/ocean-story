import * as PIXI from 'pixi.js';

export default class DropNumber {
    public container: PIXI.Container;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.app = app;
        this.init();
    }

    private init() {

    }
}