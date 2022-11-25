import * as PIXI from 'pixi.js';
import SlotFunctions from './tools/SlotFunctions';
import Globals from './tools/globals.json';
import ReelsContainer from './components/reel/ReelsContainer';
import {ReelOffsetX, ReelOffsetY} from './tools/settings.json';
import Helpers from './tools/Helpers';

export default class Slot {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private slotFunctions: SlotFunctions;
  private bet: number = 100;
  private readonly RTP: number = 1;
  private reelsContainer: ReelsContainer;
  private background: PIXI.Sprite;
  private logo: PIXI.Sprite;
  private frameHeightAdjustment: number = 70;
  private frameWidthAdjustment: number = 10;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;
    this.slotFunctions = new SlotFunctions(this.bet, this.RTP);

    this.init();
  }

  private init() {
    this.settings();
    this.createGenerateEvent();
    this.createReelsContainer();
    this.createBackground();
    this.createLogo();
  }

  private settings() {
    this.container.sortableChildren = true;
  }

  private createGenerateEvent() {
    window.addEventListener('keypress', e => this.getResult(e))
  }

  private createReelsContainer() {
    let initReelsArray = this.slotFunctions.generateResult();
    this.reelsContainer = new ReelsContainer(this.app, initReelsArray);
    this.reelsContainer.container.x = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.y = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.zIndex = 1;

    this.container.addChild(this.reelsContainer.container);
  }

  private createBackground() {
    const texture = this.app.loader.resources!.slot.textures!['reels.png'];
    this.background = new PIXI.Sprite(texture);
    this.background.x = ReelOffsetX/2 - (this.frameWidthAdjustment/2);
    this.background.y = (ReelOffsetY/2) - (this.frameHeightAdjustment/2.5);
    this.background.width = this.app.screen.width - ReelOffsetX + this.frameWidthAdjustment;
    this.background.height = this.container.height + (ReelOffsetY*3) + this.frameHeightAdjustment;
    this.background.zIndex = 0;

    this.container.addChild(this.background);
  }

  private getResult(e: any) {
    if(e.keyCode != 13 || Globals.isSpinning)
      return;

    // Globals.isSpinning = true;
    // const result = this.slotFunctions.generateResult();
    // this.reelsContainer.reelsArray = result;
    // this.reelsContainer.spinReels();
    this.slotFunctions.testResult()
  }

  private createLogo() {
    const texture = this.app.loader.resources!.slot.textures!['logo.png'];
    this.logo = new PIXI.Sprite(texture);
    const width = this.logo.width;
    this.logo.height = Helpers.autoHeight(this.logo, (width*0.4))
    this.logo.width = (width*0.4);
    this.logo.x = (this.app.screen.width - (this.logo.width/2)) - 30;
    this.logo.y = -((this.logo.height) - 90);
    
    this.background.addChild(this.logo);
  }
}