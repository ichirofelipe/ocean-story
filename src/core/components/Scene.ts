import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {Reefs, LoopingBubbles, Trees, Clouds, Gabi, Grass, Chest, Birds} from './sceneSettings.json';
import Functions from '../Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ReflectionFilter } from 'pixi-filters';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Scene {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public homeScene: PIXI.Container;
  public OceanBedContainer: PIXI.Container;
  public bgSprite: PIXI.Sprite;
  private bubbles: Array<PIXI.Sprite> = [];
  private oceanBed: PIXI.AnimatedSprite;
  public lightRay: PIXI.AnimatedSprite;
  private mainContainer: PIXI.Container;
  public sceneHeightAdjusment: number = 0;

  constructor(app: PIXI.Application, mainContainer: PIXI.Container) {
    this.app = app;
    this.container = new PIXI.Container;
    this.homeScene = new PIXI.Container;
    this.OceanBedContainer = new PIXI.Container;
    this.mainContainer = mainContainer;

    this.init();
  }

  private init() {
    this.createBG();

    this.createBirds();
    this.createClouds();
    this.createTrees();
    this.createGabi();
    this.createGrass();
    this.createChest();
    this.createWaves();

    this.createBubbles();

    this.createRays();
    this.createOceanBed();
    this.createReefs();
    this.createLoopBubbles();
  }

  private createBG() {
    const texture = this.app.loader.resources!.scene.textures!['main-bg.jpg'];
    this.bgSprite = new PIXI.Sprite(texture);
    this.bgSprite.height = Helpers.autoHeight(this.bgSprite, this.app.screen.width);
    this.bgSprite.width = this.app.screen.width;
    
    this.container.addChild(this.bgSprite);
    this.container.sortableChildren = true;
    this.homeScene.sortableChildren = true;
    this.OceanBedContainer.sortableChildren = true;
  }

  private createBirds() {
    Birds.forEach((bird:any, index) => {
      let initialPosY = Functions.randMinMax(0, 100);

      for(let count=0; count < bird.count; count++){
        let img: any = Functions.getSprite(this.app.loader, bird);
        let direction = Functions.randMinMax(-1, 1);
        let destinationX;
        //RANDOM INITIAL POSITION
        img.y = initialPosY;
        img.y += Functions.randMinMax(0, img.height * (bird.count/2));
        
        if(direction > 0){
          img.x = -img.width;
          img.x -= Functions.randMinMax(0, img.width * (bird.count/2));
          destinationX = img.x + Functions.randMinMax(400, 600)
        }
        else {
          img.x = this.app.screen.width + img.width;
          img.scale.x*=-1;
          img.x += img.width;
          img.x += Functions.randMinMax(0, img.width * (bird.count/2));

          destinationX = img.x - Functions.randMinMax(400, 600)
        }
        

        gsap.to(img, {
          x: destinationX,
          y: img.y + Functions.randMinMax(-100, 100),
          height: img.height * 0.3,
          width: img.width * 0.3,
          alpha: 0,
          duration: Functions.randMinMax(25, 45),
          repeat: -1,
          delay: Functions.randMinMax(0, 15),
          onComplete: () => {
            direction = Functions.randMinMax(-1, 1);
            if(direction > 0){
              img.x = -img.width;
              img.x -= Functions.randMinMax(0, img.width * (bird.count/2));
              destinationX = img.x + Functions.randMinMax(400, 600)
            }
            else {
              img.x = this.app.screen.width + img.width;
              img.scale.x*=-1;
              img.x += img.width;
              img.x += Functions.randMinMax(0, img.width * (bird.count/2));

              destinationX = img.x - Functions.randMinMax(400, 600)
            }
          }
        })

        this.homeScene.addChild(img);
      }
      
    })
  }

  private createClouds() {
    let cloudMaxSize = 0;
    Clouds.name.forEach(name => {
      const texture = this.app.loader.resources!.scene.textures![`${name}.png`];

      for(let count=0; count < Clouds.count; count++){
        const direction = Functions.randMinMax(-1, 1);
        const cloud = new PIXI.Sprite(texture);
        const cloudSize = Functions.randMinMax(Clouds.minHeight, Clouds.maxHeight);

        cloud.width = Helpers.autoWidth(cloud, cloudSize)
        cloud.height = cloudSize;
        cloud.y = -cloud.height;
        cloud.x = Functions.randMinMax(0, this.app.screen.width-cloud.width);
        if(cloudMaxSize < cloudSize)
          cloudMaxSize = cloudSize;
        
        let duration = Functions.randMinMax(Clouds.minDuration, Clouds.maxDuration);
        let delay = Functions.randMinMax((Clouds.minDuration/Clouds.count), (Clouds.maxDuration/Clouds.count))*count;
        let opacity = Functions.randMinMax(0.5, 0.8);
        let destinationY = Functions.randMinMax(cloud.height/2, cloud.height);
        let destinationX;

        if(direction > 0){
          destinationX = Functions.randMinMax(cloud.x - (cloud.width/2), cloud.x - (cloud.width*1.5));
        }
        else {
          destinationX = Functions.randMinMax(cloud.x + cloud.width/2, cloud.x + cloud.width*1.5);
        }
  
        this.homeScene.addChild(cloud);

        gsap.to(cloud, {
          y: destinationY,
          x: destinationX,
          height: cloud.height * 0.2,
          width: cloud.width * 0.2,
          alpha: opacity - 0.5,
          ease: 'none',
          duration: duration,
          repeat: -1,
          delay: delay
        })
      }
    })

    this.sceneHeightAdjusment += cloudMaxSize;
  }

  private createTrees() {
    
    Trees.forEach((tree:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, tree);

      img.onLoop = () => {
        img.animationSpeed = Functions.randMinMax(0.2, 0.3);
        if(Functions.randMinMax(0, 5) > 3)
          img.textures.reverse();
      }

      this.homeScene.addChild(img);
    })

  }

  private createGabi() {
    Gabi.forEach((gabiPlant:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, gabiPlant);

      img.onLoop = () => {
        img.animationSpeed = Functions.randMinMax(0.2, 0.3);
        if(Functions.randMinMax(0, 5) > 3)
          img.textures.reverse();
      }

      this.homeScene.addChild(img);
    })
  }

  private createGrass() {
    Grass.forEach((grassPlant:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, grassPlant);

      this.homeScene.addChild(img);
    })
  }

  private createChest() {
    Chest.forEach((treasureChest:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, treasureChest);

      this.homeScene.addChild(img);
    })
  }

  private createWaves() {
    const numberOfWaves = 2;
    const texture = this.app.loader.resources!.scene.textures!['waves.png'];

    let reflection = new ReflectionFilter({
      boundary: 0.8,
      amplitude: [0, 20],
      waveLength: [50, 150],
      alpha: [1, 1],
      time: 0,
      mirror: false,
    });

    const wave = new PIXI.TilingSprite(texture);
    const waveSize = 1/numberOfWaves;

    wave.height = 105;
    wave.width = this.app.screen.width * numberOfWaves;
    wave.tileScale.set(waveSize);
    wave.position.y = this.app.screen.height - 103;
    wave.position.x = - wave.width / numberOfWaves;
    gsap.to(wave, {
      x: wave.x + 25,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })

    this.homeScene.addChild(wave);

    gsap.to(reflection, {
      time: 1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })
    this.homeScene.filters = [reflection];
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

      this.OceanBedContainer.addChild(img);
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