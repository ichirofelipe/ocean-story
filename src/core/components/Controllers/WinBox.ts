import * as PIXI from 'pixi.js';
import Functions from '../../Functions';

export default class DropBox {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private texture: PIXI.Texture;
    private sprite: PIXI.Sprite;
    public text: PIXI.Text;
    private label: PIXI.Text;

    constructor(app: PIXI.Application, container: PIXI.Container, win:number, style: PIXI.TextStyle, style2: PIXI.TextStyle) {
        this.container = container;
        this.app = app;
        this.texture = this.app.loader.resources!.controllers.textures!['rectangle_win.png'];
        this.text = new PIXI.Text(Functions.formatNumber(win), style);
        this.label = new PIXI.Text('WIN', style2);
        this.init();
    }

    private init() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = (this.app.screen.width - this.sprite.width) - 55;
        this.sprite.position.y = 33;
        this.container.addChild(this.label);
        this.label.position.x = (this.sprite.position.x + (this.sprite.width / 2)) - (this.label.width / 2);
        this.label.position.y = 15;
        this.container.addChild(this.sprite);
        this.sprite.addChild(this.text);
        this.center()
    }

    public updateWin(val: number){
        this.text.text = Functions.formatNumber(val);
        this.center();
        let reset = setTimeout(() => {
            this.text.text = '';
            clearTimeout(reset);
        }, 7000);
    }

    private center(){
        this.text.position.x = (this.sprite.width / 2) - (this.text.width / 2);
        this.text.position.y = (this.sprite.height / 2) - (this.text.height / 2);
    }
}