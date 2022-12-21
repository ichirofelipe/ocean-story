import * as PIXI from "pixi.js";
import { settings } from "pixi.js";
import Helpers from "./slot/tools/Helpers";

// FOR INITIALIZING OBJECTS
const objGroupAnimation = (array: any) => {
  interface Animation {
    sprite: any;
    posY: number,
    alpha: number,
  }
  const arr: Animation[] = [];

  array.forEach((element: any) => {
    const {sprite, posY, alpha} = element;

    const arrTmp: Animation = {
      sprite: sprite,
      posY: posY,
      alpha: alpha
    }

    arr.push(arrTmp);
  })

  return arr;
}

// GENRATE A RANDOM NUMBER WITHIN THE SPECIFIED MINIMUM AND MAXIMUM NUMBER
const randMinMax = (min:number, max:number) => {
  let random = Math.random() * (max - min) + min;

  return random;
}


// GET SPRITE OR ANIMATED SPRITE
const getSprite = (loader: PIXI.Loader, setting: any) => {
  let img;
  let loaderName = 'scene';

  // CHECK IF LOADER NAME IS SET (LOADER NAME IS THE FOLDER NAME TO BE LOADED FOR ANIMATED SPRITE)
  if(setting.loaderName !== undefined)
    loaderName = setting.loaderName

  // CHECK IF SPRITE SETTING IS ANIMATED
  if(setting.isAnimated){
    let textures: Array<PIXI.Texture> = [];
    for(let tmp in loader.resources![`${setting.name}`].textures){
      const texture = PIXI.Texture.from(tmp);
      textures.push(texture);
    }
    img = new PIXI.AnimatedSprite(textures);
    img.animationSpeed = setting.animationSpeed;
    img.play();
    if(setting.isPlay !== undefined && setting.isPlay === false)
      img.stop();
  } 
  // IF NOT ANIMATED THEN GET THE SPRITE ALTERNATIVE
  else {
    const texture = loader.resources![loaderName].textures![`${setting.name}.png`];
    img = new PIXI.Sprite(texture);
  }


  // SET HEIGHT
  if(setting.height !== undefined){
    img.width = Helpers.autoWidth(img, setting.height);
    img.height = setting.height;
  }

  // SET WIDTH
  if(setting.width !== undefined){
    img.height = Helpers.autoHeight(img, setting.width);
    img.width = setting.width;
  }

  // SET ROTATION
  if(setting.rotation !== undefined){
    img.x = img.width/2;
    img.y = img.height/2;
    img.anchor.set(0.5);
    img.rotation = setting.rotation * Math.PI / 180;
  }

  // SET POSITION
  if(setting.posX !== undefined)
    img.x += setting.posX;

  if(setting.posY !== undefined)
    img.y += setting.posY;

  if(setting.zIndex !== undefined)
    img.zIndex = setting.zIndex;

  // IS THE SPRITE FLIPPED?
  if(setting.flip){
    img.scale.x*=-1;
    img.x += img.width;
  }

  return img;
}

// FORMAT NUMBER FOR MONEY DISPLAY
const formatNumber = (number: number) => {
  let num;
  if(number >= 0){
    num = number.toLocaleString("en-US");
  }
  else{
    num = "";
  }
  return num;
}

// FORMAT NUMBER WITH PARAMETER FOR THE NUMBER OF DECIMALS
const formatGameNumber = (number: number, decimals: number = 2) => {
  let newnumber = '';
  if(number >= 0 && number <= 9){
    newnumber = '00'+number;
  }
  else if(number >= 10 && number <= 99){
    newnumber = '0'+number;
  }
  else if(number == -1){
    newnumber = 'Ꝏ';
  }
  else{
    newnumber = number.toLocaleString("en-US");
  }
  
  return newnumber;
}

// ON AND OFF ANIMATIONS (ANIMATEDSPRITE, GSAP)
const toggleAnimations = (animations: Array<any>, play: boolean = true) => {
  animations.forEach(anim => {
    if(play){
      anim.play();
      return;
    }
    if(anim.textures !== undefined){
      anim.gotoAndStop(0);
      return;
    }
    anim.pause();
  })
}

// KILL ANIMATIONS (ANIMATEDSPRITE, GSAP)
const killAnimations = (animations: Array<any>) => {
  animations.forEach(anim => {
    if(anim.textures !== undefined){
      anim.gotoAndStop(0);
      return;
    }
    anim.kill();
  })
}

// FORMAT NUMBER
const formatNum = (num: number, decimals: number = 2) => {
  return num.toFixed(decimals).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export default {
  objGroupAnimation,
  randMinMax,
  getSprite,
  formatNumber,
  formatGameNumber,
  toggleAnimations,
  killAnimations,
  formatNum
}