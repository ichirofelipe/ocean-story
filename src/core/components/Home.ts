import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import gsap from 'gsap';

export default class Home {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public startSprite: PIXI.Sprite;
  private startGame: () => void;

  constructor(app: PIXI.Application, startGame: () => void) {
    this.app = app;
    this.container = new PIXI.Container;
    this.startGame = startGame;
    this.init();
  }

  private init() {
    this.createStart();
  }

  private createStart() {
    const texture = this.app.loader.resources!.home.textures!['play.png'];
    const bottomPadding = 50;

    this.startSprite = new PIXI.Sprite(texture);
    this.startSprite.scale.set(.5) 
    this.startSprite.interactive = true;
    this.startSprite.buttonMode = true;
    this.startSprite.anchor.set(.5)
    this.startSprite.y = this.app.screen.height - (this.startSprite.height + bottomPadding);
    this.startSprite.x = (this.app.screen.width - this.startSprite.width)/2;
    this.container.addChild(this.startSprite);
    this.startSprite.addListener('pointerdown', this.startGame);
    this.setBeat();
  }

  private setBeat(){
    gsap.to(this.startSprite.scale, {
      x: .7, y: .7, duration: 1, repeat: -1, yoyo: true,
    });
  }

  public stopBeat(){
    console.log("wow")
    gsap.killTweensOf(this.startSprite.scale)
  }


  // private fullscreen () {
  //   let canvas = document.getElementsByTagName('canvas');
  //   canvas[0].style.width = "auto";
  //   canvas[0].style.height = "auto";

  //   let elem = document.documentElement;
  //   elem.requestFullscreen();
  // }

}