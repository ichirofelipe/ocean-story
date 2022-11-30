import * as PIXI from 'pixi.js';

export default class TextBox {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private label: string;
    public value: number;
    private labelstyle: PIXI.TextStyle;
    private valuestyle: PIXI.TextStyle;
    private fixedwidth: number;
    private fixedheight: number;

    constructor(app: PIXI.Application, label: string, value: number, fixedwidth: number, fixedheight: number) {
        this.container = new PIXI.Container();
        this.app = app;
        this.label = label;
        this.value = value;
        this.fixedwidth = fixedwidth;
        this.fixedheight = fixedheight;
        this.labelstyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 14,
            fontWeight: 'bold',
            fill: ['#FFE850', '#D5A300', '#AC8F00']
        });
        this.valuestyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 18,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.init();
    }

    private init() {
        const postop = 3;

        //label
        const label = new PIXI.Text(this.label, this.labelstyle);
        label.position.x = (this.fixedwidth / 2) - (label.width / 2);
        label.position.y = 0;

        //value
        const value = new PIXI.Text(this.formatNumber(this.value), this.valuestyle);
        value.position.x = (this.fixedwidth / 2) - (value.width / 2);
        value.position.y = ((this.fixedheight / 2) - (value.height / 2)) + label.height + postop;

        //rectangle
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000);
        rectangle.drawRoundedRect(0, 0, this.fixedwidth, this.fixedheight, 100);
        rectangle.endFill();
        rectangle.alpha = .7;
        rectangle.position.y = label.height + postop;
        
        //add in container
        this.container.addChild(label);
        this.container.addChild(rectangle);
        this.container.addChild(value);
    }

    private formatNumber(number: number){
        const num = number.toLocaleString("en-US");
        return num;
    }
}