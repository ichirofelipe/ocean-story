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

  // CREATE ALL REELS WITH CORRESPONDING BLOCK VALUES
  private createReels() {
    this.reelsArray.forEach((reel, index) => {
      this.reel = new Reel(this.app, reel, index);
      this.reel.container.x = ((this.reel.reelBlocks[0].size - ((this.reel.reelBlocks[0].sizeAdjustment/2))) + this.reel.reelOffsetX) * index;
      this.reel.reelEffects[0].x = this.reel.container.x;
      this.reel.reelEffects[1].x = this.reel.container.x;
      this.reels.push(this.reel);

      this.container.addChild(this.reel.reelEffects[0]);              // ADD THE REEL EFFECT (BACKGROUND)
      this.container.addChild(this.reel.container);                   // ADD THE REEL CONTAINER
      this.container.addChild(this.reel.reelEffects[1]);              // ADD THE REEL SECOND EFFECTS (BORDER)
    })
  }

  // FUNCTION TO SPIN REELS OUT THE REEL.TS
  public spinReels(doneSpin: () => void) {

    // CHECK FOR BONUS ANIMATION (IF BONUS IS TRUE THEN PROLONG THE SPIN FOR EACH PEDING REEL)
    this.slowSpinValidation();  

    const spinTicker = new PIXI.Ticker();
    
    spinTicker.add(delta => {
      this.reels.forEach((reel, index) => {
        reel.blocks = this.reelsArray[index];
        
        if(reel.reelSpinFlag == -1){
          reel.startSpin( () => {
            doneSpin()
            spinTicker.destroy();
            this.reels.forEach(reel => reel.reelSpinFlag = -1);
          });
        } else if(reel.reelSpinFlag == 1) {
          reel.spinner();
        }
  
      })
    })
    
    spinTicker.start();
  }

  // VALIDATE RESULTS TO CHECK IF BONUS PATTERN IS SATISFIED
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