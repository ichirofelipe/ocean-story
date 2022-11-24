import * as PIXI from 'pixi.js';

export default class Ball {
    public ball: PIXI.Graphics;
    private loader: PIXI.Loader;
    private coin: PIXI.Texture;
    public coinSprite: PIXI.Sprite;
    private ticker: PIXI.Ticker;
    public up: Boolean = true;
    public upright: Boolean = false;
    public down: Boolean = false;
    public downright: Boolean = false;
    public upleft: Boolean = false;
    public downleft: Boolean = false;

    constructor(x: number, y: number, radius: number, loader: PIXI.Loader) {
        this.ball = new PIXI.Graphics();
        this.ticker = new PIXI.Ticker();
        this.loader = loader;
        this.coin = this.loader.resources!.plinko.textures!['coin.png'];
        this.createBall(this.ball,x,y,radius);
    }

    private createBall(ball: PIXI.Graphics, x:number, y:number, radius: number){
        this.coinSprite = new PIXI.Sprite(this.coin);
        this.coinSprite.width = radius * 2;
        this.coinSprite.height = radius * 2;
        this.coinSprite.position.x = radius * -1;
        this.coinSprite.position.y = radius * -1;
        
        ball.beginFill(0xFFFF00);
        ball.drawCircle(0, 0, radius);
        ball.endFill();
        ball.position.x = x;
        ball.position.y = y;
        ball.addChild(this.coinSprite);
    }
}
