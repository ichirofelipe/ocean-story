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
  private uistext: Array<any> = [];
  private radiobuttons: Array<PIXI.Sprite> = [];
  private radiobuttonswidth: number;
  private leftside: PIXI.Container;
  private rightside: PIXI.Container;
  private slideticker: PIXI.Ticker;
  private tickertimer: number = 0;
  private lastindex: number;
  private playbtnTextures: Array<PIXI.Texture> = [];
  private playbtnAnimate: PIXI.AnimatedSprite;
  private playbtnTexture: PIXI.Texture;
  private bigger: Boolean;
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
    this.createText();
    this.createRadioButtons();
  }

  private startRightSide(){
    this.rightside.position.x = this.app.screen.width * .6;
    this.rightside.position.y = 0;
    this.container.addChild(this.rightside);
    this.createStart();
    this.createLogo();
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
    

    SlideShow.forEach((img: any, index) => {
      const text = new PIXI.Text(img.description, style);
      text.position.x = ((this.app.screen.width * .6) / 2) - (text.width / 2);
      text.position.y = (this.app.screen.height * .7 + (text.height / 2)) - 20;
      if(index > 0){
        text.alpha = 0;
      }
      this.uistext.push(text);
      this.leftside.addChild(text);
    });
  }

  private createStart() {
    // const texture = this.app.loader.resources!.home.textures!['start.png'];
    // this.startSprite = new PIXI.Sprite(texture);
    // this.startSprite.scale.set(.5) 
    // this.startSprite.interactive = true;
    // this.startSprite.buttonMode = true;
    // this.startSprite.anchor.set(.5)
    // this.startSprite.y = 400;
    // this.startSprite.x = ((this.app.screen.width - this.rightside.position.x) / 2);
    // this.rightside.addChild(this.startSprite);
    // this.startSprite.addListener('pointerdown', this.startGame);
    // this.setBeat();
    for(let img in this.app.loader.resources!.playbutton.textures){
        this.playbtnTexture = PIXI.Texture.from(img);
        this.playbtnTextures.push(this.playbtnTexture);
    } 
    this.playbtnAnimate = new PIXI.AnimatedSprite(this.playbtnTextures);
    this.playbtnAnimate.scale.set(.8) 
    this.playbtnAnimate.interactive = true;
    this.playbtnAnimate.buttonMode = true;
    this.playbtnAnimate.anchor.set(.5)
    this.playbtnAnimate.y = 400;
    this.playbtnAnimate.x = ((this.app.screen.width - this.rightside.position.x) / 2);
    this.playbtnAnimate.animationSpeed = .3;
    this.playbtnAnimate.play();
    this.rightside.addChild(this.playbtnAnimate);
    this.playbtnAnimate.addListener('pointerdown', this.fullSpin.bind(this));
    this.playbtnAnimate.addListener('mouseover', () => {
      gsap.killTweensOf(this.playbtnAnimate);
    });
    this.playbtnAnimate.addListener('mouseout', () => {
      if(this.bigger){
        this.setSpinMax();
      }
      else{
        this.setSpinMin();
      }
    });
    this.setSpinMax();
  }

  private fullSpin(){
    let counter = 0;
    this.playbtnAnimate.animationSpeed = 1;
    gsap.killTweensOf(this.playbtnAnimate);
    this.playbtnAnimate.removeListener('mouseover');
    this.playbtnAnimate.removeListener('mouseout');
    let reset = setTimeout(() => {
      this.stopBeat();
      clearTimeout(reset);
    }, 2000);
    this.playbtnAnimate.onLoop = () => {
      counter++;
      if(counter == 3){
        this.playbtnAnimate.gotoAndStop(0);
        this.startGame();
      }
    };
  }

  private setSpinMax(){
    this.bigger = true;
    const spinMaxAnimate = gsap.to(this.playbtnAnimate, {
      width: 250, height: 250, duration: 1,
      onComplete: () => {
        this.setSpinMin();
        spinMaxAnimate.kill();
      }
    });
  }

  private setSpinMin(){
    this.bigger = false;
    const spinMinAnimate = gsap.to(this.playbtnAnimate, {
      width: 200, height: 200, duration: 1,
      onComplete: () => {
        this.setSpinMax();
        spinMinAnimate.kill();
      }
    });
  }



  public stopBeat(){
    this.slideticker.destroy();
    gsap.killTweensOf(this.uis);
    gsap.killTweensOf(this.uistext);
    gsap.killTweensOf(this.playbtnAnimate);
  }

  private createLogo() {
    const texture = this.app.loader.resources!.slot.textures!['logo.png'];
    this.logo = new PIXI.Sprite(texture);
    this.logo.height = Helpers.autoHeight(this.logo, 350)
    this.logo.width = 350;
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

    const toggleAnimate1 = gsap.to(this.uis[this.lastindex],{
      alpha: 0,
      duration: 1,
      onComplete: () => {
        toggleAnimate1.kill();
      }
    });

    const toggleAnimate2 = gsap.to(this.uis[ind],{
      alpha: 1,
      duration: 1,
      onComplete: () => {
        toggleAnimate2.kill();
      }
    });

    const toggleAnimate3 = gsap.to(this.uistext[this.lastindex],{
      alpha: 0,
      duration: 1,
      onComplete: () => {
        toggleAnimate3.kill();
      }
    });

    const toggleAnimate4 = gsap.to(this.uistext[ind],{
      alpha: 1,
      duration: 1,
      onComplete: () => {
        toggleAnimate4.kill();
      }
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