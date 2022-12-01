import * as PIXI from "pixi.js";

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