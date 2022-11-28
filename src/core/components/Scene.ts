import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {Reefs, LoopingBubbles} from './sceneSettings.json';
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
  private bottomTextures: Array<PIXI.Texture> = [];
  private bottomAnimate: PIXI.AnimatedSprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createBG();
    this.createAnimatedSprite();
    this.createReefs();
    this.createBubbles();
    this.createLoopBubbles();
  }

  private createAnimatedSprite(){
    for(let img in this.app.loader.resources!.bottom.textures){
        const texture = PIXI.Texture.from(img);
        this.bottomTextures.push(texture);
    } 
    this.bottomAnimate = new PIXI.AnimatedSprite(this.bottomTextures);
    this.bottomAnimate.scale.set(.5)
    this.bottomAnimate.position.y = this.container.height - this.bottomAnimate.height;
    this.bottomAnimate.animationSpeed = .1;
    this.bottomAnimate.play();
    this.container.addChild(this.bottomAnimate);
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

  public createBubbles() {
    const texture = this.app.loader.resources!.scene.textures!['bubble.png'];

    for(let count=0; count < 130; count++){
      this.bubbles[count] = new PIXI.Sprite(texture);

      //RNG
      let scale = Functions.randMinMax(0.1, 1);
      this.bubbles[count].height = Helpers.autoHeight(this.bubbles[count], (150*scale))
      this.bubbles[count].width = (150*scale);
      
      let posX = Functions.randMinMax(0, this.app.screen.width);
      this.bubbles[count].x = posX - this.bubbles[count].width;

      let posY = Functions.randMinMax(this.bubbles[count].height+(this.app.screen.height*1.5), this.app.screen.height*3);
      this.bubbles[count].y = posY - this.bubbles[count].height;

      this.container.addChild(this.bubbles[count]);
    }
  }

  public deleteBubbles() {
    this.bubbles.forEach(bubble => {
      this.container.removeChild(bubble);
    });
    this.bubbles = [];
  }

  private createLoopBubbles() {
    const texture = this.app.loader.resources!.scene.textures!['bubble.png'];

    LoopingBubbles.forEach(loopB => {
      for(let count=0; count < loopB.count; count++){
        const bubble = new PIXI.Sprite(texture);
        bubble.height = Helpers.autoHeight(bubble, (150*0.1))
        bubble.width = (150*0.1);
        bubble.x = loopB.posX;
        bubble.y = ((this.app.screen.height*3) - (bubble.height + loopB.posY));
  
        this.container.addChild(bubble);
        
        gsap.to(bubble, {
          y: bubble.y - Functions.randMinMax(loopB.minHeight, loopB.maxHeight),
          // alpha: 0,
          ease: 'sine.in',
          duration: Functions.randMinMax(loopB.minDuration, loopB.maxDuration),
          repeat: -1,
          delay: Functions.randMinMax(0.3, 1)*count
        })
        gsap.to(bubble, {
          x: bubble.x - (bubble.width/Functions.randMinMax(0.5, 2)),
          duration: Functions.randMinMax(1, 2.5),
          yoyo: true,
          repeat: -1,
        })
      }
    })
    
  }

  public bubbleAnimate() {

    this.bubbles.forEach(bubble => {
      gsap.to(bubble, {
        y: -bubble.height,
        alpha: 0,
        duration: (180-bubble.height)/6,
      })
      gsap.to(bubble, {
        x: Functions.randMinMax(0, this.app.screen.width),
        duration: 40,
      })

      // let deleteBubbles = setTimeout(() => {
      //   this.bubbles.forEach(bubble => {
      //     this.container.removeChild(bubble);
      //   });
      //   this.bubbles = [];

      //   clearTimeout(deleteBubbles)
      // }, 20000);
    })
  }

}