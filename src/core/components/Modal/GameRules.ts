import * as PIXI from 'pixi.js';

export default class GameRules {
    private container: PIXI.Container;
    public gamerules: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private descstyle: PIXI.TextStyle;
    private sidebarwidth: number;
    private sidepadding: number;
    private readonly description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    constructor(app: PIXI.Application, container: PIXI.Container, sidebarwidth: number, sidepadding: number, titlestyle: PIXI.TextStyle, subtitlestyle: PIXI.TextStyle, descstyle: PIXI.TextStyle) {
        this.gamerules = new PIXI.Container();
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
        const posy = [50,120];
        const gameruleswidth =  this.app.screen.width - this.sidebarwidth - this.sidepadding;
        const title = new PIXI.Text('GAME RULES', this.titlestyle);
        title.position.x = (gameruleswidth / 2) - (title.width / 2);
        title.position.y = posy[0];
        const description = new PIXI.Text(this.description, this.descstyle);
        description.style.fontSize = 12;
        description.style.wordWrap = true;
        description.style.wordWrapWidth = gameruleswidth * .7;
        description.style.align = 'center';
        description.position.x = (gameruleswidth / 2) - (description.width / 2);
        description.position.y = posy[1];
        this.gamerules.addChild(title);
        this.gamerules.addChild(description);
        this.gamerules.position.x = ((this.app.screen.width / 2) - (gameruleswidth / 2));
        this.container.addChild(this.gamerules);
    }
}