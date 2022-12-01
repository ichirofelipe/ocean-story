import * as PIXI from 'pixi.js';
import Functions from '../../Functions';

export default class GameBox {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    private sprite: PIXI.Sprite;
    public text: PIXI.Text;
    private label: PIXI.Text;

    constructor(app: PIXI.Application, container: PIXI.Container, game:number, style: PIXI.TextStyle, style2: PIXI.TextStyle) {
        this.container = container;
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['rectangle_gamein.png'];
        this.text = new PIXI.Text(Functions.formatGameNumber(game), style);
        this.label = new PIXI.Text('GAME', style2);
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = 271;
        this.sprite.position.y = 33;
        this.container.addChild(this.sprite);
        this.container.addChild(this.label);
        this.label.position.x = (this.sprite.position.x + (this.sprite.width / 2)) - (this.label.width / 2);
        this.label.position.y = 15;
        this.sprite.addChild(this.text);
        this.center()
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