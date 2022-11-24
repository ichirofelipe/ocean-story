import * as PIXI from 'pixi.js';
import Pins from './components/Pins';
import Ball from './components/Ball';
import Coin from './components/Coin';

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
    private ticker: PIXI.Ticker;
    private ticker2: PIXI.Ticker;
    private downright: Boolean = false;
    private downleft: Boolean = false;
    private upright: Boolean = false;
    private upleft: Boolean = false;
    private up: Boolean = true;
    private down: Boolean = false;
    private ball: Coin;
    private mazeContainer: PIXI.Container;
    private mazewidth: number;
    private mazeheight: number;
    private pinrow: number;
    private pincolumn: number;
    private reelContainer: PIXI.Container;
    private reelwidth: number;
    private reelheight: number;
    private imgTextures: Array<PIXI.Texture>;
    public imageArray: Array<PIXI.Sprite> = [];
    private rectMask: PIXI.Graphics;
    private imgWidth: number;
    private spacing: number;
    private dropperContainer: PIXI.Container;
    private haveBall: Boolean = true;
    private craneTextures: Array<PIXI.Texture> = [];
    private craneAnimate: PIXI.AnimatedSprite;
    private craneTexture: PIXI.Texture;
    private arrayPins: Array<PIXI.Graphics> = [];
    private readonly reelSpeed: number = 4;
    private readonly ballRadius: number = 14;
    private readonly pinRadius: number = 5;
    private readonly pinGap: number = 7;
    private readonly stageHeight: number = .6;
    private readonly stageWidth: number = .9;

    constructor(app: PIXI.Application, loader: PIXI.Loader) {
        this.app = app;
        this.loader = loader;
        this.stage = this.loader.resources!.plinko.textures!['stage.png'];
        this.pipe = this.loader.resources!.plinko.textures!['pipe.png'];
        this.bar1 = this.loader.resources!.plinko.textures!['bar1.png'];
        this.bar2 = this.loader.resources!.plinko.textures!['bar2.png'];
        this.imgTextures = [
            this.loader.resources!.plinko.textures!['fish1.png'],
            this.loader.resources!.plinko.textures!['bottle.png'],
            this.loader.resources!.plinko.textures!['starfish1.png'],
            this.loader.resources!.plinko.textures!['fish2.png'],
            this.loader.resources!.plinko.textures!['starfish2.png'],
            this.loader.resources!.plinko.textures!['bottle.png'],
            this.loader.resources!.plinko.textures!['fish3.png'],
            this.loader.resources!.plinko.textures!['starfish3.png'],
            this.loader.resources!.plinko.textures!['bomb.png'],
            this.loader.resources!.plinko.textures!['starfish4.png'],
            this.loader.resources!.plinko.textures!['bottle.png'],
            this.loader.resources!.plinko.textures!['treasure.png'],
            this.loader.resources!.plinko.textures!['starfish5.png']
        ];
        this.init();
    }

    private init() {
        window.addEventListener('keypress', e => this.dropBallAnimation(e));
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
        this.ticker.start();
        this.ticker2 = new PIXI.Ticker();
        this.ticker2.add(this.movementsReel.bind(this));
        this.ticker2.start();
    }

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
        this.pipeSprite.position.y = 25;
        this.container.addChild(this.pipeSprite);
    }

    private createStage(){
        this.stageSprite = new PIXI.Sprite(this.stage);
        this.stageSprite.width = this.app.screen.width * this.stageWidth;
        this.stageSprite.height = this.app.screen.height *  this.stageHeight;
        this.stageSprite.position.x = (this.app.screen.width / 2) - (this.stageSprite.width / 2);
        this.stageSprite.position.y = (this.pipeSprite.height / 2) + 25;
        this.container.addChild(this.stageSprite);
    }

    private createBar(){
        this.container2 = new PIXI.Container();

        //left
        this.barSpriteLeft = new PIXI.Sprite(this.bar1);
        this.barSpriteLeft.width = 85;
        this.barSpriteLeft.height = this.stageSprite.height + 11;
        this.barSpriteLeft.position.y = (this.pipeSprite.height / 2) + 22;
        this.barSpriteLeft.position.x = -9;
        this.container2.addChild(this.barSpriteLeft);

        //right
        this.barSpriteRight = new PIXI.Sprite(this.bar2);
        this.barSpriteRight.width = 85;
        this.barSpriteRight.height = this.stageSprite.height + 11;
        this.barSpriteRight.position.y = (this.pipeSprite.height / 2) + 22;
        this.barSpriteRight.position.x = this.stageSprite.width - 26;
        this.container2.addChild(this.barSpriteRight);
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
        let adjustx = 8;
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
        for(let i = 0; i < this.imgTextures.length; i++){
            const fishImage  = new PIXI.Sprite(this.imgTextures[i]);
            fishImage.height = this.reelheight;
            fishImage.width = width;
            fishImage.position.x = i * width;
            overall+=width;
            this.imageArray.push(fishImage);
            this.reelContainer.addChild(fishImage);
        }
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
        //ball and crane
        if(this.upright){
            if(this.dropperContainer.position.x >= 405){
                this.dropperContainer.position.y += 1;
                this.dropperContainer.position.x += 1;
                if(this.dropperContainer.position.y >= 40){
                    this.upright = false;
                    this.down = true;
                }
            }
            else{
                this.dropperContainer.position.x += 2;
            }
        }
        if(this.up){
            if(this.dropperContainer.position.y <= 45){
                this.dropperContainer.position.y -= 1;
                this.dropperContainer.position.x += 1; 
                if(this.dropperContainer.position.y <= 25){
                    this.upright = true;
                    this.up = false;
                }
            }
            else{
                this.dropperContainer.position.y -= 2;
            }
        }
        if(this.down){
            this.dropperContainer.position.y += 2;
            if(this.dropperContainer.position.y >= 184){
                if(!this.haveBall){
                    this.ball = new Coin((this.craneAnimate.width - (this.ballRadius * 2)), this.craneAnimate.height - this.ballRadius, this.ballRadius, this.loader);
                    this.dropperContainer.addChild(this.ball.ball);
                    this.haveBall = true;
                }
                this.down = false;
                this.downright = true;
            }
        }
        if(this.downright){
            if(this.dropperContainer.position.y <= 40){
                this.dropperContainer.position.y -= 1;
                this.dropperContainer.position.x -= 1;
                if(this.dropperContainer.position.x <= 405){
                    this.upleft = true;
                    this.downright = false;
                }
            }
            else{
                this.dropperContainer.position.y -= 2;
            }
        }
        if(this.upleft){
            if(this.dropperContainer.position.x <= 20){
                this.dropperContainer.position.y += 1;
                this.dropperContainer.position.x -= 1;
                if(this.dropperContainer.position.y >= 40){
                    this.downleft = true;
                    this.upleft = false;
                }
            }
            else{
                this.dropperContainer.position.x -= 2;
            }
        }
        if(this.downleft){
            if(this.dropperContainer.position.y >= 184){
                if(!this.haveBall){
                    this.ball = new Coin((this.craneAnimate.width - (this.ballRadius * 2)), this.craneAnimate.height - this.ballRadius, this.ballRadius, this.loader);
                    this.dropperContainer.addChild(this.ball.ball);
                    this.haveBall = true;
                }
                this.downleft = false;
                this.up = true;
            }
            else{
                this.dropperContainer.position.y += 2;
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

    private dropBallAnimation(e: any){
        if(e.keyCode == 32 ){
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
                    const ball = new Ball(x, y, this.ballRadius, this.loader, this.container, reelposition, this.imageArray, this.arrayPins);
                    this.container.addChild(ball.ball);
                }
            };
            this.craneAnimate.onComplete = () => {
                this.craneAnimate.gotoAndStop(0);
            }
        }
    }
}
