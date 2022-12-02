import * as PIXI from 'pixi.js';
import json from './paytableSettings.json';

export default class PayTable {
    private container: PIXI.Container;
    public paytable: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private descstyle: PIXI.TextStyle;
    private sidebarwidth: number;
    private sidepadding: number;
    private leftarrow: PIXI.Sprite;
    private rightarrow: PIXI.Sprite;

    constructor(app: PIXI.Application, container: PIXI.Container, sidebarwidth: number, sidepadding: number, titlestyle: PIXI.TextStyle, subtitlestyle: PIXI.TextStyle, descstyle: PIXI.TextStyle) {
        this.paytable = new PIXI.Container();
        this.container = container;
        this.app = app;
        this.titlestyle = titlestyle;
        this.subtitlestyle = subtitlestyle;
        this.descstyle = descstyle;
        this.sidebarwidth = sidebarwidth;
        this.sidepadding = sidepadding;
        this.init();
    }

    private init() {
        const posy = [50,100];
        const paddingsymbols = 70;
        const paytablewidth =  this.app.screen.width - this.sidebarwidth - this.sidepadding;
        const paytableheight = this.container.height;
        const title = new PIXI.Text('PAYTABLE', this.titlestyle);
        title.position.x = (paytablewidth / 2) - (title.width / 2);
        title.position.y =  posy[0];
        const subtitle = new PIXI.Text('REELS', this.subtitlestyle);
        subtitle.position.x = (paytablewidth / 2) - (subtitle.width / 2);
        subtitle.position.y = posy[1];
        //add arrow left right
        const lefttexture = this.app.loader.resources!.controllers.textures!['icon_arrowleft.png'];
        this.leftarrow = new PIXI.Sprite(lefttexture);
        this.leftarrow.position.y = (paytableheight / 2) - (this.leftarrow.height / 2);
        const righttexture = this.app.loader.resources!.controllers.textures!['icon_arrowright.png'];
        this.rightarrow = new PIXI.Sprite(righttexture);
        this.rightarrow.position.y = (paytableheight / 2) - (this.rightarrow.height / 2);
        this.rightarrow.position.x = paytablewidth - this.rightarrow.width;
        //add childs
        this.paytable.addChild(this.rightarrow);
        this.paytable.addChild(this.leftarrow);
        this.paytable.addChild(title);
        this.paytable.addChild(subtitle);
        this.paytable.position.x = ((this.app.screen.width / 2) - (paytablewidth / 2));
        this.container.addChild(this.paytable);
        //add another container
        const symsbolsContainer = new PIXI.Container();
        const symbolswidth = (paytablewidth - (this.leftarrow.width + this.rightarrow.width)) - paddingsymbols;
        symsbolsContainer.position.x = (paytablewidth / 2) - (symbolswidth / 2);
        this.paytable.addChild(symsbolsContainer);
        json.paytable.forEach(symbol => {
            const texture = this.app.loader.resources!.controllers.textures![`${symbol.name}`];
            const sprite = new PIXI.Sprite(texture);
            sprite.position.x = symbol.imgx;
            sprite.position.y = symbol.imgy;
            const text = new PIXI.Text(symbol.description,this.descstyle);
            text.style.fontSize = 10;
            text.position.y = symbol.texty;
            text.position.x = symbol.textx;
            symsbolsContainer.addChild(sprite);
            symsbolsContainer.addChild(text);
        });
    }
}