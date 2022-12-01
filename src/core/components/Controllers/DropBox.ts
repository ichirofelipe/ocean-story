import * as PIXI from 'pixi.js';
import Functions from '../../Functions';
import PlayButton from './PlayButton';

export default class DropBox {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    private sprite: PIXI.Sprite;
    private playbutton: PlayButton;
    public text: PIXI.Text;

    constructor(app: PIXI.Application, container: PIXI.Container, playbutton: PlayButton, drop:number, style: PIXI.TextStyle) {
        this.container = container;
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['rectangle_dropnumber.png'];
        this.playbutton = playbutton;
        this.text = new PIXI.Text(Functions.formatGameNumber(drop), style);
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = (this.playbutton.sprite2.position.x + (this.playbutton.sprite2.width / 2)) - (this.sprite.width / 2);
        this.sprite.position.y = 8;
        this.container.addChild(this.sprite);
        this.sprite.addChild(this.text);
        this.center();
    }

    public updateGame(val: number){
        this.text.text = Functions.formatGameNumber(val);
        this.center();
    }

    private center(){
        this.text.position.x = (this.sprite.width / 2) - (this.text.width / 2);
        this.text.position.y = (this.sprite.height / 2) - (this.text.height / 2);
    }
}