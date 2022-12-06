import * as PIXI from 'pixi.js';
import Helpers from '../../slot/tools/Helpers';

export default class Clam {
  private app: PIXI.Application;
  private frame: PIXI.Sprite;
  public container: PIXI.Container;
  private value: number;
  private position: number;

  constructor(app: PIXI.Application, value: number, position: number, frame: PIXI.Sprite){
    this.app = app;
    this.frame = frame;
    this.value = value;
    this.position = position;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createInteractiveClam();
  }

  private createInteractiveClam() {
    const texture = this.app.loader.resources!.homebonus.textures!['clamp-close.png'];
    let img = new PIXI.Sprite(texture);
    img.height = Helpers.autoHeight(img, 120);
    img.width = 120;
    
    const columnSpace = ((this.frame.width - (img.width * 4)) / 3) / 2;
    img.x = this.frame.x + columnSpace + 14;
    img.y = 200;
    img.x += (img.width + columnSpace) * this.position;
    img.y += (img.height + 50) * Math.floor(this.position / 4);
    if(Math.floor(this.position / 4) > 0)
      img.x -= (img.width + columnSpace) * 4

    img.interactive = true;
    img.buttonMode = true;
    img.addListener('pointerdown', () => {
      
    })
    
    this.container.addChild(img);
  }
}