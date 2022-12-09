import * as PIXI from 'pixi.js';
import json from './paytableSettings.json';

export default class PatternsUI {
    private container: PIXI.Container;
    public container2: PIXI.Container;
    private app: PIXI.Application;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container2 = new PIXI.Container();
        this.app = app;
        this.container = container;
        this.init();
    }

    private init() {
        this.container.addChild(this.container2);
        json.paytable3.forEach((symbol:any) => {
            const texture = this.app.loader.resources!.controllers.textures![`${symbol.name}`];
            const sprite = new PIXI.Sprite(texture);
            sprite.position.x = symbol.imgx;
            sprite.position.y = symbol.imgy;
            this.container2.addChild(sprite);
        });
    }
}