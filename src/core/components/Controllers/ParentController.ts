import * as PIXI from 'pixi.js';

export default class ParentController {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    private sprite: PIXI.Sprite;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['rectangle_parent.png'];
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.container.addChild(this.sprite);
    }
}