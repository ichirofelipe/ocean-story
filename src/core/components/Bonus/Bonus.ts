import * as PIXI from 'pixi.js';
import Helpers from '../../slot/tools/Helpers';
import Clam from './Clam';

export default class Bonus {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public clams: Array<number>;
  private frame: PIXI.Sprite;
  private perColumn: 4;
  
  constructor(app: PIXI.Application, clams: Array<number>) {
    this.app = app;
    this.clams = clams;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createFrame();
    this.createClams();
  }

  private createFrame() {
    const texture = this.app.loader.resources!.homebonus.textures!['frame.png'];
    this.frame = new PIXI.Sprite(texture);
    this.frame.height = Helpers.autoHeight(this.frame, (this.frame.width/2));
    this.frame.width = (this.frame.width/2);
    this.frame.x = (this.app.screen.width - this.frame.width) / 2;
    this.frame.y = (this.app.screen.height - this.frame.height) / 2;
    
    this.container.addChild(this.frame);
  }

  private createClams() {
    this.clams.forEach((val, index) => {
      const clam = new Clam(this.app, val, index, this.frame);

      this.container.addChild(clam.container);
    })
  }
}