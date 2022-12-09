import * as PIXI from 'pixi.js';
import Block from './Block';
import {Reel as ReelValues, Columns, Rows, ActualRows, ReelOffsetX, ReelOffsetY, ReelEffects} from '../../tools/settings.json';
import Globals from '../../tools/globals.json';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Helpers from '../../tools/Helpers';
import { AnimatedSprite, settings } from 'pixi.js';
import { clear } from 'console';
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
  private reelMask: PIXI.Graphics;
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

    gsap.to(this.container, {
      y: this.container.y - 25,
      duration: this.spinBounce,
      repeat: 1,
      yoyo: true,
      delay: this.spinSuccessionDelay * (this.reelIndex + 1),
      onComplete: () => {
        this.spinTicker.start();
        this.spinStart = Date.now() + (this.spinDuration*1000) + this.prolongSpin();
        this.activateMask(true);
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

    gsap.to(this.container, {
      y: this.container.y + bounceForce,
      duration: this.spinBounce,
      repeat: 1,
      yoyo: true,
      onComplete: () => {
        this.activateMask(false);
        this.hideReelEffects();
        if(this.reelIndex == Columns - 1){
          this.reelStopped();
        }
      }
    })
  }

  private createMask() {
    const sizeAdjustment = ((this.reelBlocks[0].size * (this.reelBlocks[0].overlapPixels - 1)) / 2);
    const posY = ((this.reelBlocks[0].size * (Rows - ActualRows)) / 2);
    const height = (this.reelBlocks[0].size * ActualRows);
    const width = this.reelBlocks[0].size * this.reelBlocks[0].overlapPixels;

    this.reelMask = new PIXI.Graphics();
    this.reelMask.beginFill(0x000000)
    .drawRect(0, posY - 3, width * this.reelBlocks[0].overlapPixels, height)
    .endFill();
    this.reelMask.alpha = (this.reelIndex + 1)*0.15;
    this.reelMask.x -= sizeAdjustment;
    this.reelMask.y += sizeAdjustment;

    this.container.addChild(this.reelMask);
    this.container.mask = this.reelMask;
  }

  private activateMask(active: boolean) {
    const sizeAdjustment = 10;

    if(this.reelMask === undefined)
      return;
    if(active){
      this.reelMask.y += sizeAdjustment;
      this.reelMask.height -= sizeAdjustment;
    } else{
      this.reelMask.y -= sizeAdjustment;
      this.reelMask.height += sizeAdjustment;
    }
  }

  private createReelEffect() {
    ReelEffects.forEach(effect => {
      let reelEffect = Functions.getSprite(this.app.loader, effect);
      reelEffect.height = this.reelBlocks[0].size * ActualRows;
      reelEffect.width = this.reelBlocks[0].size * this.reelBlocks[0].overlapPixels;
      reelEffect.y = this.reelMask.y;
      reelEffect.alpha = 0.01;

      this.reelEffects.push(reelEffect);
    })
    
    Functions.toggleAnimations(this.reelEffects, true);
    
  }
  
  public showReelEffects() {
    this.reelEffectsFlag = true;
    
    this.reelEffects.forEach(effect => {
      gsap.to(effect, {
        alpha: 1,
        duration: 0.5,
        onStart: () => {
          effect.play();
        }
      })
    })
  }

  public hideReelEffects() {
    this.reelEffectsFlag = false;

    this.reelEffects.forEach(effect => {
      gsap.to(effect, {
        alpha: 0.01,
        duration: 0.5,
        onComplete: () => {
          effect.gotoAndStop(0);
        }
      })
    })
  }
}