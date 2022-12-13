import * as PIXI from 'pixi.js';
import Pins from './components/Pins';
import Ball from './components/Ball';
import Coin from './components/Coin';
import gsap from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);

export default class Game {
    public app: PIXI.Application;
    public container: PIXI.Container;
    public container2: PIXI.Container;
    private loader: PIXI.Loader;
    private stage: PIXI.Texture;
    private stageSprite: PIXI.Sprite;
    private pipe: PIXI.Texture;
    private pipeSprite: PIXI.Sprite;
    private bar1: PIXI.Texture;
    private bar2: PIXI.Texture;
    private barSpriteLeft: PIXI.Sprite;
    private barSpriteRight: PIXI.Sprite;
    public ticker: PIXI.Ticker;
    public ticker2: PIXI.Ticker;
    public downright: Boolean = false;
    public downleft: Boolean = false;
    private upright: Boolean = false;
    private upleft: Boolean = false;
    public up: Boolean = true;
    public down: Boolean = false;
    private ball: Coin;
    private mazeContainer: PIXI.Container;
    private mazewidth: number;
    private mazeheight: number;
    private pinrow: number;
    private pincolumn: number;
    private reelContainer: PIXI.Container;
    private reelwidth: number;
    private reelheight: number;
    public imageArray: Array<PIXI.AnimatedSprite> = [];
    private rectMask: PIXI.Graphics;
    private imgWidth: number;
    private spacing: number;
    private dropperContainer: PIXI.Container;
    public haveBall: Boolean = true;
    private craneTextures: Array<PIXI.Texture> = [];
    private craneAnimate: PIXI.AnimatedSprite;
    private craneTexture: PIXI.Texture;
    private barcontent: PIXI.Texture;
    private leftBar: PIXI.Sprite;
    private leftBarMask: PIXI.Graphics;
    private rightBar: PIXI.Sprite;
    private rightBarMask: PIXI.Graphics;
    private arrayPins: Array<PIXI.Graphics> = [];
    public isDrop: Boolean = false;
    public startDrop: Boolean = false;
    private charAssets: Array<any>;
    private charAnimation: Array<PIXI.Texture> = [];
    public charSprite: Array<PIXI.AnimatedSprite> = [];
    private decmoney: () => void;
    private dropoff: () => void;
    private addmoney: (type: number) => void;
    private updategameplus: () => void;
    private updategameminus: () => void;
    private powerup: () => void;
    public ballArray: Array<Ball> = [];
    private ballIndex: number = 0;
    private origheightright: number;
    private origpositionright: number;
    private origheightleft: number;
    private origpositionleft: number;
    private readonly fullbarheight: number = 310;
    private readonly baradd: number = 6.2;
    private readonly reelSpeed: number = 4;
    private readonly ballRadius: number = 14;
    private readonly pinRadius: number = 5;
    private readonly pinGap: number = 10;
    private readonly stageHeight: number = .6;
    private readonly stageWidth: number = .9;
    private readonly adjusty: number = 4;
    private readonly clawspeed: number = 4;

    constructor(app: PIXI.Application, loader: PIXI.Loader, updategameplus: () => void, updategameminus: () => void, decmoney: () => void, dropoff: () => void, addmoney: (type: number) => void, powerup: () => void) {
        this.app = app;
        this.loader = loader;
        this.stage = this.loader.resources!.plinko.textures!['stage.png'];
        this.pipe = this.loader.resources!.plinko.textures!['pipe.png'];
        this.bar1 = this.loader.resources!.newplinko.textures!['frame_levelbar_1.png'];
        this.bar2 = this.loader.resources!.newplinko.textures!['frame_levelbar_1.png'];
        this.barcontent = this.loader.resources!.plinko.textures!['barcontent.png'];
        this.charAssets = [
            this.loader.resources!.fish1.textures,
            this.loader.resources!.bottle.textures,
            this.loader.resources!.starfish1.textures,
            this.loader.resources!.fish2.textures,
            this.loader.resources!.starfish2.textures,
            this.loader.resources!.bottle.textures,
            this.loader.resources!.fish3.textures,
            this.loader.resources!.starfish3.textures,
            this.loader.resources!.bomb.textures,
            this.loader.resources!.starfish4.textures,
            this.loader.resources!.bottle.textures,
            this.loader.resources!.bomb.textures,
            this.loader.resources!.treasure.textures,
            this.loader.resources!.starfish5.textures
        ];
        this.decmoney = decmoney;
        this.dropoff = dropoff;
        this.addmoney = addmoney;
        this.updategameplus = updategameplus;
        this.updategameminus = updategameminus;
        this.powerup = powerup;
        this.init();
    }

