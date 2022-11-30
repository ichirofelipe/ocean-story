import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {SlideShow} from './sceneSettings.json';
import gsap from 'gsap';

export default class Home {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public startSprite: PIXI.Sprite;
  private startGame: () => void;
  private logo: PIXI.Sprite;
  private uis: Array<PIXI.Sprite> = [];
  private radiobuttons: Array<PIXI.Sprite> = [];
  private radiobuttonswidth: number;
  private leftside: PIXI.Container;
  private rightside: PIXI.Container;
  private slideticker: PIXI.Ticker;
  private tickertimer: number = 0;
  private lastindex: number;
  private readonly radiobuttonsspacing: number = 10;

  constructor(app: PIXI.Application, startGame: () => void) {
    this.app = app;
    this.container = new PIXI.Container;
    this.rightside = new PIXI.Container;
    this.leftside = new PIXI.Container;
    this.startGame = startGame;
    this.init();
  }

  private init() {
    this.startLeftSide();
    this.startRightSide();
    this.autoPlaySlides();
  }

  private startLeftSide(){
    this.leftside.position.x = 0;
    this.leftside.position.y = 0;
    this.container.addChild(this.leftside);
    this.createUI();
    this.createRadioButtons();
  }

  private startRightSide(){
    this.rightside.position.x = this.app.screen.width * .6;
    this.rightside.position.y = 0;
    this.container.addChild(this.rightside);
    this.createStart();
    this.createLogo();
    this.createText();
  }

  private createText(){
    const style = new PIXI.TextStyle({
      fontFamily: 'Luckiest Guy',
      dropShadow: true,
      dropShadowAlpha: 0.8,
      dropShadowAngle: 2.1,
      dropShadowBlur: 2,
      dropShadowColor: '0x111111',
      dropShadowDistance: 3,
      fill: ['#FFE850', '#D5A300', '#AC8F00'],
      stroke: '#000',
      fontSize: 40,
      fontWeight: 'lighter',
      lineJoin: 'round',
      strokeThickness: 5
    });
    const text = new PIXI.Text('WIN UP TO 5,000 x BET', style);
    text.position.x = ((this.app.screen.width * .6) / 2) - (text.width / 2);
    text.position.y = (this.app.screen.height * .7 + (text.height / 2)) - 20;
    this.leftside.addChild(text)
  }

  private createStart() {
    const texture = this.app.loader.resources!.home.textures!['start.png'];
    this.startSprite = new PIXI.Sprite(texture);
    this.startSprite.scale.set(.5) 
    this.startSprite.interactive = true;
    this.startSprite.buttonMode = true;
    this.startSprite.anchor.set(.5)
    this.startSprite.y = 400;
    this.startSprite.x = ((this.app.screen.width - this.rightside.position.x) / 2);
    this.rightside.addChild(this.startSprite);
    this.startSprite.addListener('pointerdown', this.startGame);
    this.setBeat();
  }

  private setBeat(){
    gsap.to(this.startSprite.scale, {
      x: .6, y: .6, duration: 1, repeat: -1, yoyo: true,
    });
  }

  public stopBeat(){
    this.slideticker.destroy();
    gsap.killTweensOf(this.startSprite.scale)
  }

  private createLogo() {
    const texture = this.app.loader.resources!.slot.textures!['logo.png'];
    this.logo = new PIXI.Sprite(texture);
    const width = this.logo.width;
    this.logo.height = Helpers.autoHeight(this.logo, (width*0.37))
    this.logo.width = (width*0.37);
    this.logo.x = ((this.app.screen.width - this.rightside.position.x) / 2) - (this.logo.width / 2);
    this.logo.y = 15;
    this.rightside.addChild(this.logo);
  }

  private createUI(){
    this.setUI();
    this.drawUI();
  }

  private setUI(){
    let w = 0;
    let h = 0;
    let nw = 0;
    let nh = 0;

    SlideShow.forEach((img: any) => {
      const texture = this.app.loader.resources!.home.textures![`${img.name}.png`];
      const sprite = new PIXI.Sprite(texture);
      h = sprite.height;
      w = sprite.width;
      if(img.fixedwidth > 0){
        nw = img.fixedwidth;
        sprite.width = nw;
        sprite.height = (h / w) * nw;
      }
      else{
        nh = img.fixedheight;
        sprite.height = nh;
        sprite.width = (w / h) * nh;
      }
      sprite.alpha = img.alpha;
      this.uis.push(sprite);
    });
  }

  private drawUI(){
    const posy = this.app.screen.height * .7;
    const posx = (this.app.screen.width * .6) / 2;
    this.uis.forEach((sprite, ind) => {
      sprite.position.y = posy - sprite.height;
      sprite.position.x = posx - (sprite.width / 2);
      if(ind == 0){
        this.lastindex = ind;
      }
      this.leftside.addChild(sprite);
    });
  }

  private createRadioButtons(){
    this.setRadioButtons();
    this.drawRadioButtons();
  }

  private setRadioButtons(){
    let texture: PIXI.Texture;
    let width: number = 0;
    SlideShow.forEach((img:any) => {
      texture = this.app.loader.resources!.home.textures!['radioon.png'];
      if(img.radio == "off"){
        texture = this.app.loader.resources!.home.textures!['radiooff.png'];
      }
      const sprite = new PIXI.Sprite(texture);
      sprite.scale.set(.6);
      width += sprite.width;
      this.radiobuttonswidth = this.radiobuttonsspacing + width;
      this.radiobuttons.push(sprite);
    });
  }

  private drawRadioButtons(){
    const posy = this.app.screen.height - 90;
    let posx = 0;
    this.radiobuttons.forEach((btn, ind) => {
      posx = ((this.app.screen.width * .6) / 2) - (this.radiobuttonswidth / 2);
      if(ind > 0){
        posx += ind * (this.radiobuttonsspacing + btn.width);
      }
      btn.position.x = posx;
      btn.position.y = posy;
      btn.interactive = true;
      btn.buttonMode = true;
      btn.addListener('pointerdown', () => {
        this.slideShow(ind);
      });
      this.leftside.addChild(btn);
    });
  }

  private slideShow(ind: number){
    this.tickertimer = 0;
    const off = this.app.loader.resources!.home.textures!['radiooff.png'];
    const on = this.app.loader.resources!.home.textures!['radioon.png']

    this.radiobuttons.forEach(element => {
      element.texture = off;
    });

    if(this.radiobuttons[ind].texture == off){
      this.radiobuttons[ind].texture = on;
    }
    else{
      this.radiobuttons[ind].texture = off;
    }

    gsap.to(this.uis[this.lastindex],{
      alpha: 0, duration: 1
    });

    gsap.to(this.uis[ind],{
      alpha: 1, duration: 1
    });

    this.lastindex = ind;
  }

  private autoPlaySlides(){
      this.slideticker = new PIXI.Ticker();
      this.slideticker.add((delta) => {
        this.tickertimer += 1;
        if(this.tickertimer >= 400){
          this.tickertimer = 0;
          let index = 0;
          if(this.lastindex > 0){
            index = this.lastindex - 1;
          }
          else{
            index = this.lastindex + 1;
          }
          this.slideShow(index);
        }
      });
      this.slideticker.start();
  }

  // private fullscreen () {
  //   let canvas = document.getElementsByTagName('canvas');
  //   canvas[0].style.width = "auto";
  //   canvas[0].style.height = "auto";

  //   let elem = document.documentElement;
  //   elem.requestFullscreen();
  // }

}