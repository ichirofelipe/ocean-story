import * as PIXI from 'pixi.js';
import Reel from './Reel';
import Globals from '../../tools/globals.json';
import {ActualRows, Columns} from '../../tools/settings.json';
import { Graphics } from 'pixi.js';

export default class ReelsContainer {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private reel: Reel;
  public reels: Array<Reel> = [];
  public reelsArray: Array<Array<number>>;
  private mask: PIXI.Graphics;

  constructor(app: PIXI.Application, reelsArray: Array<Array<number>>){
    this.app = app;
    this.reelsArray = reelsArray;
    this.container = new PIXI.Container;

    this.init();
  }

  private init() {
    this.createReels();
  }

  private createReels() {
    this.reelsArray.forEach((reel, index) => {
      this.reel = new Reel(this.app, reel, index);
      this.reel.container.x = ((this.reel.reelBlocks[0].size - ((this.reel.reelBlocks[0].sizeAdjustment/2))) + this.reel.reelOffsetX) * index;

      this.reels.push(this.reel);
      this.container.addChild(this.reel.container);
    })
  }

  public spinReels(doneSpin: () => void) {
    // CHECK FOR BONUS ANIMATION
    this.slowSpinValidation();
    this.reels.forEach((reel, index) => {
      reel.blocks = this.reelsArray[index];
      reel.startSpin( () => {
        doneSpin()
      });
    })
  }

  private slowSpinValidation() {
    let blockToCheck = 4; // DEFAULT IS BONUS BLOCK
    let blockCount = 0;

    // SET TO DEFAULT VALUE
    Globals.slowSpinStart = -1;

    // CHECK FOR BLOCK COUNT TO ANIMATE SLOW MO SPIN
    this.reelsArray.forEach((reel, reelIndex) => {
      const blockArray = reel.filter((block, index) => {
        if(block == blockToCheck && index != 0 && index != this.reelsArray.length - 1)
          return block
      })
      if(blockCount > 1 && Globals.slowSpinStart == -1)
        Globals.slowSpinStart = reelIndex;
      if(blockArray!.length > 0)
        blockCount++;
    })
    
  }
}