    private init() {
        this.createGame();
        this.createPipe();
        this.createStage();
        this.createDropper();
        this.createMaze();
        this.createReel();
        this.createReelMask();
        this.createBar();
        this.ticker = new PIXI.Ticker();
        this.ticker.add(this.movementsCrane.bind(this));
        // this.ticker.start();
        this.ticker2 = new PIXI.Ticker();
        this.ticker2.add(this.movementsReel.bind(this));
        // this.ticker2.start();
        // this.createMotionPath();
    }

    // private createMotionPath(){
    //     this.dropperContainer2 = new PIXI.Container();
    //     for(let img in this.loader.resources!.crane.textures){
    //         this.craneTexture2 = PIXI.Texture.from(img);
    //         this.craneTextures2.push(this.craneTexture2);
    //     } 
    //     this.craneAnimate2 = new PIXI.AnimatedSprite(this.craneTextures2);
    //     this.craneAnimate2.width = 55;
    //     this.craneAnimate2.height = 80;
    //     this.ball = new Coin((this.craneAnimate2.width - (this.ballRadius * 2)), this.craneAnimate2.height - this.ballRadius, this.ballRadius, this.loader);
    //     this.dropperContainer2.addChild(this.craneAnimate2);
    //     this.dropperContainer2.addChild(this.ball.ball);
    //     this.craneAnimate2.animationSpeed = 0.2;
        

    //     const container = new PIXI.Container();
    //     container.position.y = 230;
    //     container.position.x = 5;

    //     // const bunny = new PIXI.Sprite(this.loader.resources!.plinko.textures!['pin.png']);
    //     // bunny.anchor.set(.5)
    //     container.addChild(this.dropperContainer2);

    //     gsap.to(this.dropperContainer2, {
    //         duration: 3, 
    //         repeat: -1,
    //         yoyo: true,
    //         ease: "none",
    //         motionPath:{
    //           path: 'M 0 0 L 0 -181 C 0 -225 0 -225 59 -225 H 350 C 415 -225 415 -225 415 -183 V 0'
    //         },
    //         onRepeat: () => {
    //             console.log("wow")
    //         }
    //     });

    //     this.container.addChild(container);

    //     // this.container.addChild(this.dropperContainer2);
    // }


    private createDropper(){
        this.dropperContainer = new PIXI.Container();
        for(let img in this.loader.resources!.crane.textures){
            this.craneTexture = PIXI.Texture.from(img);
            this.craneTextures.push(this.craneTexture);
        } 
        this.craneAnimate = new PIXI.AnimatedSprite(this.craneTextures);
        this.craneAnimate.width = 55;
        this.craneAnimate.height = 80;
        this.ball = new Coin((this.craneAnimate.width - (this.ballRadius * 2)), this.craneAnimate.height - this.ballRadius, this.ballRadius, this.loader);
        this.dropperContainer.addChild(this.craneAnimate);
        this.dropperContainer.addChild(this.ball.ball);
        this.dropperContainer.position.y = this.pipeSprite.height - 40;
        this.dropperContainer.position.x = 4;
        this.craneAnimate.animationSpeed = 0.2;
        this.container.addChild(this.dropperContainer);
    }

