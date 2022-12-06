import * as PIXI from 'pixi.js';
import {ModalContent} from './Modal/modalSettings.json';
import PayTable from './Modal/PayTable';
import GameSettings from './Modal/GameSettings';
import GameRules from './Modal/GameRules';

export default class Modal {
    public container: PIXI.Container;
    public menuContainer: PIXI.Container;
    private app: PIXI.Application;
    private iconSprite: Array<PIXI.Sprite> = [];
    private contents: Array<PIXI.Container> = [];
    private lastindex: number = 1;
    private menuheight: number;
    private paytable: PayTable;
    public gamesettings: GameSettings;
    private gamerules: GameRules;
    public close: PIXI.Sprite;
    private readonly sidepadding: number = 200;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container = container;
        this.app = app;
        this.init();
    }

    private init() {
        this.createMenu();
        this.createContent();
    }

    private createMenu(){
        const posy = this.container.height * .9;
        this.menuheight = this.container.height * .1;
        this.menuContainer = new PIXI.Container();
        let spacing = 10;
        let position = 0;
        let scale = 0;
        let alpha = 0;
        ModalContent.forEach((icon, index)  => {
            position = index * spacing;
            const iconTexture = this.app.loader.resources!.controllers.textures![`${icon.icon}`];
            const iconSprite = new PIXI.Sprite(iconTexture);
            if(index == 1){
                scale = 1;
                alpha = 1;
            }
            else{
                scale = .68;
                alpha = .5;
            }
            if(index > 0){
                position = (this.iconSprite[index - 1].width + this.iconSprite[index - 1].position.x) + spacing;
            }
            iconSprite.scale.set(scale);
            iconSprite.alpha = alpha;
            iconSprite.position.x = position;
            iconSprite.interactive = true;
            iconSprite.buttonMode = true;
            this.addEvent(iconSprite, index);
            this.menuContainer.addChild(iconSprite);
            this.iconSprite.push(iconSprite);
        });
        this.menuContainer.position.x = (this.app.screen.width / 2) - (this.menuContainer.width / 2);
        this.menuContainer.position.y = posy;
        this.container.addChild(this.menuContainer);
        this.IconsAlignment();
    }

    private IconsAlignment(){
        //align buttons to y
        this.iconSprite.forEach(icon => {
            icon.position.y = (this.menuContainer.height / 2) - (icon.height / 2);
        });
    }

    private createContent(){
        //close button
        const texture = this.app.loader.resources!.controllers.textures!['icon_close.png'];
        this.close = new PIXI.Sprite(texture);
        this.close.position.x = (this.app.screen.width - this.close.width) - 20
        this.close.position.y = 20;
        this.close.interactive = true;
        this.close.buttonMode = true;
        this.container.addChild(this.close);

        //game settings
        this.gamesettings = new GameSettings(this.app,this.container);
        this.contents.push(this.gamesettings.gamesettings);
        this.gamesettings.gamesettings.alpha = 0;
        this.container.addChild(this.gamesettings.gamesettings);

        //paytable
        this.paytable = new PayTable(this.app,this.container,this.menuheight,this.sidepadding);
        this.paytable.paytable.alpha = 1;
        this.contents.push(this.paytable.paytable);
        this.container.addChild(this.paytable.paytable);

        //game rules
        this.gamerules = new GameRules(this.app,this.container);
        this.gamerules.gamerules.alpha = 0;
        this.contents.push(this.gamerules.gamerules);
        this.container.addChild(this.gamerules.gamerules);
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
            //icons
            const texture = this.iconSprite[1].texture;
            this.iconSprite[1].texture = this.iconSprite[index].texture;
            this.iconSprite[index].texture = texture;
            this.iconSprite[index].alpha = .5;
            this.iconSprite[1].alpha = 1;
            //contents
            const contents = this.contents[1];
            this.contents[1] = this.contents[index];
            this.contents[index] = contents;
            this.contents[index].alpha = 0;
            this.contents[1].alpha = 1;
        });
    }
}