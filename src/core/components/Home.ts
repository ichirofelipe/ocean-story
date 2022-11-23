import * as PIXI from 'pixi.js';
import { text } from 'stream/consumers';
import Helpers from '../slot/tools/Helpers';

export default class Home {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public bgSprite: PIXI.Sprite;
  public startSprite: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.init();
  }

  private init() {
    this.createBG();
    this.createStart();
  }

  private createBG() {
    const texture = this.app.loader.resources!.home.textures!['background.jpg'];
    this.bgSprite = new PIXI.Sprite(texture);

    this.container.addChild(this.bgSprite);
  }

  private createStart() {
    const texture = this.app.loader.resources!.home.textures!['start.png'];
    this.startSprite = new PIXI.Sprite(texture);
    this.startSprite.height = Helpers.autoHeight(this.startSprite, 200)
    this.startSprite.width = 200;

    this.container.addChild(this.startSprite);
  }

}