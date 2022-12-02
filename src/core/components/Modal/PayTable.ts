import * as PIXI from 'pixi.js';

export default class PayTable {
    private container: PIXI.Container;
    public paytable: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private descstyle: PIXI.TextStyle;
    private sidebarwidth: number;
    private sidepadding: number;

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
        const paytablewidth =  this.app.screen.width - this.sidebarwidth - this.sidepadding;
        const title = new PIXI.Text('PAYTABLE', this.titlestyle);
        title.position.x = (paytablewidth / 2) - (title.width / 2);
        title.position.y =  posy[0];
        const subtitle = new PIXI.Text('REELS', this.subtitlestyle);
        subtitle.position.x = (paytablewidth / 2) - (subtitle.width / 2);
        subtitle.position.y = posy[1];
        this.paytable.addChild(title);
        this.paytable.addChild(subtitle);
        this.paytable.position.x = ((this.app.screen.width / 2) - (paytablewidth / 2));
        this.container.addChild(this.paytable);
    }
}