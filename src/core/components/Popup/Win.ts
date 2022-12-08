import * as PIXI from 'pixi.js';
import Functions from '../../Functions';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Win {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private coinsContainer: PIXI.Container;
  private money: number;
  private bet: number;
  private overlay: PIXI.Sprite;
  private displayMoney: PIXI.Text;
  private win: PIXI.Sprite;
  private closeWin: () => void;
  private winSettings = {
    name: "",
    animationSpeed: 0.3,
    isAnimated: true,
  }
  private coinSettings = {
    name: "coin",
    animationSpeed: 0.3,
    isAnimated: true,
    isPlay: false,
  }

  constructor(app: PIXI.Application, money: number, bet: number, closeWin: () => void) {
    this.app = app;
    this.money = money;
    this.bet = bet;
    this.container = new PIXI.Container;
    this.coinsContainer = new PIXI.Container;
    this.closeWin = closeWin;
    
    this.init();
  }

  private init() {
    this.setInitValues();
    this.createOverlay();
    this.createWin();
    this.createCoin();
    this.createDisplayMoney();
  }

  private setInitValues() {
    if((this.money/this.bet) >= 20)
      this.winSettings.name = 'big_win'
    if((this.money/this.bet) >= 40)
      this.winSettings.name = 'mega_win'
  }

  private createOverlay() {
    const texture = this.app.loader.resources!.overlay.texture;
    this.overlay = new PIXI.Sprite(texture);
    this.overlay.width = this.app.screen.width;
    this.overlay.height = this.app.screen.height;
    this.overlay.interactive = true;
    this.overlay.buttonMode = true;
    this.overlay.alpha = 0.01;
    this.overlay.addListener("pointerdown", this.hide.bind(this))
    
    this.container.addChild(this.overlay);
  }

  private createWin() {
    this.win = Functions.getSprite(this.app.loader, this.winSettings);
    this.win.x = (this.app.screen.width - this.win.width) / 2;
    this.win.y = (this.app.screen.height - this.win.height) / 2;
    this.win.anchor.set(0.5);
    this.win.x += this.win.width/2;
    this.win.y += 70;
    this.win.scale.set(0.01);

    this.container.addChild(this.win);
  }

  private createDisplayMoney() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Luckiest Guy',
      fontSize: 60,
      fillGradientType: 0,
      fill: ['#f1c001', '#bf6600'],
      fillGradientStops: [0.4, 0.9],
      fontWeight: 'bold',
      stroke: "#00000080",
      strokeThickness: 5,
      letterSpacing: 3,
      dropShadow: true,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
      dropShadowBlur: 3
    });

    this.displayMoney = new PIXI.Text('', style);
    this.displayMoney.y = (this.app.screen.height - this.displayMoney.height) / 2;
    this.displayMoney.y += 100;

    this.container.addChild(this.displayMoney);
  }

  private createCoin() {

    // LEFTCOINS
    for(let count = 0; count < 20; count++){
      let coin: any = Functions.getSprite(this.app.loader, this.coinSettings);
      let accelX = Functions.randMinMax(3.5, 5.5);
      let coinSpeed = 0.15;
      const gravity = 0.15;
      coin.scale.set(Functions.randMinMax(0.15, 0.25));
      coin.anchor.set(0.5);
      coin.x += coin.width;
      coin.y += coin.height;
      coin.x = - coin.width;
      coin.y = this.app.screen.height - Functions.randMinMax(100,350);
      
      this.coinsContainer.addChild(coin);

      const coinAnimation = gsap.to(coin, {
        rotation: Math.random() * 20,
        duration: 3,
        ease: "sine.in",
        repeat: -1,
        delay: Functions.randMinMax(0, 5),
        onStart: () => {
          coin.play();
        },
        onUpdate: () => {
          coin.y += coinSpeed;
          coin.x += accelX;
          coinSpeed += gravity;

          if(accelX > 0)
            accelX -= gravity/3;
          if(accelX < 0)
            accelX = 0

          if(coin.y > this.app.screen.height){
            coinSpeed = 0.15;
            accelX = Functions.randMinMax(3.5, 5.5);
            coin.y = this.app.screen.height - Functions.randMinMax(100,350);
            coin.scale.set(Functions.randMinMax(0.15, 0.25));
            coin.x = - coin.width;
            coinAnimation.repeat();
          }
        }
      })
    }


    // RIGHTCOINS
    for(let count = 0; count < 20; count++){
      let coin: any = Functions.getSprite(this.app.loader, this.coinSettings);
      let accelX = Functions.randMinMax(3.5, 5.5);
      let coinSpeed = 0.15;
      const gravity = 0.15;
      coin.scale.set(Functions.randMinMax(0.15, 0.25));
      coin.anchor.set(0.5);
      coin.x += coin.width;
      coin.y += coin.height;
      coin.x = this.app.screen.width + (coin.width/2);
      coin.y = this.app.screen.height - Functions.randMinMax(100,350);
      
      this.coinsContainer.addChild(coin);

      const coinAnimation = gsap.to(coin, {
        rotation: Math.random() * 20,
        duration: 3,
        ease: "sine.in",
        repeat: -1,
        delay: Functions.randMinMax(0, 5),
        onStart: () => {
          coin.play();
        },
        onUpdate: () => {
          coin.y += coinSpeed;
          coin.x -= accelX;
          coinSpeed += gravity;

          if(accelX > 0)
            accelX -= gravity/3;
          if(accelX < 0)
            accelX = 0

          if(coin.y > this.app.screen.height){
            coinSpeed = 0.15;
            accelX = Functions.randMinMax(3.5, 5.5);
            coin.y = this.app.screen.height - Functions.randMinMax(100,350);
            coin.scale.set(Functions.randMinMax(0.15, 0.25));
            coin.x = this.app.screen.width;
            coinAnimation.repeat();
          }
        }
      })
    }

    this.container.addChild(this.coinsContainer);
  }

  public show() {
    gsap.to(this.overlay, {
      alpha: 1,
      duration: 0.8,
    })
    gsap.to(this.win.scale, {
      x: 1,
      y: 1,
      duration: 0.8,
      onComplete: () => {
        let target = { val: 0 };
        gsap.to(target, {
          val: this.money,
          duration: 4,
          ease: "power1.in",
          onUpdate: () => {
            this.displayMoney.text = `$${Functions.formatNum(target.val)}`;
            this.displayMoney.x = (this.app.screen.width - this.displayMoney.width) / 2;
          },
          onComplete: () => {
            let delayBeforeClose = setTimeout(() => {
              this.hide();
              clearTimeout(delayBeforeClose);
            }, 3000);
          }
        })
      }
    })
  }

  public hide() {
    gsap.to(this.overlay, {
      alpha: 0,
      duration: 0.8,
    })
    gsap.to(this.win.scale, {
      x: 0,
      y: 0,
      duration: 0.8,
      onComplete: () => {
        this.overlay.interactive = false;
        this.closeWin();
      }
    })
    gsap.to(this.displayMoney, {
      alpha: 0,
      duration: 0.8,
    })
    gsap.to(this.coinsContainer, {
      alpha: 0,
      duration: 0.8,
      onComplete: () => {
        this.container.removeChild(this.coinsContainer);
      }
    })
  }
}