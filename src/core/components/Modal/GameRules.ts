import * as PIXI from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox'

export default class GameRules {
    private container: PIXI.Container;
    public gamerules: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private descstyle: PIXI.TextStyle;
    private readonly description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.gamerules = new PIXI.Container();
        this.container = container;
        this.app = app;
        //text styles
        this.titlestyle = new PIXI.TextStyle({
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
        const posy = [15,120];
        // const gameruleswidth =  this.app.screen.width - this.menuheight - this.sidepadding;
        const gameruleswidth =  this.app.screen.width;
        const title = new PIXI.Text('GAME RULES', this.titlestyle);
        title.position.x = (gameruleswidth / 2) - (title.width / 2);
        title.position.y = posy[0];
        const description = new PIXI.Text(this.description, this.descstyle);
        description.style.fontSize = 12;
        description.style.wordWrap = true;
        description.style.wordWrapWidth = gameruleswidth * .7;
        description.style.align = 'center';
        
        this.gamerules.addChild(title);
        // this.gamerules.addChild(description);
        this.gamerules.position.x = ((this.app.screen.width / 2) - (gameruleswidth / 2));
        const scrollboxwidth = gameruleswidth * .8;
        const scrollbox = new Scrollbox({ boxWidth: scrollboxwidth, boxHeight: 300, scrollbarForeground : 0xFFE850});
        scrollbox.position.x = (gameruleswidth / 2) - (scrollboxwidth / 2);
        scrollbox.position.y = 80;
        description.position.x = (scrollboxwidth / 2) - (description.width / 2);
        scrollbox.content.addChild(description)
        scrollbox.update();
        this.gamerules.addChild(scrollbox);
        this.container.addChild(this.gamerules);
    }
}