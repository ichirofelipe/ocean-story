import * as PIXI from 'pixi.js';
import {Symbols} from '../../tools/settings.json';

export default class Block{
  private app: PIXI.Application;
  public container: PIXI.Container;
  public value: number;
  public size: number = 80;
  private symbolSprite: PIXI.Sprite;

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
    const texture = this.app.loader.resources!.symbols.textures![`${symbolName}.png`];
    this.symbolSprite = new PIXI.Sprite(texture);
    this.symbolSprite.height = this.size;
    this.symbolSprite.width = this.size;

    this.container.addChild(this.symbolSprite);
  }

  public updateValue() {
    const symbolName = Symbols[this.value - 1];
    const texture = this.app.loader.resources!.symbols.textures![`${symbolName}.png`];
    this.symbolSprite.texture = texture;
  }
}