import * as PIXI from 'pixi.js';
import Helpers from '../slot/tools/Helpers';
import {Reefs, LoopingBubbles, Trees, Clouds, Gabi, Grass, Chest, Birds, Fishes} from './sceneSettings.json';
import Functions from '../Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ReflectionFilter } from 'pixi-filters';
import { kill } from 'process';

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
  private sceneContainer: PIXI.Container;
  public sceneHeightAdjusment: number = 0;
  public homeAnimations: Array<any> = []
  public oceanBedAnimations: Array<any> = []

  constructor(app: PIXI.Application, mainContainer: PIXI.Container, sceneContainer: PIXI.Container) {
    this.app = app;
    this.container = new PIXI.Container;
    this.homeScene = new PIXI.Container;
    this.OceanBedContainer = new PIXI.Container;
    this.mainContainer = mainContainer;
    this.sceneContainer = sceneContainer;

    this.init();
  }

  private init() {
    this.createBG();

    this.createSky();
    this.createClouds();
    this.createBirds();
    this.createRocks();
    this.createSand();

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
    this.createFish();
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

  private createSky() {
    const texture = this.app.loader.resources!.scene.textures!['sky.png'];
    let img = new PIXI.Sprite(texture);
    img.height = Helpers.autoHeight(img, this.app.screen.width);
    img.width = this.app.screen.width;
    
    this.homeScene.addChild(img);
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
        

        const animation = gsap.to(img, {
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
        this.homeAnimations.push(animation, img)

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

        const animation = gsap.to(cloud, {
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
        this.homeAnimations.push(animation);
      }
    })

    this.sceneHeightAdjusment += cloudMaxSize;
  }

  private createRocks() {
    const texture = this.app.loader.resources!.scene.textures!['rocks.png'];
    let img = new PIXI.Sprite(texture);
    img.height = Helpers.autoHeight(img, this.app.screen.width);
    img.width = this.app.screen.width;
    img.y = this.app.screen.height - (img.height + 100);
    
    this.homeScene.addChild(img);
  }

  private createSand() {
    const texture = this.app.loader.resources!.scene.textures!['sand.png'];
    let img = new PIXI.Sprite(texture);
    img.height = Helpers.autoHeight(img, this.app.screen.width);
    img.width = this.app.screen.width;
    img.y = this.app.screen.height - (img.height + 100);
    
    this.homeScene.addChild(img);
  }

  private createTrees() {
    
    Trees.forEach((tree:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, tree);

      img.onLoop = () => {
        img.homeAnimationSpeed = Functions.randMinMax(0.2, 0.3);
        if(Functions.randMinMax(0, 5) > 3)
          img.textures.reverse();
      }

      this.homeAnimations.push(img);

      this.homeScene.addChild(img);
    })

  }

  private createGabi() {
    Gabi.forEach((gabiPlant:any, index) => {
      let img: any = Functions.getSprite(this.app.loader, gabiPlant);

      img.onLoop = () => {
        img.homeAnimationSpeed = Functions.randMinMax(0.2, 0.3);
        if(Functions.randMinMax(0, 5) > 3)
          img.textures.reverse();
      }
      this.homeAnimations.push(img);
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
    const animationX = gsap.to(wave, {
      x: wave.x + 25,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })

    this.homeScene.addChild(wave);

    const animationTime = gsap.to(reflection, {
      time: 1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })

    this.homeAnimations.push(animationX, animationTime);
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

      img.scale.set(0.5, 0.5);
      img.y = this.container.height - img.height - reef.bottom;
      if(reef.left !== undefined){
        img.x = reef.left;
      }
      else{
        img.x = this.app.screen.width - img.width - reef.right;
      }
      img.zIndex = reef.zIndex;

      if(reef.isAnimated)
        this.oceanBedAnimations.push(img);
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

        const animationX = gsap.to(bubble, {
          x: bubble.x - (bubble.width/Functions.randMinMax(0.5, 2)),
          duration: Functions.randMinMax(1, 2.5),
          yoyo: true,
          ease: 'none',
          repeat: -1,
        })
        const animationY = gsap.to(bubble, {
          y: bubble.y - Functions.randMinMax(loopB.minHeight, loopB.maxHeight),
          ease: 'sine.in',
          duration: Functions.randMinMax(loopB.minDuration, loopB.maxDuration),
          repeat: -1,
          delay: Functions.randMinMax(0.3, 1)*count
        })
        animationX.pause();
        animationY.pause();

        this.oceanBedAnimations.push(animationX, animationY);
      }
    })
    
  }

  private createFish() {
    Fishes.forEach((fish: any, index) => {
      
      let schoolOfFishCount = Functions.randMinMax(3, 7);
      let direction = 1;
      if(Functions.randMinMax(-1, 1) < 0)
        direction = 0

      for(let count = 0; count < schoolOfFishCount; count++){
        let img: any = Functions.getSprite(this.app.loader, fish);
        let maxX = img.width * (schoolOfFishCount/2);
        let maxY = img.height * (schoolOfFishCount/2);
        let dirX = this.app.screen.width * direction;
        
        img.scale.set(0.75);
        img.y = this.app.screen.height*2;
        img.x = - Functions.randMinMax(0, maxX);
        if(direction == 0){
          img.x = Math.abs(img.x) + this.app.screen.width;
          img.scale.x*=-1;
        }
        
        img.y += Functions.randMinMax(0, maxY);

        const fishX = gsap.to(img, {
          x: dirX,
          duration: Functions.randMinMax(8,13),
          ease: "power.in",
          repeat: -1,
        });

        const fishY = gsap.to(img, {
          y: img.y + Functions.randMinMax(0,maxY),
          duration: Functions.randMinMax(2,4),
          ease: "power.out",
          repeat: -1,
          yoyo: true,
        });
        fishX.pause();
        fishY.pause();

        this.oceanBedAnimations.push(img, fishX, fishY);
        this.OceanBedContainer.addChild(img);
      }
    });
  }

  public bubbleAnimate() {
    this.bubbles.forEach((bubble, index) => {

      const animateX = gsap.to(bubble, {
        x: Functions.randMinMax(0, this.app.screen.width),
        ease: 'none',
        duration: 40,
      })

      const animateY = gsap.to(bubble, {
        y: -bubble.height,
        alpha: 0,
        duration: (180-bubble.height)/6,
        onUpdate: () => {
          if(this.sceneContainer.y != 0 && Math.abs(this.sceneContainer.y) > (bubble.y + bubble.height)){
            this.bubbles.splice(index, 1);
            this.container.removeChild(bubble);
            let killAnimation = setTimeout(() => {
              animateX.kill();
              animateY.kill();
              clearTimeout(killAnimation);
            }, 1000);
          }
        }
      })
    })
  }

}