    private createGame(){
        this.container = new PIXI.Container();
        this.container.width = this.app.screen.width;
        this.container.height = this.app.screen.height;
        this.app.stage.addChild(this.container);
    }

    private createPipe(){
        this.pipeSprite = new PIXI.Sprite(this.pipe);
        this.pipeSprite.width = this.app.screen.width * this.stageWidth;
        this.pipeSprite.height = (this.app.screen.height *  this.stageHeight) - 100;
        this.pipeSprite.position.x = (this.app.screen.width / 2) - (this.pipeSprite.width / 2);
        this.pipeSprite.position.y = this.adjusty;
        this.container.addChild(this.pipeSprite);
    }

    private createStage(){
        this.stageSprite = new PIXI.Sprite(this.stage);
        this.stageSprite.width = this.app.screen.width * this.stageWidth;
        this.stageSprite.height = this.app.screen.height *  this.stageHeight;
        this.stageSprite.position.x = (this.app.screen.width / 2) - (this.stageSprite.width / 2);
        this.stageSprite.position.y = (this.pipeSprite.height / 2) + this.adjusty;
        this.container.addChild(this.stageSprite);
    }

    private createBar(){
        this.container2 = new PIXI.Container();
        const posycontent = 123;
        //left
        this.barSpriteLeft = new PIXI.Sprite(this.bar1);
        this.barSpriteLeft.width = 60;
        this.barSpriteLeft.height = this.stageSprite.height + 11;
        this.barSpriteLeft.position.y = (this.pipeSprite.height / 2);
        this.barSpriteLeft.position.x = 2;
        this.container2.addChild(this.barSpriteLeft);

        //left bar content
        this.leftBar = new PIXI.Sprite(this.barcontent);
        this.leftBar.width = 37;
        this.leftBar.height = 310;
        this.leftBar.position.y = posycontent;
        this.leftBar.position.x = 15;
        this.container2.addChild(this.leftBar);

        //left mask
        this.leftBarMask = new PIXI.Graphics();
        this.leftBarMask.beginFill(0x000000);
        this.leftBarMask.drawRect(0,0,22,.1);
        this.leftBarMask.endFill();
        this.leftBarMask.position.y = (this.leftBar.position.y + this.leftBar.height) - this.leftBarMask.height;
        this.leftBarMask.position.x = 24;
        this.origheightleft = this.leftBarMask.height;
        this.origpositionleft = this.leftBarMask.position.y;
        this.container2.addChild(this.leftBarMask);
        this.leftBar.mask = this.leftBarMask;

        //right
        this.barSpriteRight = new PIXI.Sprite(this.bar2);
        this.barSpriteRight.width = 60;
        this.barSpriteRight.height = this.stageSprite.height + 11;
        this.barSpriteRight.position.y = (this.pipeSprite.height / 2);
        this.barSpriteRight.position.x = this.stageSprite.width - 14;
        this.container2.addChild(this.barSpriteRight);

        //right bar content
        this.rightBar = new PIXI.Sprite(this.barcontent);
        this.rightBar.width = 37;
        this.rightBar.height = 310;
        this.rightBar.position.y = posycontent;
        this.rightBar.position.x = 430;
        this.container2.addChild(this.rightBar);

        //right mask
        this.rightBarMask = new PIXI.Graphics();
        this.rightBarMask.beginFill(0x000000);
        this.rightBarMask.drawRect(0,0,22,.1);
        this.rightBarMask.endFill();
        this.rightBarMask.position.y = (this.rightBar.position.y + this.rightBar.height) - this.rightBarMask.height;
        this.origheightright = this.rightBarMask.height;
        this.origpositionright = this.rightBarMask.position.y;
        this.rightBarMask.position.x = 439;
        this.container2.addChild(this.rightBarMask);
        this.rightBar.mask = this.rightBarMask;
    }

