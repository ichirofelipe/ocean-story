import * as PIXI from 'pixi.js';

export default class Pins {
    public pin: PIXI.Graphics;
    public posX: number;
    public posY: number;
    public pinRad: number;
    private loader: PIXI.Loader;
    private pinTexture: PIXI.Texture;
    private pinSprite: PIXI.Sprite;
    constructor(x: number, y: number, radius: number, loader: PIXI.Loader) {
        this.pin = new PIXI.Graphics();
        this.posX = x;
        this.posY = y;
        this.loader = loader;
        this.pinTexture = this.loader.resources!.plinko.textures!['pin.png'];

        this.createPins(this.pin,x,y,radius);
    }

    private createPins(pin: PIXI.Graphics, x:number, y:number, radius:number){
        this.pinSprite = new PIXI.Sprite(this.pinTexture);
        this.pinSprite.width = radius * 2;
        this.pinSprite.height = radius * 2;
        this.pinSprite.position.x = radius * -1;
        this.pinSprite.position.y = radius * -1;

        pin.beginFill(0xFFFFFF);
        pin.drawCircle(0, 0, radius);
        pin.endFill();
        pin.position.x = x;
        pin.position.y = y;
        pin.addChild(this.pinSprite);
    }
}
