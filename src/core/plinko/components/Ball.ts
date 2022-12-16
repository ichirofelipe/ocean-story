import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export default class Ball {
    public ball: PIXI.Graphics;
    private loader: PIXI.Loader;
    private coin: PIXI.Texture;
    public coinSprite: PIXI.Sprite;
    public ticker: PIXI.Ticker;
    public up: Boolean = true;
    public upright: Boolean = false;
    public down: Boolean = false;
    public downright: Boolean = false;
    public upleft: Boolean = false;
    public downleft: Boolean = false;
    public ballname: string;
    private BG: number = .4;
    private BX: number = 0; 
    private BY: number = 2;
    private container: PIXI.Container;
    private container2: PIXI.Container;
    private reelposition: number;
    private imageArray: Array<PIXI.AnimatedSprite>;
    private arrayPins: Array<PIXI.Graphics>;
    private lasthitindex: number = -1;
    private app: PIXI.Application;
    private splashtextures: Array<PIXI.Texture> = [];
    private spinalltextures: Array<PIXI.Texture> = [];
    private nospintextures: Array<PIXI.Texture> = [];
    private addmoney: (type: number) => void;
    private updategameplus: () => void;
    private updategameminus: () => void;
    private removelement: (element: any) => void;
    private updatebar: (type: string) => void;


    constructor(x: number, y: number, radius: number, loader: PIXI.Loader, container: PIXI.Container, container2: PIXI.Container, reelposition: number, imageArray: Array<PIXI.AnimatedSprite>, arrayPins: Array<PIXI.Graphics>, app: PIXI.Application, updatebar: (type: string) => void, updategameplus: () => void, updategameminus: () => void, addmoney: (type: number) => void, removelement: (element: any) => void, ballname: number) {
        this.ball = new PIXI.Graphics();
        this.ticker = new PIXI.Ticker();
        this.ballname = 'ball'+ballname;
        this.loader = loader;
        this.coin = this.loader.resources!.plinko.textures!['coin.png'];
        this.container = container;
        this.container2 = container2;
        this.reelposition = reelposition;
        this.imageArray = imageArray;
        this.arrayPins = arrayPins;
        this.app = app;
        this.addmoney = addmoney;
        this.updategameplus = updategameplus;
        this.updategameminus = updategameminus;
        this.updatebar = updatebar;
        this.removelement = removelement;
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

        //create splash
        for(let img in this.loader.resources!.splash.textures){
            const texture = PIXI.Texture.from(img);
            this.splashtextures.push(texture);
        } 

        //create spinall
        for(let img in this.loader.resources!.spinall.textures){
            const texture = PIXI.Texture.from(img);
            this.spinalltextures.push(texture);
        } 

        //create no spin
        for(let img in this.loader.resources!.nospin.textures){
            const texture = PIXI.Texture.from(img);
            this.nospintextures.push(texture);
        } 
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
                    this.BY = (this.BY * .83) * -1;   
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
                }, 100); 
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
            this.removelement(this.ballname);
            this.validateBallPosition(this.ball);
            this.ticker.destroy();
        }
    }

    private createSprite(character: any, ball: PIXI.Graphics, rotated: Boolean = false, move: Boolean = false, x: number = 0, y: number = 0, money: number = 0, update: Boolean = false, str: string = '', animated: Boolean = false){
        let sprite: any;
        if(animated){
            sprite = new PIXI.AnimatedSprite(character);
            sprite.animationSpeed = 1;
            sprite.scale.set(.4);
            sprite.play();
        }
        else{
            sprite = new PIXI.Sprite(character);
            sprite.scale.set(.25);
        }
        sprite.position.x = ball.position.x;
        sprite.position.y = this.reelposition;
        sprite.alpha = 0;
        if(rotated){
            sprite.scale.x*=-1;
        }
        const newposition = this.reelposition - sprite.height;
        this.container2.addChild(sprite);
        let gsapper = gsap.to(sprite, {
            y: newposition,
            alpha: 1,
            duration: .5,
            onComplete: () => {
                if(move){
                    this.spriteMovement(sprite, x , y, money, update, str);
                }
                else{
                    if(animated){
                        let stopper2 = setTimeout(() => {
                            sprite.gotoAndStop(0);
                            this.container2.removeChild(sprite);
                            sprite.alpha = 0;
                            clearTimeout(stopper2);
                        }, 2000);
                    }
                    else{
                        this.container2.removeChild(sprite);
                        sprite.alpha = 0;
                    }
                    let stopper = setTimeout(() => {
                        gsapper.kill();
                        clearTimeout(stopper);
                    }, 1000);
                }
            }
        });
    }

    private spriteMovement(sprite: any, x: number = 0, y: number = 0, money: number = 0, update: Boolean = false, str: string){
        const char = sprite;
        let gsapper = gsap.to(char, {
            x: x,
            y: y,
            alpha: 1,
            duration: .8,
            onComplete: () => {
                if(money > 0){
                    this.addmoney(money);
                }
                if(update){
                    this.waterBomb(str, char);
                }
                char.alpha = 0;
                this.container2.removeChild(char);
                let stopper = setTimeout(() => {
                    gsapper.kill();
                    clearTimeout(stopper);
                }, 1000);
            }
        });
    }

    private waterBomb(str: string, sprite: PIXI.Sprite){
        sprite.alpha = 0;
        const splash = new PIXI.AnimatedSprite(this.splashtextures);
        splash.scale.set(.5)
        splash.position.x = sprite.position.x - 10;
        splash.position.y = sprite.position.y - (splash.height / 2);
        splash.animationSpeed = .3;
        splash.play();
        splash.onFrameChange = () => {
            if(splash.currentFrame == 10){
                splash.gotoAndStop(0);
                splash.alpha = 1;
                this.updatebar(str);
                this.container2.removeChild(splash);
            }
        };
        this.container2.addChild(splash);
    }

    private validateBallPosition(ball: PIXI.Graphics){
        let fish: PIXI.Sprite;
        let arr = this.imageArray;
        let position = ball.position.x;
        let charindex: number = -1;
        let texture: any;

        arr.forEach((element, index) => {
            if(position >= element.getBounds().x && position < (element.getBounds().x + element.getBounds().width)){
                fish = element;
                charindex = index;
            }
        });
        //check if bottle index = 1,5,10 
        if(charindex == 1 || charindex == 5 || charindex == 10){
            texture = arr[charindex].textures[0]
            if(ball.position.x >= 0 && ball.position.x <= (this.app.screen.width / 2)){
                this.createSprite(texture,ball,false,true,15,110,0,true,'left');
            }
            else{
                this.createSprite(texture,ball,false,true,432,110,0,true,'right');
            }
            charindex = -1;
        }
        //check if treasure index = 11 x2 bet
        else if(charindex == 12){
            texture = arr[charindex].textures[0]
            this.createSprite(texture,ball,false,true,830,480,2);
            charindex = -1;
        }
        //check if starfish spin all
        else if(charindex == 2 || charindex == 4 || charindex == 7 || charindex == 9 || charindex == 11 || charindex == 13){
            texture = this.spinalltextures;
            this.createSprite(texture,ball,false,false,0,0,0,false,'',true);
            charindex = -1;
            this.updategameplus();
        }
        //check if fish
        else if(charindex == 0 || charindex == 3 || charindex == 6){
            texture = arr[charindex].textures[0]
            this.createSprite(texture,ball,true,true,830,480,1);
            charindex = -1;
        }
        else{
            texture = this.nospintextures;
            this.createSprite(texture,ball,false,false,0,0,0,false,'',true);
            charindex = -1;
        }

        // fish!.alpha = 0;
        // let stopper = setTimeout(() => {
        //     fish.alpha = 1;
        //     clearTimeout(stopper);
        // }, 700);
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
