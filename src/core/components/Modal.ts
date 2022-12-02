import * as PIXI from 'pixi.js';
import {ModalContent} from './Modal/modalSettings.json';
import PayTable from './Modal/PayTable';
import GameSettings from './Modal/GameSettings';
import GameRules from './Modal/GameRules';

export default class Modal {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private sideline: Array<PIXI.Graphics> = [];
    private iconSprite: Array<PIXI.Sprite> = [];
    private contents: Array<PIXI.Container> = [];
    private lastindex: number = 0;
    private sidebarwidth: number;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private descstyle: PIXI.TextStyle;
    private subdescstyle: PIXI.TextStyle;
    private paytable: PayTable;
    public gamesettings: GameSettings;
    private gamerules: GameRules;
    private readonly sidepadding: number = 200;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container = container;
        this.app = app;
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
        this.descstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 15,
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
        this.createSideBar();
        this.createContent();
    }

    private createContent(){
        //paytable
        this.paytable = new PayTable(this.app,this.container,this.sidebarwidth,this.sidepadding,this.titlestyle,this.subtitlestyle,this.descstyle);
        this.paytable.paytable.alpha = 1;
        this.contents.push(this.paytable.paytable);
        this.container.addChild(this.paytable.paytable);
        //game settings
        this.gamesettings = new GameSettings(this.app,this.container,this.sidebarwidth,this.sidepadding,this.titlestyle,this.subtitlestyle,this.descstyle,this.subdescstyle);
        this.contents.push(this.gamesettings.gamesettings);
        this.gamesettings.gamesettings.alpha = 0;
        this.container.addChild(this.gamesettings.gamesettings);
        //game rules
        this.gamerules = new GameRules(this.app,this.container,this.sidebarwidth,this.sidepadding,this.titlestyle,this.subtitlestyle,this.descstyle);
        this.gamerules.gamerules.alpha = 0;
        this.contents.push(this.gamerules.gamerules);
        this.container.addChild(this.gamerules.gamerules);
    }

    private createSideBar(){
        const height = this.container.height;
        const width = 10;
        const iconwidth = 6;
        const iconslength = ModalContent.length;
        const iconsheight = height / iconslength;
        

        let linepositiony = 0;
        let linealpha = 1;
        let iconalpha = 1;
        ModalContent.forEach((icon, index)  => {
            //lines
            linepositiony = iconsheight * index;
            if(index > 0){
                linealpha = 0;
                iconalpha = .5
            }
            const sideline = new PIXI.Graphics();
            sideline.lineStyle(width,0xffffff)
                    .moveTo(0, 0)
                    .lineTo(0,iconsheight);
            sideline.alpha = linealpha;
            sideline.position.y = linepositiony;
            //sprites
            const iconTexture = this.app.loader.resources!.controllers.textures![`${icon.icon}`];
            const iconSprite = new PIXI.Sprite(iconTexture);
            iconSprite.alpha = iconalpha;
            iconSprite.interactive = true;
            iconSprite.buttonMode = true;
            iconSprite.position.y = (linepositiony + (iconsheight / 2)) - (iconSprite.height / 2);
            iconSprite.position.x = iconwidth + width;
            this.addEvent(iconSprite, index)
            //add and push
            this.sidebarwidth = iconSprite.position.x + iconSprite.width;
            this.sideline.push(sideline);
            this.iconSprite.push(iconSprite);
            this.container.addChild(sideline);
            this.container.addChild(iconSprite);
        });
    }

    private addEvent(sprite: PIXI.Sprite, index: number){
        sprite.addListener('mouseover', () => {
            sprite.alpha = 1;
        });
        sprite.addListener('mouseout', () => {
            if(this.lastindex != index){
                sprite.alpha = .5;
            }
        });
        sprite.addListener('pointerdown', () => {
            this.sideline[this.lastindex].alpha = 0;
            this.sideline[index].alpha = 1;
            this.iconSprite[this.lastindex].alpha = .5;
            this.iconSprite[index].alpha = 1;
            this.contents[this.lastindex].alpha = 0;
            this.contents[index].alpha = 1;
            this.lastindex = index;
            
        });
    }
}