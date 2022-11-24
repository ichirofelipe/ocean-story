import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {Reefs} from './sceneSettings.json';
import Functions from '../Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Scene {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public reefsContainer: PIXI.Container;
  public bgSprite: PIXI.Sprite;
  private bubbles: Array<PIXI.Sprite> = [];

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createBG();
    this.createReefs();
    this.createBubbles();
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

  private createBubbles() {
    const texture = this.app.loader.resources!.scene.textures!['bubble.png'];

    for(let count=0; count < 150; count++){
      this.bubbles[count] = new PIXI.Sprite(texture);

      //RNG
      let scale = Functions.randMinMax(0.2, 1);
      this.bubbles[count].height = Helpers.autoHeight(this.bubbles[count], (150*scale))
      this.bubbles[count].width = (150*scale);
      
      let posX = Functions.randMinMax(0, this.app.screen.width);
      this.bubbles[count].x = posX - this.bubbles[count].width;

      let posY = Functions.randMinMax(this.bubbles[count].height+(this.app.screen.height*1.5), this.app.screen.height*3)
      this.bubbles[count].y = posY - this.bubbles[count].height;

      this.container.addChild(this.bubbles[count]);
    }
  }

  public bubbleAnimate() {
    this.bubbles.forEach(bubble => {
      console.log(bubble.height);
      gsap.to(bubble, {
        y: -bubble.height,
        duration: (170-bubble.height)/5,
      })
    })
  }

}