import * as PIXI from 'pixi.js';
import {Symbols, LargeSymbols} from '../../tools/settings.json';

export default class Block{
  private app: PIXI.Application;
  public container: PIXI.Container;
  public value: number;
  public overlapPixels: number = 1.25;
  public size: number = 95;
  public sizeAdjustment: number = 23;
  public symbolSprite: PIXI.AnimatedSprite;

  constructor(app: PIXI.Application, value: number){
    this.app = app;
    this.value = value;
    this.container = new PIXI.Container;
    
    this.init();
  }

  private init() {
    this.createSymbol();
  }

  private createSymbol() {
    const symbolName = Symbols[this.value - 1];
    let textures: Array<PIXI.Texture> = [];
    for(let tmp in this.app.loader.resources![symbolName].textures){
      const texture = PIXI.Texture.from(tmp);
      textures.push(texture);
    }
    this.symbolSprite = new PIXI.AnimatedSprite(textures);
    this.symbolSprite.animationSpeed = 0.35;

    this.validateSymbolSize(symbolName);
  }

  public updateValue() {
    const symbolName = Symbols[this.value - 1];
    let textures: Array<PIXI.Texture> = [];
    for(let tmp in this.app.loader.resources![symbolName].textures){
      const texture = PIXI.Texture.from(tmp);
      textures.push(texture);
    }
    this.symbolSprite.textures = textures;

    this.validateSymbolSize(symbolName);
  }

  private validateSymbolSize(symbolName: string) {
    this.symbolSprite.height = this.size * this.overlapPixels;
    this.symbolSprite.width = this.size * this.overlapPixels;
    this.symbolSprite.x = 0;
    this.symbolSprite.y = 0;

    if(!LargeSymbols.includes(symbolName)){
      this.symbolSprite.height -= this.sizeAdjustment;
      this.symbolSprite.width -= this.sizeAdjustment;
      this.symbolSprite.x += this.sizeAdjustment/2;
      this.symbolSprite.y += this.sizeAdjustment/2;
    }

    this.symbolSprite.x += 5;

    const imgContainer = new PIXI.Graphics();
    imgContainer.beginFill(0x00000000)
    .drawRect(0,0,this.size * this.overlapPixels,this.size * this.overlapPixels)
    .endFill();
    imgContainer.alpha = 0;

    this.container.addChild(imgContainer);
    this.container.addChild(this.symbolSprite);
  }
}