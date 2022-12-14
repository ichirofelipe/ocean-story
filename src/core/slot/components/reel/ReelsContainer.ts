import * as PIXI from 'pixi.js';
import Reel from './Reel';
import Globals from '../../tools/globals.json';
import {BonusNumber} from '../../tools/settings.json';

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
      this.reel.reelEffects[0].x = this.reel.container.x;
      this.reel.reelEffects[1].x = this.reel.container.x;
      this.reels.push(this.reel);
      this.container.addChild(this.reel.reelEffects[0]);
      this.container.addChild(this.reel.container);
      this.container.addChild(this.reel.reelEffects[1]);
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
    let blockCount = 0;

    // SET TO DEFAULT VALUE
    Globals.slowSpinStart = -1;

    // CHECK FOR BLOCK COUNT TO ANIMATE SLOW MO SPIN
    this.reelsArray.forEach((reel, reelIndex) => {
      const blockArray = reel.filter((block, index) => {
        if(block == BonusNumber && index != 0 && index != this.reelsArray.length - 1)
          return block
      })
      if(blockCount >= 2 && Globals.slowSpinStart == -1)
        Globals.slowSpinStart = reelIndex;
      if(blockArray!.length > 0)
        blockCount++;
    })
    
  }
}