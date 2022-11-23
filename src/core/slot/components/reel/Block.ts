import * as PIXI from 'pixi.js';
import {symbols} from '../../tools/settings.json';

export default class Block{
  private app: PIXI.Application;
  public container: PIXI.Container;
  public value: number;
  public size: number = 80;
  private box: PIXI.Graphics;
  private label: PIXI.Text;
  private symbolSprite: PIXI.Sprite;

  constructor(app: PIXI.Application, value: number){
    this.app = app;
    this.value = value;
    this.container = new PIXI.Container;
    
    this.init();
  }

  private init() {
    this.createSymbol();
    // this.createBox();
    // this.createNumber();
  }

  private createSymbol() {
    const symbolName = symbols[this.value - 1];
    const texture = this.app.loader.resources!.symbols.textures![`${symbolName}.png`];
    this.symbolSprite = new PIXI.Sprite(texture);
    this.symbolSprite.height = this.size;
    this.symbolSprite.width = this.size;

    this.container.addChild(this.symbolSprite);
  }

  // private createBox() {
  //   this.box = new PIXI.Graphics();
  //   this.box
  //   .beginFill(0xffffff)
  //   .drawRect(0, 0, this.size, this.size)
  //   .endFill();

  //   this.container.addChild(this.box);
  // }

  // private createNumber() {
  //   let labelStyle = new PIXI.TextStyle({
  //     fontSize: 50,
  //     fontWeight: 'bolder',
  //     fill: "#000000"
  //   });
  //   this.label = new PIXI.Text(this.value, labelStyle);
  //   this.label.x = (this.box.width/2) - (this.label.width/2);
  //   this.label.y = (this.box.height/2) - (this.label.height/2);

  //   this.box.addChild(this.label);
  // }

  public updateValue() {
    const symbolName = symbols[this.value - 1];
    const texture = this.app.loader.resources!.symbols.textures![`${symbolName}.png`];
    this.symbolSprite.texture = texture;
  }
}