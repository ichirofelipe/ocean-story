import * as PIXI from 'pixi.js';
import Loader from './components/Loader';
import Plinko from './plinko/Plinko';
import Slot from './slot/Slot';
import Home from './components/layouts/Home';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Game {
  private baseWidth: number = 960;
  private baseHeight: number = 540;
  private animationSpeed: number = 2; // animation speed (dive, rise)
  private gameContainer: PIXI.Container;
  private main: PIXI.Application;
  private plinko: PIXI.Application;
  private slot: PIXI.Application;
  private home: Home;

  constructor() {
    this.gameContainer = new PIXI.Container;
    this.main = new PIXI.Application({ width: this.baseWidth, height: this.baseHeight });
    window.document.body.appendChild(this.main.view);
    new Loader(this.main, this.init.bind(this));
  }

  private init() {
    this.setContainers();
    this.createHome();
    this.createPlinko();
    this.createSlot();


    this.startGame();
  }

  private setContainers (){
    this.gameContainer.y = this.baseHeight;
  }

  private createHome() {
    this.home = new Home(this.main);
    this.dive();
    this.main.stage.addChild(this.home.container);
  }

  private createPlinko() {
    this.plinko = new PIXI.Application({ width: this.baseWidth/2, height: this.baseHeight });
    const plinko = new Plinko(this.plinko);
    this.plinko.stage.addChild(plinko.container);
  }

  private createSlot() {
    this.slot = new PIXI.Application({ width: this.baseWidth/2, height: this.baseHeight });
    this.slot.loader = this.main.loader;
    const slot = new Slot(this.slot);
    this.slot.stage.addChild(slot.container);
    this.slot.stage.x = this.baseWidth/2;
  }

  private startGame() {
    this.gameContainer.addChild(this.plinko.stage);
    this.gameContainer.addChild(this.slot.stage);

    this.main.stage.addChild(this.gameContainer);
  }

  private dive() {
    gsap.to(this.home.bgSprite, {
      y: -(this.home.bgSprite.height/2),
      duration: this.animationSpeed,
      delay: 1,
    })
    gsap.to(this.gameContainer, {
      y: 0,
      duration: this.animationSpeed,
      delay: 1,
    })
  }

  private rise() {
    gsap.to(this.home.bgSprite, {
      y: 0,
      duration: this.animationSpeed,
    })

    gsap.to(this.gameContainer, {
      y: this.baseHeight,
      duration: this.animationSpeed,
    })
  }

}