    private createMaze(){
        this.mazeContainer = new PIXI.Container();
        this.mazewidth = Math.round(this.stageSprite.width * .8);
        this.mazeheight = Math.round(this.stageSprite.height * .75);
        this.mazeContainer.position.x = ((this.stageSprite.width / 2) - (this.mazewidth / 2)) + this.stageSprite.position.x;
        this.mazeContainer.position.y = this.stageSprite.position.y + 10;
        this.spacing = (this.ballRadius * 2) + (this.pinRadius * 2) + this.pinGap; 
        this.pincolumn = Math.round(this.mazewidth / this.spacing);
        this.pinrow = Math.round(this.mazeheight / this.spacing);

        let x = 0;
        let y = 0;
        let adjustx = 12;
        let adjusty = 15;

        for(let r = 0; r < this.pinrow; r++){
            y = ((r * this.spacing) + this.pinRadius) + adjusty;
            for(let i = 0; i < this.pincolumn; i++){
                x = (i * this.spacing) + this.pinRadius + adjustx;
                if(r % 2 != 0){
                    x += (this.spacing / 2);
                }
                if((x + this.pinRadius) < this.mazewidth){
                    const pin = new Pins(x + this.mazeContainer.position.x, y + this.mazeContainer.position.y, this.pinRadius, this.loader);
                    this.arrayPins.push(pin.pin);
                    this.container.addChild(pin.pin);
                }
            }
        }

        // this.container.addChild(this.mazeContainer);
    }

    private createReel(){
        this.reelContainer = new PIXI.Container();
        this.reelwidth = this.stageSprite.width;
        this.reelheight = Math.round(this.stageSprite.height * .25) - 25;
        this.reelContainer.position.x = ((this.stageSprite.width / 2) - (this.reelwidth / 2)) + this.stageSprite.position.x;
        this.reelContainer.position.y = this.mazeheight + this.mazeContainer.position.y + 5;

        //set image
        let overall: number = 0;
        let width: number = 60;
        let texture: PIXI.Texture;
        let characters: PIXI.AnimatedSprite;
        for(let i = 0; i < this.charAssets.length; i++){
            for(let img in this.charAssets[i]){
                texture = PIXI.Texture.from(img);
                this.charAnimation.push(texture);
            }

            characters = new PIXI.AnimatedSprite(this.charAnimation);
            characters.height = this.reelheight;
            characters.width = width;
            characters.position.x = i * width;
            overall+=width;
            this.imageArray.push(characters);
            this.charSprite.push(characters);
            this.charAnimation = [];
        }  
        this.charSprite.forEach(element => {
            element.animationSpeed = .6;
            this.reelContainer.addChild(element);
        });
        this.imgWidth = overall - width;
        this.container.addChild(this.reelContainer);
    }

    private createReelMask(){
        this.rectMask = new PIXI.Graphics();
        this.rectMask.beginFill(0x000000, 1);
        this.rectMask.drawRect(0, 0, this.reelwidth, this.reelheight);
        this.rectMask.endFill();
        this.reelContainer.addChild(this.rectMask);
        this.reelContainer.mask = this.rectMask;
    }

