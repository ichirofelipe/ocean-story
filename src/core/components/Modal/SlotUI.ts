import * as PIXI from 'pixi.js';
import json from './paytableSettings.json';

export default class SlotUI {
    private container: PIXI.Container;
    public container2: PIXI.Container;
    private app: PIXI.Application;
    private descstyle: PIXI.TextStyle;
    private descstyle2: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container2 = new PIXI.Container();
        this.app = app;
        this.container = container;
        this.descstyle2 = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#FFE850'
        });
        this.descstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 15,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.init();
    }

    private init() {
        this.container.addChild(this.container2);
        json.paytable.forEach((symbol:any) => {
            const texture = this.app.loader.resources!.controllers.textures![`${symbol.name}`];
            const sprite = new PIXI.Sprite(texture);
            sprite.position.x = symbol.imgx;
            sprite.position.y = symbol.imgy;
            const text = new PIXI.Text(symbol.description,this.descstyle);
            const text2 = new PIXI.Text(symbol.subdesc,this.descstyle2);
            text.style.fontSize = 10;
            text.position.y = symbol.texty;
            text.position.x = symbol.textx;
            if(symbol.sideways){
                text.style.lineHeight = 17;
                text.style.wordWrap = true;
                text.style.wordWrapWidth = 145;
                if(symbol.name == "bonus.png"){
                    text2.style.fontSize = 10;
                    text2.position.y = symbol.subdescy;
                    text2.position.x = symbol.subdescx;
                }
            }
            this.container2.addChild(sprite);
            this.container2.addChild(text2);
            this.container2.addChild(text);
        });
    }
}