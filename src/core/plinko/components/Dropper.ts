import * as PIXI from 'pixi.js';
import PlinkoReel from './PlinkoReel';
import plinkoFunctions from '../tools/PlinkoFunctions';

export default class Dropper {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private dropper: PIXI.Graphics;
  private padding: number = 5; // percentage
  private dropperSpeed: number = 3;
  private spring = .675;
  private coinSpeed:number = 0.2;
  private gravity:number = 25;
  private startPoint: number = 0;
  private endPoint: number = 0; 
  private reel: PlinkoReel;
  private droppable: boolean = true;
  public dropperSize: number = 100;
  private pins: Array<PIXI.Graphics>;

  constructor(app: PIXI.Application, reel:PlinkoReel, pins: Array<PIXI.Graphics>) {
    this.app = app;
    this.container = new PIXI.Container;
    this.container.sortableChildren = true;
    this.reel = reel;
    this.pins = pins;

    this.init();
  }

  private init() {
    this.createDropper();
    this.createDropEvent();
    this.dropperStartMotion();
  }

  private createDropper() {
    this.startPoint = this.app.screen.width * (this.padding/100);
    this.endPoint = this.app.screen.width - (this.app.screen.width * (this.padding/100));

    this.dropper = new PIXI.Graphics();
    this.dropper.beginFill(0xffffff)
    .drawRect(0,0, this.dropperSize, this.dropperSize)
    .endFill();
    this.dropper.x = this.startPoint;
    this.dropper.zIndex = 1;

    this.container.addChild(this.dropper);
  }

  private createDropEvent() {
    window.addEventListener('keypress', e => this.dropCoin(e))
  }

  private createFallingCoin() {
    let coinRad = 13;
    let coinPosX = (this.dropper.x + (this.dropper.width/2)) - coinRad;
    let coinPosY = this.dropper.height/2 - coinRad;

    const coin = new PIXI.Graphics();
    coin.beginFill(0xffff00);
    coin.drawCircle(0, 0, coinRad);
    coin.endFill();
    coin.x = coinPosX;
    coin.y = coinPosY;
    coin.zIndex = 0;

    this.container.addChild(coin);
    this.addFallAnimation(coin);
  }

  private dropperStartMotion() {
    const ticker = new PIXI.Ticker();

    ticker.add(this.dropperMotion.bind(this));
    ticker.start();
  }

  private dropperMotion(){
    this.dropper.x += this.dropperSpeed;
    if((this.dropper.x + this.dropper.width) >= this.endPoint || this.dropper.x <= this.startPoint)
      this.dropperSpeed *= -1;
  }

  private dropCoin(e: any) {
    if(e.keyCode == 32 && this.droppable){
      this.createFallingCoin();
      this.droppable = false;

      let stopper = setTimeout(() => {
        this.droppable = true;
        clearTimeout(stopper);
      }, 1000);
    }
  }

  private addFallAnimation(coin: PIXI.Graphics) {
    const FallAnimation = new PIXI.Ticker();
    let coinSpeed = this.coinSpeed;
    let reelHitArea = this.app.screen.height - this.reel.height;
    let hit = false;
    let coinXdirection = this.dropperSpeed/2;
    let lastHit = -1;
    console.log(reelHitArea);
    
    FallAnimation.add(delta => {
      coin.y += coinSpeed;
      coin.x += coinXdirection;
      coinSpeed += (this.gravity/100);

      if(coin.y >= reelHitArea && !hit){
        this.reel.animateHitBlock(coin);
        hit = !hit;
      }

      if(coin.y > this.app.screen.height){
        this.container.removeChild(coin);
        FallAnimation.destroy();
      }

      if((coin.x - (coin.width/2)) <= 0 || (coin.x + (coin.width/2)) >= this.app.screen.width)
        coinXdirection = coinXdirection * -1;

      this.pins.forEach((pin, index) => {
        let direction = plinkoFunctions.checkCoinHit(coin, pin);
        if(direction){
          if(lastHit != index){
            lastHit = index;

            pin.alpha = .4;

            coinXdirection = (direction+0.05)*.12 ;
            coinSpeed = (coinSpeed *this.spring) * -1;

            let reset = setTimeout(() => {
              lastHit = -1;
              pin.alpha = 1;
              clearTimeout(reset);
            }, 200);
          }
        }
      })
    })

    FallAnimation.start();
  }
}