import * as PIXI from 'pixi.js';
import json from './paytableSettings.json';
import SlotUI from './SlotUI';
import PlinkoUI from './PlinkoUI';

export default class PayTable {
    private container: PIXI.Container;
    public paytable: PIXI.Container;
    private app: PIXI.Application;
    private titlestyle: PIXI.TextStyle;
    private subtitlestyle: PIXI.TextStyle;
    private menuheight: number;
    private sidepadding: number;
    private leftarrow: PIXI.Sprite;
    private rightarrow: PIXI.Sprite;
    private lastindex: number = 0;
    private components: Array<any>;
    private arrComponents: Array<any> = [];
    private texts: Array<PIXI.Text> = [];

    constructor(app: PIXI.Application, container: PIXI.Container, menuheight: number, sidepadding: number) {
        this.paytable = new PIXI.Container();
        this.container = container;
        this.app = app;
        this.menuheight = menuheight;
        this.sidepadding = sidepadding;
        this.components = [
            SlotUI,
            PlinkoUI
        ];
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
        this.init();
    }

    private init() {
        const posy = [15,55];
        const adjustarrow = 50;
        const paytablewidth =  this.app.screen.width - this.sidepadding;
        const paytableheight = this.container.height - this.menuheight;
        const title = new PIXI.Text('PAYTABLE', this.titlestyle);
        title.position.x = (paytablewidth / 2) - (title.width / 2);
        title.position.y =  posy[0];

        const subtitle = new PIXI.Text('SLOT', this.subtitlestyle);
        subtitle.position.x = (paytablewidth / 2) - (subtitle.width / 2);
        subtitle.position.y =  posy[1];
        subtitle.alpha = 1;
        this.texts.push(subtitle);

        const subtitle2 = new PIXI.Text('PLINKO', this.subtitlestyle);
        subtitle2.position.x = (paytablewidth / 2) - (subtitle2.width / 2);
        subtitle2.position.y =  posy[1];
        subtitle.alpha = 0;
        this.texts.push(subtitle2);

        //add arrow left right
        const lefttexture = this.app.loader.resources!.controllers.textures!['icon_arrowleft.png'];
        this.leftarrow = new PIXI.Sprite(lefttexture);
        this.leftarrow.interactive = true;
        this.leftarrow.buttonMode = true;
        this.leftarrow.addListener("pointerdown", () => {
            if(this.lastindex > 0){
                const index = this.lastindex;
                this.lastindex -= 1;
                this.arrComponents[index].container2.alpha = 0;
                this.arrComponents[this.lastindex].container2.alpha = 1;
                this.texts[index].alpha = 0;
                this.texts[this.lastindex].alpha = 1;
                this.arrowAlpha();
            }
        });
        this.leftarrow.position.y = (paytableheight / 2) - (this.leftarrow.height / 2);
        this.leftarrow.position.x = -(adjustarrow);
        const righttexture = this.app.loader.resources!.controllers.textures!['icon_arrowright.png'];
        this.rightarrow = new PIXI.Sprite(righttexture);
        this.rightarrow.interactive = true;
        this.rightarrow.buttonMode = true;
        this.rightarrow.addListener("pointerdown", () => {
            if(this.lastindex < this.components.length - 1){
                const index = this.lastindex;
                this.lastindex += 1;
                this.arrComponents[index].container2.alpha = 0;
                this.arrComponents[this.lastindex].container2.alpha = 1;
                this.texts[index].alpha = 0;
                this.texts[this.lastindex].alpha = 1;
                this.arrowAlpha();
            }
        });
        this.rightarrow.position.y = (paytableheight / 2) - (this.rightarrow.height / 2);
        this.rightarrow.position.x = (paytablewidth - this.rightarrow.width) + adjustarrow;
        //add child
        this.paytable.addChild(title);
        this.paytable.addChild(subtitle);
        this.paytable.addChild(subtitle2);
        this.paytable.addChild(this.rightarrow);
        this.paytable.addChild(this.leftarrow);
        this.paytable.position.x = ((this.app.screen.width / 2) - (paytablewidth / 2));
        this.container.addChild(this.paytable);
        //add component
        let alpha = 1;
        this.components.forEach((component, index) => {
            const ui = new component(this.app,this.paytable);
            if(index > 0){
                alpha = 0;
            }
            ui.container2.alpha = alpha;
            this.arrComponents.push(ui);
            this.paytable.addChild(ui.container2);
        });
        this.arrowAlpha();
    }

    private arrowAlpha(){
        if(this.components.length == 1){
            this.leftarrow.alpha = 0;
            this.rightarrow.alpha = 0;
        }
        else{
            if(this.lastindex == 0){
                this.leftarrow.alpha = .5;
                this.rightarrow.alpha = 1;
            }
            if(this.lastindex == this.components.length - 1){
                this.rightarrow.alpha = .5;
                this.leftarrow.alpha = 1;
            }
        }
    }
}