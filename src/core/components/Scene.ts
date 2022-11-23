import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {Reefs} from './sceneSettings.json';

export default class Scene {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public reefsContainer: PIXI.Container;
  public bgSprite: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createBG();
    this.createReefs();
  }

  private createBG() {
    const texture = this.app.loader.resources!.scene.textures!['main-bg.jpg'];
    this.bgSprite = new PIXI.Sprite(texture);
    this.bgSprite.height = Helpers.autoHeight(this.bgSprite, this.app.screen.width);
    this.bgSprite.width = this.app.screen.width;

    this.container.addChild(this.bgSprite);
  }

  private createReefs() {
    this.container.sortableChildren = true;
    
    Reefs.forEach((reef: any, index) => {
      const texture = this.app.loader.resources!.scene.textures![`${reef.name}.png`];
      let img = new PIXI.Sprite(texture);
      
      img.scale.set(0.5, 0.5);
      img.y = this.container.height - img.height - reef.bottom;
      if(reef.left !== undefined){
        img.x = reef.left;
      }
      else{
        img.x = this.app.screen.width - img.width - reef.right;
      }
      img.zIndex = reef.zIndex;

      this.container.addChild(img);
    });
  }

}