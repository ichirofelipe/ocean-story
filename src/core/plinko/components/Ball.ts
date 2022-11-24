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
    private BG: number = .4;
    private BX: number = 0; 
    private BY: number = 2;
    private container: PIXI.Container;
    private reelposition: number;
    private imageArray: Array<PIXI.Sprite>;
    private arrayPins: Array<PIXI.Graphics>;
    private lasthitindex: number = -1;


    constructor(x: number, y: number, radius: number, loader: PIXI.Loader, container: PIXI.Container, reelposition: number, imageArray: Array<PIXI.Sprite>, arrayPins: Array<PIXI.Graphics>) {
        this.ball = new PIXI.Graphics();
        this.ticker = new PIXI.Ticker();
        this.loader = loader;
        this.coin = this.loader.resources!.plinko.textures!['coin.png'];
        this.container = container;
        this.reelposition = reelposition;
        this.imageArray = imageArray;
        this.arrayPins = arrayPins;
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

        //add ticker
        this.ticker.add(this.ballMovement.bind(this));
        this.ticker.start();
    }

    private ballMovement(){
        //move the ball
        this.BY += this.BG;
        this.ball.position.y += this.BY;
        this.ball.position.x += this.BX;

        //ball collision
        this.arrayPins.forEach((element, index) => {
            if(this.ballCollision(element, this.ball)){
                element.alpha = .08;
                if(this.lasthitindex != index){
                    this.lasthitindex = index;
                    this.BY = (this.BY * .8) * -1;   
                }
                if(this.ball.position.x >= element.position.x){
                    this.BX = 2;
                }
                else{
                    this.BX = -2;
                }
                
                let stopper = setTimeout(() => {
                    this.lasthitindex = -1;
                    element.alpha = 1;
                    clearTimeout(stopper);
                }, 130); 
            }
        });

        //wall collision
        if(this.ball.position.x <= (24 + (this.ball.height / 2))){
            this.BX = 2;
        }
        if(this.ball.position.x >= (456 - (this.ball.height / 2))){
            this.BX = -2;
        }

        //character detection
        if(this.ball.position.y >= this.reelposition){
            this.container.removeChild(this.ball);
            this.validateBallPosition(this.ball);
            this.ticker.destroy();
        }
    }

    private validateBallPosition(ball: PIXI.Graphics){
        let fish: PIXI.Sprite;
        let arr = this.imageArray;
        let position = ball.position.x;

        arr.forEach((element, index) => {
            if(position >= element.getBounds().x && position < (element.getBounds().x + element.getBounds().width)){
                fish = element;
            }
        });
    
        fish!.alpha = 0;
        let stopper = setTimeout(() => {
            fish.alpha = 1;
            clearTimeout(stopper);
        }, 1000);
    }

    private getDistance(circle1: PIXI.Graphics, circle2: PIXI.Graphics){
        let a = circle2.y - circle1.y;
        let b = circle2.x - circle1.x;
    
        return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
    }
    
    private ballCollision(circle1: PIXI.Graphics, circle2: PIXI.Graphics){
        let radius = (circle1.height/2) + (circle2.height/2);
        let distance = this.getDistance(circle1, circle2);
    
        return distance < radius;
    }
}
