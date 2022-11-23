import * as PIXI from 'pixi.js';
import PlinkoReel from './components/PlinkoReel';
import Dropper from './components/Dropper';
import Pins from './components/Pins';

export default class Plinko{
  private app: PIXI.Application
  private reel: PlinkoReel;
  private dropper: Dropper;
  private pins: Pins;
  public container: PIXI.Container;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;

    this.init();
  }

  init() {
    // this.createScene();
    this.createReel();
    this.createPins();
    this.createDropper();
  }

  createScene() {
    const bg = new PIXI.Graphics();
    bg.beginFill(0x555555)
    .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
    .endFill();

    this.container.addChild(bg);
  }

  createReel() {
    this.reel = new PlinkoReel(this.app);
    this.container.addChild(this.reel.container);
  }

  createPins() {
    this.pins = new Pins(this.app, this.reel.height);
    this.container.addChild(this.pins.container);
  }

  createDropper() {
    this.dropper = new Dropper(this.app, this.reel, this.pins.pinsObj);
    this.container.addChild(this.dropper.container);
  }
}