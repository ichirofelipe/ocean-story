import * as PIXI from 'pixi.js';

// GET KEY VALUE OF THE OBJECT
const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];

// AUTO HEIGHT THE SPRITE DEPENDING ON SIZE GIVEN FOR THE WIDTH
const autoHeight = (sprite: PIXI.Sprite, size: number) => {
  const {height, width} = sprite;
  let adjustment = size/width;
  let newHeight = height*adjustment;

  return newHeight;
}

// AUTO WIDTH THE SPRITE DEPENDING ON SIZE GIVEN FOR THE HEIGHT
const autoWidth = (sprite: any, size: number) => {
  const {height, width} = sprite;
  let adjustment = size/height;
  let newWidth = width*adjustment;

  return newWidth;
}

export default {
  getKeyValue,
  autoHeight,
  autoWidth
}