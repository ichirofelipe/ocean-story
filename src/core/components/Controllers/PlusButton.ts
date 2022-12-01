import * as PIXI from 'pixi.js';
import PlayButton from './PlayButton';

export default class PlusButton {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    public sprite: PIXI.Sprite;
    private playbutton: PlayButton;

    constructor(app: PIXI.Application, container: PIXI.Container, playbutton: PlayButton) {
        this.container = container;
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['icon_plus.png'];
        this.playbutton = playbutton;
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = (this.playbutton.sprite2.position.x + this.playbutton.sprite2.width) - (this.sprite.width + 11);
        this.sprite.position.y = ((this.playbutton.sprite2.height / 2) + this.playbutton.sprite2.position.y) - (this.sprite.height / 2);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.container.addChild(this.sprite);
    }
}