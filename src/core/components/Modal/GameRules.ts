import * as PIXI from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import json from './gamerulesSettings.json';

export default class GameRules {
    private container: PIXI.Container;
    public gamerules: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private descstyle1: PIXI.TextStyle;
    private descstyle2: PIXI.TextStyle;
    private descstyle3: PIXI.TextStyle;

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
        this.descstyle1 = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 11,
            fill: '#ffffff'
        });
        this.descstyle2 = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 15,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.descstyle3 = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 13,
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
        this.gamerules.addChild(title);
        // this.gamerules.addChild(description);
        this.gamerules.position.x = ((this.app.screen.width / 2) - (gameruleswidth / 2));
        const scrollboxwidth = gameruleswidth * .8;
        const scrollbox = new Scrollbox({ boxWidth: scrollboxwidth, boxHeight: 300, scrollbarForeground : 0xFFE850, scrollbarBackground: 0x3d3e40});
        scrollbox.position.x = (gameruleswidth / 2) - (scrollboxwidth / 2);
        scrollbox.position.y = 80;


        let position = 0;
        let spacing = 10;
        let description: PIXI.Text;
        let contentwidth = scrollboxwidth * .8;

        const parentcontainer = new PIXI.Container();
        parentcontainer.position.x = (scrollboxwidth / 2) - (contentwidth / 2);

        
        json.contents.forEach((content : any) => {
            if(content.withimage){
                let container = new PIXI.Container();
                let imgcontainer = new PIXI.Container();
                let imgposx = 0;
                let imgposy = 0;
                if(content.type == 0){
                    description = new PIXI.Text(content.description, this.descstyle1);
                    container.addChild(description);
                    content.images.forEach((img : any) => {
                        const sprite = new PIXI.Sprite(this.app.loader.resources!.controllers.textures![`${img}`]);
                        sprite.position.x = imgposx;
                        imgcontainer.addChild(sprite);
                        imgposx += (sprite.width + 10);
                        imgposy = sprite.height;
                    });
                    description.position.y = imgposy + 5;
                }
                else{
                    let posx = 0;
                    content.images.forEach((img : any) => {
                        const imagecontainer2 = new PIXI.Container();
                        const sprite = new PIXI.Sprite(this.app.loader.resources!.controllers.textures![`${img.img}`]);
                        description = new PIXI.Text(img.text, this.descstyle1);
                        imagecontainer2.addChild(description);
                        imagecontainer2.addChild(sprite);
                        sprite.position.x = (imagecontainer2.width / 2) - (sprite.width / 2);
                        description.position.x = (imagecontainer2.width / 2) - (description.width / 2);
                        description.position.y = sprite.height + 8;
                        imagecontainer2.position.x = posx;
                        imgcontainer.addChild(imagecontainer2);
                        posx += (imagecontainer2.width + 10);
                    });
                }
                container.position.x = (contentwidth / 2) - (container.width / 2);
                container.position.y = position;
                imgcontainer.position.x = (container.width / 2) - (imgcontainer.width / 2);
                container.addChild(imgcontainer);
                parentcontainer.addChild(container);
                position += (container.height + spacing) + 8;
            }
            else{
                description = new PIXI.Text(content.description, this.descstyle1);
                if(content.istitle){
                    description = new PIXI.Text(content.description, this.descstyle2);
                    description.position.x = (contentwidth / 2) - (description.width / 2);
                    position += 20;
                    description.position.y = position;
                }
                if(content.issubtitle){
                    description = new PIXI.Text(content.description, this.descstyle3);
                    description.position.x = (contentwidth / 2) - (description.width / 2);
                    position += 10;
                    description.position.y = position;
                }
                description.style.lineHeight = 17;
                description.style.wordWrap = true;
                description.style.wordWrapWidth = contentwidth;
                description.position.y = position;
                if(content.text){
                    position += description.height + spacing;
                }
                else{
                    position += description.height + 3;
                    description.position.x = (contentwidth / 2) - (description.width / 2);
                }
                parentcontainer.addChild(description);
            }
        });


        scrollbox.content.addChild(parentcontainer);
        scrollbox.update();
        this.gamerules.addChild(scrollbox);
        this.container.addChild(this.gamerules);
    }
}