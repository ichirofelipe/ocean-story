import * as PIXI from 'pixi.js';
import json from './paytableSettings.json';

export default class PlinkoUI {
    private container: PIXI.Container;
    public container2: PIXI.Container;
    private app: PIXI.Application;
    private descstyle: PIXI.TextStyle;
    private descstyle2: PIXI.TextStyle;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container2 = new PIXI.Container();
        this.app = app;
        this.container = container;
        this.descstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 13,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.descstyle2 = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 9,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.init();
    }

    private init() {
        let text: PIXI.Text;
        this.container.addChild(this.container2);
        json.paytable2titles.forEach((symbol: any, index) => {
            if(index == 0){
                text = new PIXI.Text(symbol.text,this.descstyle);
            }
            else{
                text = new PIXI.Text(symbol.text,this.descstyle2);
            }
            text.position.x = symbol.x;
            text.position.y = symbol.y;
            this.container2.addChild(text);
        });
        json.paytable2.forEach((symbol:any) => {
            const texture = this.app.loader.resources!.controllers.textures![`${symbol.name}`];
            const sprite = new PIXI.Sprite(texture);
            sprite.position.x = symbol.imgx;
            sprite.position.y = symbol.imgy;
            this.container2.addChild(sprite);
        });
    }
}