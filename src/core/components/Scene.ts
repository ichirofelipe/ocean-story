import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {Reefs, LoopingBubbles, Trees} from './sceneSettings.json';
import Functions from '../Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GodrayFilter } from 'pixi-filters';
// import { Graphics } from 'pixi.js';


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Scene {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public reefsContainer: PIXI.Container;
  public bgSprite: PIXI.Sprite;
  private bubbles: Array<PIXI.Sprite> = [];
  private oceanBed: PIXI.AnimatedSprite;
  public lightRay: PIXI.AnimatedSprite;
  private mainContainer: PIXI.Container;

  constructor(app: PIXI.Application, mainContainer: PIXI.Container) {
    this.app = app;
    this.container = new PIXI.Container;
    this.mainContainer = mainContainer;

    this.init();
  }

  private init() {
    this.createBG();
    this.createTrees();
    this.createRays();
    this.createOceanBed();
    this.createReefs();
    this.createBubbles();
    this.createLoopBubbles();
  }

  private createBG() {
    const texture = this.app.loader.resources!.scene.textures!['main-bg.jpg'];
    this.bgSprite = new PIXI.Sprite(texture);
    this.bgSprite.height = Helpers.autoHeight(this.bgSprite, this.app.screen.width);
    this.bgSprite.width = this.app.screen.width;
    
    this.container.addChild(this.bgSprite);
    this.container.sortableChildren = true;
  }

  private createTrees() {
    
    Trees.forEach((tree:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, tree);

      img.x = tree.posX;
      img.y = tree.posY;
      img.zIndex = tree.zIndex;
      img.width = Helpers.autoWidth(img, tree.height);
      img.height = tree.height;
      img.animationSpeed = tree.animationSpeed;
      img.onLoop = () => {
        img.animationSpeed = Functions.randMinMax(0.2, 0.3);
        if(Functions.randMinMax(0, 5) > 3)
          img.textures.reverse();
      }

      if(tree.flip){
        img.scale.x*=-1;
        img.x += img.width;
      }

      this.container.addChild(img);
    })

  }

  private createRays () {

    let textures: Array<PIXI.Texture> = [];

    for(let img in this.app.loader.resources!.lightray.textures){
        const texture = PIXI.Texture.from(img);
        textures.push(texture);
    } 
    this.lightRay = new PIXI.AnimatedSprite(textures);
    this.lightRay.height = Helpers.autoHeight(this.lightRay, this.app.screen.width);
    this.lightRay.width = this.app.screen.width;
    this.lightRay.position.y = 0;
    this.lightRay.animationSpeed = 0.2;
    this.lightRay.alpha = 0.01;
    this.lightRay.zIndex = 1;
    this.lightRay.play();
    this.mainContainer.addChild(this.lightRay);

  }

  private createOceanBed(){
    let textures: Array<PIXI.Texture> = [];

    for(let img in this.app.loader.resources!.bottom.textures){
        const texture = PIXI.Texture.from(img);
        textures.push(texture);
    } 
    this.oceanBed = new PIXI.AnimatedSprite(textures);
    this.oceanBed.scale.set(.5)
    this.oceanBed.position.y = this.container.height - this.oceanBed.height;
    this.oceanBed.animationSpeed = 0.2;
    this.oceanBed.play();
    this.container.addChild(this.oceanBed);
  }

  private createReefs() {
    
    Reefs.forEach((reef: any, index) => {
      let img: any = Functions.getSprite(this.app.loader, reef);

      img.animationSpeed = 0.2;
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