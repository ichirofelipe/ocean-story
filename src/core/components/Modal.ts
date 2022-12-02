import * as PIXI from 'pixi.js';
import {ModalContent} from './Modal/modalSettings.json';

export default class Modal {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private sideline: Array<PIXI.Graphics> = [];
    private iconSprite: Array<PIXI.Sprite> = [];
    private lastindex: number = 0;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        this.container = container;
        this.app = app;
        this.init();
    }

    private init() {
        this.createSideBar();
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
            iconSprite.position.x = width + iconwidth;
            this.addEvent(iconSprite, index)
            //add and push
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
            this.lastindex = index;
        });
    }
}