    private movementsCrane(){
        const path = [
            { pointup1 : 24, pointup2 : 6, pointupright1 : 405, pointupright2 : 21, pointdown1 : 184, pointdownright1 : 23, pointdownright2 : 402, pointupleft1 : 20, pointupleft2 : 20 },
            { pointup1 : 25, pointup2 : 7, pointupright1 : 404, pointupright2 : 21, pointdown1 : 184, pointdownright1 : 23, pointdownright2 : 405, pointupleft1 : 19, pointupleft2 : 20  },
            { pointup1 : 26, pointup2 : 6, pointupright1 : 403.1, pointupright2 : 17, pointdown1 : 184, pointdownright1 : 23, pointdownright2 : 405, pointupleft1 : 22, pointupleft2 : 20  },
            { pointup1 : 27, pointup2 : 6, pointupright1 : 402, pointupright2 : 17, pointdown1 : 184, pointdownright1 : 23, pointdownright2 : 405, pointupleft1 : 23, pointupleft2 : 20  },
            { pointup1 : 24, pointup2 : 8.5, pointupright1 : 401, pointupright2 : 17, pointdown1 : 184, pointdownright1 : 23, pointdownright2 : 405, pointupleft1 : 24, pointupleft2 : 20  }
        ]
        //crane up
        if(this.up){
            if(this.dropperContainer.position.y <= path[this.clawspeed - 1].pointup1){
                this.dropperContainer.position.y -= this.clawspeed;
                this.dropperContainer.position.x += this.clawspeed; 
                if(this.dropperContainer.position.y <= path[this.clawspeed - 1].pointup2){
                    this.upright = true;
                    this.up = false;
                }
            }
            else{
                this.dropperContainer.position.y -= this.clawspeed;
            }
        }
        //crane go to right
        if(this.upright){
            if(this.dropperContainer.position.x >= path[this.clawspeed - 1].pointupright1){
                this.dropperContainer.position.y += this.clawspeed;
                this.dropperContainer.position.x += this.clawspeed;
                if(this.dropperContainer.position.y >= path[this.clawspeed - 1].pointupright2){
                    this.upright = false;
                    this.down = true;
                }
            }
            else{
                this.dropperContainer.position.x += this.clawspeed;
            }
        }
        //crane go down
        if(this.down){
            this.dropperContainer.position.y += this.clawspeed;
            if(this.dropperContainer.position.y >= path[this.clawspeed - 1].pointdown1){
                if(!this.haveBall){
                    this.ball = new Coin((this.craneAnimate.width - (this.ballRadius * 2)), this.craneAnimate.height - this.ballRadius, this.ballRadius, this.loader);
                    this.dropperContainer.addChild(this.ball.ball);
                    this.haveBall = true;
                    if(this.startDrop){
                        this.isDrop = true;
                    }
                }
                this.down = false;
                this.downright = true;
            }
        }
        //crane go up in right
        if(this.downright){
            if(this.dropperContainer.position.y <= path[this.clawspeed - 1].pointdownright1){
                this.dropperContainer.position.y -= this.clawspeed;
                this.dropperContainer.position.x -= this.clawspeed;
                if(this.dropperContainer.position.x <= path[this.clawspeed - 1].pointdownright2){
                    this.upleft = true;
                    this.downright = false;
                }
            }
            else{
                this.dropperContainer.position.y -= this.clawspeed;
            }
        }
        //crane goto left
        if(this.upleft){
            if(this.dropperContainer.position.x <= path[this.clawspeed - 1].pointupleft1){
                this.dropperContainer.position.y += this.clawspeed;
                this.dropperContainer.position.x -= this.clawspeed;
                if(this.dropperContainer.position.y >= path[this.clawspeed - 1].pointupleft2){
                    this.downleft = true;
                    this.upleft = false;
                }
            }
            else{
                this.dropperContainer.position.x -= this.clawspeed;
            }
        }
        //crane go down
        if(this.downleft){
            if(this.dropperContainer.position.y >= path[this.clawspeed - 1].pointdown1){
                if(!this.haveBall){
                    this.ball = new Coin((this.craneAnimate.width - (this.ballRadius * 2)), this.craneAnimate.height - this.ballRadius, this.ballRadius, this.loader);
                    this.dropperContainer.addChild(this.ball.ball);
                    this.haveBall = true;
                    if(this.startDrop){
                        this.isDrop = true;
                    }
                }
                this.downleft = false;
                this.up = true;
            }
            else{
                this.dropperContainer.position.y += this.clawspeed;
            }
        }
        if(this.isDrop){
            if(this.dropperContainer.position.x >= 110 && this.dropperContainer.position.x <= 370){
                if(this.upright){
                    if(this.dropperContainer.position.x >= 111 + Math.round(this.getRandomInt(30, 258))){
                        this.dropBallAnimation();
                    }
                }
                if(this.upleft){
                    if(this.dropperContainer.position.x <= 369 - Math.round(this.getRandomInt(30, 258))){
                        this.dropBallAnimation();
                    }
                }
            }
        }
    }

