import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';

export default class Home {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public startSprite: PIXI.Sprite;
  private playbuttonTextures: Array<PIXI.Texture> = [];
  private playbuttonAnimate: PIXI.AnimatedSprite;
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
    const texture = this.app.loader.resources!.home.textures!['start.png'];
    const bottomPadding = 50;

    this.startSprite = new PIXI.Sprite(texture);
    this.startSprite.height = Helpers.autoHeight(this.startSprite, 200)
    this.startSprite.width = 200;
    this.startSprite.interactive = true;
    this.startSprite.buttonMode = true;
    this.startSprite.y = this.app.screen.height - (this.startSprite.height + bottomPadding);
    this.startSprite.x = (this.app.screen.width - this.startSprite.width)/2;

    this.container.addChild(this.startSprite);
    this.startSprite.addListener('pointerdown', this.startGame);

    for(let img in this.app.loader.resources!.playbutton.textures){
      const texture = PIXI.Texture.from(img);
      this.playbuttonTextures.push(texture);
    } 
    this.playbuttonAnimate = new PIXI.AnimatedSprite(this.playbuttonTextures);
    this.playbuttonAnimate.scale.set(.5)
    this.playbuttonAnimate.position.y = this.container.height - this.playbuttonAnimate.height;
    this.playbuttonAnimate.animationSpeed = .1;
    this.playbuttonAnimate.play();
    this.container.addChild(this.playbuttonAnimate);
  }

  // private fullscreen () {
  //   let canvas = document.getElementsByTagName('canvas');
  //   canvas[0].style.width = "auto";
  //   canvas[0].style.height = "auto";

  //   let elem = document.documentElement;
  //   elem.requestFullscreen();
  // }

}