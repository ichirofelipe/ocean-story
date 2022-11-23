import * as PIXI from 'pixi.js';
import SlotFunctions from './tools/SlotFunctions';
import Globals from './tools/globals.json';
import ReelsContainer from './components/reel/ReelsContainer';
import Reel from './components/reel/Reel';

export default class Slot {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private slotFunctions: SlotFunctions;
  private bet: number = 50;
  private readonly RTP: number = 0.9333;
  private reelsContainer: ReelsContainer;
  private reel: Reel;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;
    this.slotFunctions = new SlotFunctions(this.bet, this.RTP);

    this.init();
  }

  private init() {
    // this.createScene();
    this.createGenerateEvent();
    this.createReelsContainer();
  }
  
  private createScene() {
    const scene = new PIXI.Graphics();
    scene.beginFill(0x000000)
    .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
    .endFill();

    this.container.addChild(scene);
  }

  private createGenerateEvent() {
    window.addEventListener('keypress', e => this.getResult(e))
  }

  private createReelsContainer() {
    let initReelsArray = this.slotFunctions.generateResult();
    this.reelsContainer = new ReelsContainer(this.app, initReelsArray);
    this.reelsContainer.container.x = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.y = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);

    this.container.addChild(this.reelsContainer.container);
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