import * as PIXI from 'pixi.js';
import Reel from './Reel';
import Globals from '../../tools/globals.json';

export default class ReelsContainer {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private reel: Reel;
  private reels: Array<Reel> = [];
  public reelsArray: Array<Array<number>>;

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
      this.reel.container.x = (this.reel.container.width + this.reel.reelOffset) * index;

      this.reels.push(this.reel);
      this.container.addChild(this.reel.container);
    })
  }

  public spinReels() {
    // CHECK FOR BONUS ANIMATION
    this.slowSpinValidation();

    this.reels.forEach((reel, index) => {
      reel.blocks = this.reelsArray[index];
      reel.startSpin();
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