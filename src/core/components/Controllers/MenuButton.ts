import * as PIXI from 'pixi.js';

export default class MenuButton {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    public sprite: PIXI.Sprite;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container = container;
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['icon_menu.png'];
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = 16;
        this.sprite.position.y = 37;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.container.addChild(this.sprite);
    }
}