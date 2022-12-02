import * as PIXI from "pixi.js";
import Helpers from "./slot/tools/Helpers";

const objGroupAnimation = (array: any) => {
  interface Animation {
    sprite: any;
    destination: number,
  }
  const arr: Animation[] = [];

  array.forEach((element: any) => {
    const {sprite, destination} = element;

    const arrTmp: Animation = {
      sprite: sprite,
      destination: destination
    }

    arr.push(arrTmp);
  })

  return arr;
}

const randMinMax = (min:number, max:number) => {
  let random = Math.random() * (max - min) + min;

  return random;
}

const getSprite = (loader: PIXI.Loader, setting: any) => {
  let img;
  if(setting.isAnimated){
    let textures: Array<PIXI.Texture> = [];
    for(let tmp in loader.resources![`${setting.name}`].textures){
      const texture = PIXI.Texture.from(tmp);
      textures.push(texture);
    }
    img = new PIXI.AnimatedSprite(textures);
    img.play();
  } else {
    const texture = loader.resources!.scene.textures![`${setting.name}.png`];
    img = new PIXI.Sprite(texture);
  }

  if(setting.height !== undefined){
    img.width = Helpers.autoWidth(img, setting.height);
    img.height = setting.height;
  }

  if(setting.rotation !== undefined){
    img.x = img.width/2;
    img.y = img.height/2;
    img.anchor.set(0.5);
    img.rotation = setting.rotation * Math.PI / 180;
  }

  if(setting.posX !== undefined)
    img.x += setting.posX;

  if(setting.posY !== undefined)
    img.y += setting.posY;

  if(setting.zIndex !== undefined)
    img.zIndex = setting.zIndex;

  if(setting.flip){
    img.scale.x*=-1;
    img.x += img.width;
  }

  return img;
}

const formatNumber = (number: number) => {
  let num;
  if(number > 0){
    num = number.toLocaleString("en-US");
  }
  else{
    num = "";
  }
  return num;
}

const formatGameNumber = (number: number) => {
  let newnumber = '';
  if(number >= 0 && number <= 9){
    newnumber = '00'+number;
  }
  else if(number >= 10 && number <= 99){
    newnumber = '0'+number;
  }
  else{
    newnumber = number.toLocaleString("en-US");
  }
  return newnumber;
}

export default {
  objGroupAnimation,
  randMinMax,
  getSprite,
  formatNumber,
  formatGameNumber
}