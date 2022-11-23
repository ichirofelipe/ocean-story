import * as PIXI from 'pixi.js';

const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];

const autoHeight = (sprite: PIXI.Sprite, size: number) => {
  const {height, width} = sprite;
  let adjustment = size/width;
  let newHeight = height*adjustment;

  return newHeight;
}

export default {
  getKeyValue,
  autoHeight
}