import * as PIXI from 'pixi.js';
import SlotFunctions from './tools/SlotFunctions';
import Globals from './tools/globals.json';
import ReelsContainer from './components/reel/ReelsContainer';
import {ReelOffset} from './tools/settings.json';

export default class Slot {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private slotFunctions: SlotFunctions;
  private bet: number = 50;
  private readonly RTP: number = 0.9333;
  private reelsContainer: ReelsContainer;
  private background: PIXI.Sprite;

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
    this.background.x = ReelOffset/2;
    this.background.y = ReelOffset/2;
    this.background.width = this.app.screen.width - ReelOffset;
    this.background.height = this.container.height + (ReelOffset*3);
    this.background.zIndex = 0;

    this.container.addChild(this.background);
  }

  private getResult(e: any) {
    if(e.keyCode != 13 || Globals.isSpinning)
      return;

    Globals.isSpinning = true;
    const result = this.slotFunctions.generateResult();
    this.reelsContainer.reelsArray = result;
    this.reelsContainer.spinReels();
  }
}