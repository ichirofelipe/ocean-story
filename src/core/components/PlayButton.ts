import * as PIXI from 'pixi.js';
import Icons from './Icons';

export default class PlayButton {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private fixedwidth: number;
    private fixedheight: number;
    private startTexture: PIXI.Texture;
    public startSprite: PIXI.Sprite;
    public value: number;
    public valuetext: PIXI.Text;
    private valuestyle: PIXI.TextStyle;
    public plusgameSprite: Icons;
    public minusgameSprite: Icons;
    public ADD: PIXI.Sprite;
    private PW: number;
    private PH: number;

    constructor(app: PIXI.Application, value: number, fixedwidth: number, fixedheight: number) {
        this.container = new PIXI.Container();
        this.app = app;
        this.fixedwidth = fixedwidth;
        this.fixedheight = fixedheight;
        this.startTexture = this.app.loader.resources!.home.textures!['start.png'];
        this.value = value;
        this.PW = this.fixedwidth / 2;
        this.PH = this.fixedheight / 2;
        this.init();
    }

    private init(){
        //rectangle
        let AW = this.fixedwidth * .3;
        let AH = this.fixedheight *.3;
        let iconspadding = 10;
        let paddingtop = 5;
        let h: number = 0;
        let nh: number = 0;
        let w: number = 0;

        //game in count
        const rectangle2 = new PIXI.Graphics();
        rectangle2.beginFill(0x000000);
        rectangle2.drawRoundedRect(0, 0, AW, AH, 100);
        rectangle2.endFill();
        rectangle2.alpha = .4;
        rectangle2.position.x = this.PW - (rectangle2.width / 2);
        //add value
        this.valuestyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: rectangle2.height - 5,
            fontWeight: 'bold',
            fill: ['#FFE850', '#D5A300', '#AC8F00']
        });
        this.valuetext = new PIXI.Text(this.value, this.valuestyle);
        this.valuetext.position.x = this.PW - ( this.valuetext.width / 2);
        this.valuetext.position.y = (rectangle2.height / 2) - ( this.valuetext.height/ 2);

        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000);
        rectangle.drawRoundedRect(0, 0, this.fixedwidth, this.fixedheight, 100);
        rectangle.endFill();
        rectangle.alpha = .6;
        rectangle.position.y = rectangle2.height + paddingtop;
        rectangle.position.x = this.PW - (rectangle.width / 2);
        
        //start button
        this.startSprite = new PIXI.Sprite(this.startTexture);
        this.startSprite.interactive = true;
        this.startSprite.buttonMode = true;
        this.startSprite.addListener('mouseover', this.hoverin.bind(this));
        this.startSprite.addListener('mouseout', this.hoverout.bind(this));
        h = this.startSprite.height;
        w = this.startSprite.width;
        nh = this.fixedheight;
        this.startSprite.height = nh;
        this.startSprite.width = (w / h) * nh;
        this.startSprite.position.x = this.PW - (this.startSprite.width / 2);
        this.startSprite.position.y = (this.PH - (this.startSprite.height / 2)) + rectangle2.height + paddingtop;

        //add minus game
        this.minusgameSprite = new Icons(this.app, this.app.loader.resources!.icons.textures!['icons-minus-circle.png']);
        this.minusgameSprite.container.position.x = iconspadding;
        this.minusgameSprite.container.position.y = (this.PH - (this.minusgameSprite.container.height / 2)) + rectangle2.height + paddingtop;

        //add plus game
        this.plusgameSprite = new Icons(this.app, this.app.loader.resources!.icons.textures!['icons-plus-circle.png']);
        this.plusgameSprite.container.position.x = (this.fixedwidth - this.plusgameSprite.container.width) - iconspadding;
        this.plusgameSprite.container.position.y = (this.PH - (this.plusgameSprite.container.height / 2)) + rectangle2.height + paddingtop;

        //add in container
        this.container.addChild(rectangle2);
        this.container.addChild(this.valuetext);
        this.container.addChild(rectangle);
        this.container.addChild(this.startSprite);
        this.container.addChild(this.minusgameSprite.container);
        this.container.addChild(this.plusgameSprite.container);
    }

    
    private hoverin(){
        this.startSprite.alpha = .8;
    }

    private hoverout(){
        this.startSprite.alpha = 1;
    }

    public changeDropValue(){
        this.value -= 1;
        this.valuetext.text = this.value;
        this.valuetext.position.x = this.PW - ( this.valuetext.width / 2);
    }

    public addMinus(type: string, number: number){
        this.value = number;
        this.valuetext.text = number;
        this.valuetext.position.x = this.PW - ( this.valuetext.width / 2);
    }
}