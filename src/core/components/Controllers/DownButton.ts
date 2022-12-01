import * as PIXI from 'pixi.js';
import BetBox from './BetBox';

export default class DownButton {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    public sprite: PIXI.Sprite;
    private betbox: BetBox;

    constructor(app: PIXI.Application, container: PIXI.Container, betbox: BetBox) {
        this.container = container;
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['icon_arrowdown.png'];
        this.betbox = betbox;
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = 70;
        this.sprite.position.y = 34;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.container.addChild(this.sprite);
    }
}