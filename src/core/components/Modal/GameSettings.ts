import * as PIXI from 'pixi.js';
import json from './gameSettings.json';

export default class GameSettings {
    private container: PIXI.Container;
    public gamesettings: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private subdescstyle: PIXI.TextStyle;
    private toggleoff: PIXI.Texture;
    private toggleon: PIXI.Texture;
    public toggleSprite: Array<PIXI.Sprite> = [];

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.gamesettings = new PIXI.Container();
        this.container = container;
        this.app = app;
        this.toggleoff = this.app.loader.resources!.controllers.textures!['toggle_off.png'];
        this.toggleon = this.app.loader.resources!.controllers.textures!['toggle_on.png'];
        //text styles
        this.titlestyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#FFE850'
        });
        this.subtitlestyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 17,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.subdescstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 11,
            fontWeight: 'bold',
            fill: '#AAAAAA'
        });
        this.init();
    }

    private init() {
        const titleposy = 50;
        const gamesettingswidth =  (this.app.screen.width) * .3;
        const title = new PIXI.Text('GAME SETTINGS', this.titlestyle);
        title.position.x = (gamesettingswidth / 2) - (title.width / 2);
        title.position.y = titleposy;
        this.gamesettings.addChild(title);
        json.GameSettings.forEach((setting: any) => {
            const subtitle1 = new PIXI.Text(setting.title, this.subtitlestyle);
            subtitle1.position.y = setting.textposition1[0];
            const subtitle2 = new PIXI.Text(setting.description, this.subdescstyle);
            subtitle2.position.y = setting.textposition1[1];
            subtitle2.style.wordWrap = true;
            subtitle2.style.wordWrapWidth = 160;
            const sprite = new PIXI.Sprite(this.toggleon);
            sprite.position.x = gamesettingswidth - sprite.width;
            sprite.position.y = setting.toggleposition1;
            sprite.interactive = true;
            sprite.buttonMode = true;
            this.toggleSprite.push(sprite);
            this.gamesettings.addChild(subtitle1);
            this.gamesettings.addChild(subtitle2);
            this.gamesettings.addChild(sprite);
        });
        this.gamesettings.position.x = ((this.app.screen.width / 2) - (gamesettingswidth / 2));
        this.container.addChild(this.gamesettings);
    }

    public toggleOnOff(btn: PIXI.Sprite){
        if(btn.texture == this.toggleon){
            btn.texture = this.toggleoff;
        }
        else{
            btn.texture = this.toggleon;
        }
    }
}