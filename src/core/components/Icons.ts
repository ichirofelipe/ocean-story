import * as PIXI from 'pixi.js';

export default class Icons {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    public sprite: PIXI.Sprite;

    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.container = new PIXI.Container();
        this.app = app;
        this.texture = texture;
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.scale.set(.4);
        this.sprite.addListener('mouseover', this.hoverin.bind(this));
        this.sprite.addListener('mouseout', this.hoverout.bind(this));
        this.container.addChild(this.sprite);
    }

    private hoverin(){
        this.sprite.alpha = .7;
    }

    private hoverout(){
        this.sprite.alpha = 1;
    }
}