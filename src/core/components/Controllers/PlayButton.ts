import * as PIXI from 'pixi.js';
import Functions from '../../Functions';

export default class PlayButton {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture2: PIXI.Texture;
    public sprite2: PIXI.Sprite;
    private texture: PIXI.Texture;
    public sprite: PIXI.Sprite;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container = container;
        this.app = app;
        this.texture2 = this.app.loader.resources!.controllers.textures!['rectangle_start.png'];
        this.texture = this.app.loader.resources!.controllers.textures!['play.png'];
        this.init();
    }

    private init() {
        this.sprite2 = new PIXI.Sprite(this.texture2);
        this.sprite2.position.x = 373;
        this.sprite2.position.y = 28;
        this.container.addChild(this.sprite2);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite2.addChild(this.sprite);
        this.sprite.position.x = (this.sprite2.width / 2) - (this.sprite.width / 2);
        this.sprite.position.y = (this.sprite2.height / 2) - (this.sprite.height / 2);
    }
}