    private movementsReel(){
        //reel
        this.imageArray.forEach((element, index) => {
            if((element.position.x + element.width) - this.reelSpeed <= 0){
                element.position.x = this.imgWidth;
            }
            element.position.x-=this.reelSpeed;
        });
    }

    private dropBallAnimation(){
        this.craneAnimate.play();
        this.craneAnimate.loop = false;
        this.craneAnimate.onFrameChange = () => {
            if(this.craneAnimate.currentFrame == 1){
                this.haveBall = false;
                this.dropperContainer.removeChild(this.ball.ball);
                let posx = 0;
                if(this.upleft){
                    posx = -2;
                }
                if(this.upright){
                    posx = 2;
                }
                const x = (this.dropperContainer.position.x) + (this.craneAnimate.width - (this.ballRadius * 2)) + posx;
                const y = this.dropperContainer.position.y + (this.craneAnimate.height - this.ballRadius);
                const reelposition = this.mazeheight + this.mazeContainer.position.y + 15;
                this.ballIndex++;
                const ball = new Ball(x, y, this.ballRadius, this.loader, this.container, this.container2, reelposition, this.imageArray, this.arrayPins, this.app, this.updateBar.bind(this), this.updategameplus, this.updategameminus, this.addmoney, this.removeElement.bind(this), this.ballIndex);
                this.container.addChild(ball.ball);
                this.ballArray.push(ball);
            }
        };
        this.craneAnimate.onComplete = () => {
            this.craneAnimate.gotoAndStop(0);
            this.isDrop = false;
            this.decmoney();
            this.dropoff();
        }
    }

    private powerOff(height1: number, position1: number, height2: number, position2: number){
        let gsapper = gsap.to(this.leftBarMask, {
            height: height1,
            y: position1,
            alpha: 1,
            duration: .3,
            onComplete: () => {
                let stopper = setTimeout(() => {
                    gsapper.kill();
                    clearTimeout(stopper);
                }, 1000);
            }
        });

        let gsapper2 = gsap.to(this.rightBarMask, {
            height: height2,
            y: position2,
            alpha: 1,
            duration: .3,
            onComplete: () => {
                let stopper = setTimeout(() => {
                    gsapper2.kill();
                    clearTimeout(stopper);
                }, 1000);
            }
        });

        this.powerup();
    }

    private powerUpChecker(mask: PIXI.Graphics){
        if(mask.height >= this.fullbarheight){
            this.powerOff(this.origheightleft, this.origpositionleft, this.origheightright, this.origpositionright);
        }
    }

    private powerOn(mask: PIXI.Graphics, bar: PIXI.Sprite){
        let gsapper = gsap.to(mask, {
            height: mask.height = mask.height + this.baradd,
            y: (bar.position.y + bar.height) - mask.height,
            duration: 1,
            onComplete: () => {
                let stopper = setTimeout(() => {
                    this.powerUpChecker(mask);
                    gsapper.kill();
                    clearTimeout(stopper);
                }, 1000);
            }
        });
    }

    private updateBar(type: string){
        if(type == 'right'){
            this.powerOn(this.rightBarMask, this.rightBar);
        }
        else{
            this.powerOn(this.leftBarMask, this.leftBar);
        }
    }

    private getRandomInt(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    public removeElement(element: any){
        let array: Array<Ball> = [];

        this.ballArray.forEach(ball => {
            if(ball.ballname != element){
                array.push(ball);
            }
        });

        this.ballArray = array;
    }
}
