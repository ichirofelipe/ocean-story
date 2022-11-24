import * as PIXI from 'pixi.js';
import Loader from './components/Loader';
import Plinko from './plinko/Plinko';
import Slot from './slot/Slot';
import Home from './components/Home';
import Scene from './components/Scene';
import Functions from './Functions';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Game {
  private baseWidth: number = 960;
  private baseHeight: number = 540;
  private animationSpeed: number = 3.5; // animation speed (dive, rise)
  private sceneContainer: PIXI.Container;
  private mainContainer: PIXI.Container;
  private homeContainer: PIXI.Container;
  private gameContainer: PIXI.Container;
  private main: PIXI.Application;
  private plinko: PIXI.Application;
  private slot: PIXI.Application;
  private home: Home;
  private scene: Scene;
  private diveGroupAnimation: Array<object> = []; 
  private riseGroupAnimation: Array<object> = []; 

  constructor() {
    this.setSettings();
    this.setRenderer();

    new Loader(this.main, this.init.bind(this));
  }

  private init() {
    this.setContainers(); 
    this.createScene();
    this.createHome();
    this.createPlinko();
    this.createSlot();
    this.setObjAnimation();

    this.startGame();
  }

  private setSettings() {
    PIXI.settings.ROUND_PIXELS = true;
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
    PIXI.settings.RESOLUTION = 2;

    this.sceneContainer = new PIXI.Container;
    this.gameContainer = new PIXI.Container;
    this.homeContainer = new PIXI.Container;
    this.mainContainer = new PIXI.Container;
  }  

  private setRenderer() {
    this.main = new PIXI.Application({ width: this.baseWidth, height: this.baseHeight, autoDensity: true });
    window.document.body.appendChild(this.main.view)
  }

  private setContainers (){
    this.gameContainer.y = this.baseHeight*2;
  }

  private createScene() {
    this.scene = new Scene(this.main);
    this.sceneContainer.addChild(this.scene.container);
  }

  private createHome() {
    this.home = new Home(this.main, this.dive.bind(this));
    this.homeContainer.addChild(this.home.container);
  }

  private createPlinko() {
    this.plinko = new PIXI.Application({ width: this.baseWidth/2, height: this.baseHeight });
    const plinko = new Plinko(this.plinko,this.main.loader);
    this.plinko.stage.addChild(plinko.container);
    this.plinko.stage.addChild(plinko.container2);
    this.gameContainer.addChild(this.plinko.stage);
  }

  private createSlot() {
    this.slot = new PIXI.Application({ width: this.baseWidth/2, height: this.baseHeight });
    this.slot.loader = this.main.loader;
    const slot = new Slot(this.slot);
    this.slot.stage.addChild(slot.container);
    this.slot.stage.x = this.baseWidth/2;
    this.slot.stage.y = 140;
    this.gameContainer.addChild(this.slot.stage);
  }

  private setObjAnimation() {
    this.diveGroupAnimation = Functions.objGroupAnimation(
      [
        {sprite: this.sceneContainer, destination: -((this.sceneContainer.height/3)*2)},
        {sprite: this.gameContainer, destination: 0},
        {sprite: this.homeContainer, destination: -this.baseHeight*2}
      ]
    )
    this.riseGroupAnimation = Functions.objGroupAnimation(
      [
        {sprite: this.sceneContainer, destination: 0},
        {sprite: this.gameContainer, destination: this.baseHeight*2},
        {sprite: this.homeContainer, destination: 0}
      ]
    )
    this.dive();
  }

  private startGame() {
    this.mainContainer.addChild(this.sceneContainer);
    this.mainContainer.addChild(this.homeContainer);
    this.mainContainer.addChild(this.gameContainer);

    this.main.stage.addChild(this.mainContainer)
  }





  private dive() {
    this.scene.bubbleAnimate();

    this.diveGroupAnimation.forEach((element: any) => {
      const {sprite, destination} = element;

      gsap.to(sprite, {
        y: destination,
        duration: 0
      })
    })
  }

  private rise() {
    this.riseGroupAnimation.forEach((element: any) => {
      const {sprite, destination} = element;

      gsap.to(sprite, {
        y: destination,
        duration: this.animationSpeed
      })
    })
  }

}