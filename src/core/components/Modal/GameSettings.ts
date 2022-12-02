import * as PIXI from 'pixi.js';

export default class GameSettings {
    private container: PIXI.Container;
    public gamesettings: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private descstyle: PIXI.TextStyle;
    private sidebarwidth: number;
    private sidepadding: number;

    constructor(app: PIXI.Application, container: PIXI.Container, sidebarwidth: number, sidepadding: number, titlestyle: PIXI.TextStyle, subtitlestyle: PIXI.TextStyle, descstyle: PIXI.TextStyle) {
        this.gamesettings = new PIXI.Container();
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
        const gamesettingswidth =  this.app.screen.width - this.sidebarwidth - this.sidepadding;
        const title = new PIXI.Text('GAME SETTINGS', this.titlestyle);
        title.position.x = (gamesettingswidth / 2) - (title.width / 2);
        title.position.y = posy[0];
        this.gamesettings.addChild(title);
        this.gamesettings.position.x = ((this.app.screen.width / 2) - (gamesettingswidth / 2));
        this.container.addChild(this.gamesettings);
    }
}