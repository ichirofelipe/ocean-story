import * as PIXI from 'pixi.js';
import Block from './Block';
import {Reel as ReelValues, Columns, Rows, ActualRows} from '../../tools/settings.json';
import Globals from '../../tools/globals.json';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Reel {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public blocks: Array<number> = [];
  private reelIndex: number;
  private reelBlocks: Array<Block> = [];
  private reelSpeed: number = 25; //spin velocity
  public reelOffset: number = 10; //block spacing
  private spinTicker: PIXI.Ticker;
  private spinDuration: number = 1; //seconds
  private spinStart: number;
  private spinBounce: number = 0.2; //seconds
  private spinSuccessionDelay: number = 0.3; //seconds

  constructor(app: PIXI.Application, blocks: Array<number>, reelIndex: number ) {
    this.app = app;
    this.blocks = blocks;
    this.reelIndex = reelIndex;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createBlocks();
    this.createMask();
  }

  private createBlocks() {
    this.blocks.forEach((block, index) => {
      const reelBlock = new Block(this.app, block);
      reelBlock.container.y = (reelBlock.size + this.reelOffset) * index;

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

  public startSpin() {
    this.spinTicker = new PIXI.Ticker();
    this.spinTicker.add(this.spinner.bind(this));
    
    this.reelBlocks.forEach(block => {
      gsap.to(block.container, {
        y: block.container.y - 30,
        duration: this.spinBounce,
        repeat: 1,
        yoyo: true,
        delay: this.spinSuccessionDelay * (this.reelIndex + 1),
        onComplete: () => {
          this.spinTicker.start();
          this.spinStart = Date.now() + (this.spinDuration*1000) + this.prolongSpin();
        }
      })
    })
    
  }

  private prolongSpin() {
    if(Globals.slowSpinStart == -1)
      return 0;
    return 1500 * ((this.reelIndex - Globals.slowSpinStart) + 1);
  }

  private spinner() {
    let reelSpeed = this.reelSpeed;

    this.reelBlocks.forEach((block, index) => {

      const reelHeight = (block.size + this.reelOffset) * this.reelBlocks.length;
      let blockPace = block.container.y + reelSpeed;
      let conHeight = reelHeight + this.reelOffset;
      let heightDiff = blockPace - conHeight;
      
      if(heightDiff >= 0){
        reelSpeed = heightDiff;
        block.container.y = reelSpeed;
        
        // RANDOMIZE BLOCKS WITHIN SPECIFIED TIMER BEFORE SETTING UP GENERATED RESULTS
        if(Date.now() > this.spinStart - ((this.spinBounce*1000)*this.reelIndex)){
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

    this.reelBlocks.forEach((block, index) => {
      let bounceForce = 50;
      if(index == 0)
        bounceForce-=25;

      gsap.to(block.container, {
        y: block.container.y + bounceForce,
        duration: this.spinBounce,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          if(this.reelIndex == Columns - 1)
            Globals.isSpinning = false
        }
      })
    })
  }

  private createMask() {
    const {width, height} = this.container;
    const posX = (this.reelBlocks[0].size * (Rows - ActualRows)) / 2;
    const heightDiff = this.reelBlocks[0].size * (Rows - ActualRows);

    let mask = new PIXI.Graphics();
    mask.beginFill(0x000000)
    .drawRect(0, posX, width, height - heightDiff)
    .endFill();

    this.container.addChild(mask);
    this.container.mask = mask;
  }
}