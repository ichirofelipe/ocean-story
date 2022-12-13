import * as PIXI from 'pixi.js';
import TestFunctions from './tools/TestFunctions';
import Functions from './tools/Functions';
import Globals from './tools/globals.json';
import ReelsContainer from './components/reel/ReelsContainer';
import {ReelOffsetX, ReelOffsetY, Pattern} from './tools/settings.json';
import Helpers from './tools/Helpers';

export default class Slot {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private testFunctions: TestFunctions;
  private functions: Functions;
  public bet: number = 1;
  public RTP: number = 1;
  private reelsContainer: ReelsContainer;
  private background: PIXI.Sprite;
  private frame: PIXI.Sprite;
  private mask: PIXI.Sprite;
  private logo: PIXI.Sprite;
  private frameHeightAdjustment: number = 60;
  private frameWidthAdjustment: number = 10;
  public symbolsToAnimate: Array<PIXI.AnimatedSprite> = [];
  public bonusCount: number = 0;

  constructor(app: PIXI.Application, bet: number, RTP: number) {
    this.app = app;
    this.container = new PIXI.Container;
    this.bet = bet;
    this.RTP = RTP;
    this.testFunctions = new TestFunctions(this.bet, this.RTP);
    this.functions = new Functions(this.bet, this.RTP);

    this.init();
  }

  private init() {
    this.settings();
    this.createGenerateEvent();
    this.createReelsContainer();
    this.createBackground();
    this.createFrame();
    this.createLogo();
    // this.createMask();
  }

  public updateFunctions(){
    this.testFunctions = new TestFunctions(this.bet, this.RTP);
    this.functions = new Functions(this.bet, this.RTP);
  }

  private settings() {
    this.container.sortableChildren = true;
  }

  private createGenerateEvent() {
    window.addEventListener('keypress', e => this.testResult(e))
  }

  private createReelsContainer() {
    let initReelsArray = this.functions.generateResult();
    this.reelsContainer = new ReelsContainer(this.app, initReelsArray);
    this.reelsContainer.container.x = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.y = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.zIndex = 1;

    this.container.addChild(this.reelsContainer.container);
  }

  private createBackground() {
    const texture = this.app.loader.resources!.slot.textures!['reel_bg.png'];
    this.background = new PIXI.Sprite(texture);
    this.background.x = ReelOffsetX/2 - (this.frameWidthAdjustment/2);
    this.background.y = (ReelOffsetY/2) - (this.frameHeightAdjustment/2);
    this.background.width = ((this.reelsContainer.reels[0].reelBlocks[0].size * this.reelsContainer.reels[0].reelBlocks[0].overlapPixels)*4) + this.frameWidthAdjustment;
    this.background.height = ((this.reelsContainer.reels[0].reelBlocks[0].size * this.reelsContainer.reels[0].reelBlocks[0].overlapPixels)*3);
    this.background.zIndex = 0;

    this.container.addChild(this.background);
  }

  private createFrame() {
    const texture = this.app.loader.resources!.slot.textures!['reel_frame.png'];
    this.frame = new PIXI.Sprite(texture);
    this.frame.x = ReelOffsetX/2 - (this.frameWidthAdjustment/2);
    this.frame.y = (ReelOffsetY/2) - (this.frameHeightAdjustment/2);
    this.frame.width = this.app.screen.width - ReelOffsetX + this.frameWidthAdjustment;
    this.frame.height = this.background.height;
    this.frame.zIndex = 0;

    this.container.addChild(this.frame);
  }

  private createMask() {
    const maskTexture = this.app.loader.resources!.slot.textures!['mask.png'];
    this.mask = new PIXI.Sprite(maskTexture);
    this.mask.x = ReelOffsetX/2 - (this.frameWidthAdjustment/2) - 4;
    this.mask.y = (ReelOffsetY/2) - (this.frameHeightAdjustment/2) + 5;
    this.mask.width = this.app.screen.width - ReelOffsetX + this.frameWidthAdjustment;
    this.mask.height = this.background.height;
    this.reelsContainer.container.addChild(this.mask);
  }

  public moveMask() {
    console.log('move mask');
  }

  private testResult(e: any) {
    if(e.keyCode != 13 || Globals.isSpinning)
      return;

    this.testFunctions.testResult()
  }

  public getResult(winnings: (win: number) => void) {
    const result = this.functions.generateResult();
    const formattedResult = this.functions.formatResult(result);
    const win = this.functions.getTotalWin(formattedResult);
    
    this.bonusCount = 0;
    this.getSymbolsToAnimate(formattedResult);
    this.reelsContainer.reelsArray = result;

    this.reelsContainer.spinReels(() => {
      winnings(win);
    });
  }

  public getBonusPayout(bonusCount: number) {
    return this.functions.computeBonusPayOut(bonusCount);
  }

  private getSymbolsToAnimate(result: Array<any>) {
    this.symbolsToAnimate = [];
    
    result.forEach(res => {
      if(res.index == -1){
        this.bonusCount = res.colCount;
        res.combination.forEach((pat:string) => {
          let reelIndex = Number(pat.split('-')[0]);
          let value = Number(pat.split('-')[1]);

          this.symbolsToAnimate.push(this.reelsContainer.reels[reelIndex].reelBlocks[value].symbolSprite);
        })
      }
      else{
        Pattern[res.index].forEach((value, reelIndex) => {
          if(reelIndex < res.colCount)
            this.symbolsToAnimate.push(this.reelsContainer.reels[reelIndex].reelBlocks[value].symbolSprite);
        })
      }
    })
  }

  private createLogo() {
    const texture = this.app.loader.resources!.slot.textures!['logo.png'];
    this.logo = new PIXI.Sprite(texture);
    this.logo.height = Helpers.autoHeight(this.logo, 400)
    this.logo.width = 400;
    this.logo.x = (this.app.screen.width + ReelOffsetX + this.frameWidthAdjustment) / 2;
    this.logo.y = -(this.logo.height - 100);
    this.logo.zIndex = 1;
    
    this.frame.addChild(this.logo);
  }
}