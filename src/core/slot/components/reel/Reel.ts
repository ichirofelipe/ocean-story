import * as PIXI from 'pixi.js';
import Block from './Block';
import {Reel as ReelValues, Columns, Rows, ActualRows, ReelOffsetX, ReelOffsetY, ReelEffects} from '../../tools/settings.json';
import Globals from '../../tools/globals.json';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Functions from '../../../Functions';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Reel {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public reelEffectContainer: PIXI.Container;
  public blocks: Array<number> = [];
  private reelIndex: number;
  public reelBlocks: Array<Block> = [];
  private reelSpeed: number = 25; //spin velocity
  public reelOffsetX: number = ReelOffsetX; //block spacing
  public reelOffsetY: number = ReelOffsetY; //block spacing
  private reelMask: PIXI.Sprite;
  private reelMask2: PIXI.Graphics;
  private spinTicker: PIXI.Ticker;
  private spinDuration: number = 2; //seconds
  private spinStart: number;
  private spinBounce: number = 0.2; //seconds
  private spinSuccessionDelay: number = 0.3; //seconds
  public reelEffects: Array<any> = [];
  private reelEffectsFlag: boolean = false;
  private reelStopped: () => void;

  constructor(app: PIXI.Application, blocks: Array<number>, reelIndex: number) {
    this.app = app;
    this.blocks = blocks;
    this.reelIndex = reelIndex;
    this.container = new PIXI.Container;
    this.reelEffectContainer = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createBlocks();
    this.createMask();
    this.createReelEffect();
  }

  private createBlocks() {
    this.blocks.forEach((block, index) => {
      const reelBlock = new Block(this.app, block);

      reelBlock.container.y = (reelBlock.size + this.reelOffsetY) * index;

      this.reelBlocks.push(reelBlock);
      this.container.addChild(reelBlock.container)
    })

    this.container.y = - this.reelBlocks[0].size;
  }

  private blockRandomizer(block: Block, index: number) {
    let randNum = ReelValues[index][Math.floor(Math.random() * ReelValues[index].length)];
    block.value = randNum;
    block.updateValue();
  }

  public startSpin(reelStopped: () => void) {
    this.spinTicker = new PIXI.Ticker();
    this.spinTicker.add(this.spinner.bind(this));
    this.reelStopped = reelStopped;

    const readySpin = gsap.to(this.container, {
      y: this.container.y - 25,
      duration: this.spinBounce,
      repeat: 1,
      yoyo: true,
      delay: this.spinSuccessionDelay * (this.reelIndex + 1),
      onComplete: () => {
        this.toggleMask(true);
        this.spinTicker.start();
        this.spinStart = Date.now() + (this.spinDuration*1000) + this.prolongSpin();

        readySpin.kill();
        return;
      }
    })
    
  }

  private prolongSpin() {
    if(Globals.slowSpinStart == -1)
      return 0;
    if(this.reelIndex < Globals.slowSpinStart)
      return 0;
    return 2000 * ((this.reelIndex - Globals.slowSpinStart) + 1);
  }

  private spinner() {
    let reelSpeed = this.reelSpeed;

    if(this.prolongSpin() > 0 && (Date.now() - (this.spinStart - 2000)) > 0 && !this.reelEffectsFlag){
      this.showReelEffects();
    }

    this.reelBlocks.forEach((block, index) => {

      const reelHeight = (block.size + this.reelOffsetY) * this.reelBlocks.length;
      let blockPace = block.container.y + reelSpeed;
      let conHeight = reelHeight + this.reelOffsetY;
      let heightDiff = blockPace - conHeight;
      
      if(heightDiff >= 0){
        reelSpeed = heightDiff;
        block.container.y = reelSpeed;
        
        // RANDOMIZE BLOCKS WITHIN SPECIFIED TIMER BEFORE SETTING UP GENERATED RESULTS
        if(Date.now() > this.spinStart - (this.spinBounce*2000)){
          block.value = this.blocks[index];
          block.updateValue();
        }else{
          this.blockRandomizer(block, index);
        }
      }
      else{
        block.container.y += this.reelSpeed;
      }
      
      if(index === 0 && Date.now() > this.spinStart && heightDiff == 0)
        this.doneSpin();
      
    })
  }

  private doneSpin() {
    this.spinTicker.stop();
    let bounceForce = 20;
    this.toggleMask(false);

    if(!this.reelEffectsFlag){

      const bounce = gsap.to(this.container, {
        y: this.container.y + bounceForce,
        duration: this.spinBounce,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          this.hideReelEffects();
          if(this.reelIndex == Columns - 1){
            this.reelStopped();
          }

          bounce.kill();
        }
      })

    } else{
      const bounce = gsap.to(this.container, {
        y: this.container.y + 15,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
        ease: 'power.in',
        onComplete: () => {
          this.hideReelEffects();
          if(this.reelIndex == Columns - 1){
            this.reelStopped();
          }

          bounce.kill();
        }
      })

      const stageShock = gsap.to(this.app.stage, {
        y: this.app.stage.y + 15,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
        ease: 'power.in',
        onComplete: () => {
          stageShock.kill();
        }
      })

    }
  }

  private createMask() {
    //GRAPHICS MASK
    const sizeAdjustment = ((this.reelBlocks[0].size * (this.reelBlocks[0].overlapPixels - 1)) / 2);
    const posY = ((this.reelBlocks[0].size * (Rows - ActualRows)) / 2);
    const height = (this.reelBlocks[0].size * ActualRows);
    const width = this.reelBlocks[0].size * this.reelBlocks[0].overlapPixels;

    this.reelMask2 = new PIXI.Graphics();
    this.reelMask2.beginFill(0x000000)
    .drawRect(0, posY , width * this.reelBlocks[0].overlapPixels, height)
    .endFill();
    this.reelMask2.x -= sizeAdjustment;
    this.reelMask2.y += sizeAdjustment;

    //SPRITE MASK
    const maskTexture = this.app.loader.resources!.slot.textures!['mask.png'];
    this.reelMask = new PIXI.Sprite(maskTexture);
    this.reelMask.x = -0.5 - ((this.reelBlocks[0].size - this.reelOffsetX) * this.reelIndex) + (1.5 * this.reelIndex);
    this.reelMask.y = ((this.reelBlocks[0].size * this.reelBlocks[0].overlapPixels)/2) + 15;
    this.reelMask.width = this.app.screen.width + 3;
    this.reelMask.height = (this.reelBlocks[0].size * this.reelBlocks[0].overlapPixels)*3;
    this.reelMask.alpha = 0;

    this.container.addChild(this.reelMask2);
    this.container.addChild(this.reelMask);
    this.container.mask = this.reelMask2;
    
    // mask.alpha = 0.15*(this.reelIndex + 1);
  }

  private toggleMask(active: boolean = true) {
    if(active){
      this.reelMask.alpha = 1;
      this.reelMask2.alpha = 0;
      this.container.mask = null;
      this.container.mask = this.reelMask;
    } else {
      this.reelMask.alpha = 0;
      this.reelMask2.alpha = 1;
      this.container.mask = null;
      this.container.mask = this.reelMask2;
    }
  }

  private createReelEffect() {
    ReelEffects.forEach(effect => {
      let reelEffect = Functions.getSprite(this.app.loader, effect);
      reelEffect.height = this.reelBlocks[0].size * ActualRows - 5;
      reelEffect.width = this.reelBlocks[0].size * this.reelBlocks[0].overlapPixels;
      reelEffect.y = 15;
      reelEffect.alpha = 0.01;

      this.reelEffects.push(reelEffect);
    })
    
    Functions.toggleAnimations(this.reelEffects, true);
    
  }
  
  public showReelEffects() {
    this.reelEffectsFlag = true;
    
    this.reelEffects.forEach(effect => {
      const showAnimate = gsap.to(effect, {
        alpha: 1,
        duration: 0.5,
        onStart: () => {
          effect.play();
        },
        onComplete: () => {
          showAnimate.kill();
        }
      })
    })
  }

  public hideReelEffects() {
    this.reelEffectsFlag = false;

    this.reelEffects.forEach(effect => {
      const hideAnimate = gsap.to(effect, {
        alpha: 0.01,
        duration: 0.5,
        onComplete: () => {
          effect.gotoAndStop(0);
          hideAnimate.kill();
        }
      })
    })
  }
}