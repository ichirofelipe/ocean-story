import * as PIXI from 'pixi.js';

export default class Home {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public bgSprite: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createBG();
  }

  private createBG() {
    const texture = this.app.loader.resources!.background.texture;
    this.bgSprite = new PIXI.Sprite(texture);

    this.container.addChild(this.bgSprite);
  }

}