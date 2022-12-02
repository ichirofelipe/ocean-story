import * as PIXI from 'pixi.js';
import Loader from './components/Loader';
import Plinko from './plinko/Plinko';
import Slot from './slot/Slot';
import Home from './components/Home';
import Scene from './components/Scene';
import Functions from './Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
//controllers
import ParentController from './components/Controllers/ParentController';
import Controllers from './components/Controllers';
//modal
import Modal from './components/Modal';
import ParentModal from './components/Modal/ParentModal';

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
  private controllersContainer: PIXI.Container;
  private modalContainer: PIXI.Container;
  private main: PIXI.Application;
  private plinko: PIXI.Application;
  private slot: PIXI.Application;
  private home: Home;
  private scene: Scene;
  private diveGroupAnimation: Array<object> = []; 
  private riseGroupAnimation: Array<object> = []; 
  private plinkogame: Plinko;
  private slotgame: Slot;
  private start: Boolean = false;
  private bet: number = 100;
  private money: number = 1000;
  private win: number = -1;
  private game: number = 0;
  private drop: number = 0;
  private parentcontroller: ParentController;
  private parentmodal: ParentModal;
  private modalheight: number;
  private controllerheight: number;
  private controllerposition: number;
  private controller: Controllers;
  private modal: Modal;
  private readonly betmoney: number = 100;

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

    this.sceneContainer = new PIXI.Container;
    this.gameContainer = new PIXI.Container;
    this.homeContainer = new PIXI.Container;
    this.mainContainer = new PIXI.Container;
    this.controllersContainer = new PIXI.Container;
    this.modalContainer = new PIXI.Container;
  }  
  private setRenderer() {
    this.main = new PIXI.Application({ width: this.baseWidth, height: this.baseHeight, antialias: true});
    this.main.stage.interactive = true;

    window.document.body.appendChild(this.main.view)
  }
  private setContainers (){
    this.gameContainer.y = this.baseHeight*2;
    this.mainContainer.sortableChildren = true;

    this.gameContainer.zIndex = 2;
    this.homeContainer.zIndex = 2;
  }
  private createScene() {
    this.scene = new Scene(this.main, this.mainContainer);
    this.sceneContainer.addChild(this.scene.container);
    this.sceneContainer.addChild(this.scene.homeScene);
    this.sceneContainer.addChild(this.scene.OceanBedContainer);
  }
  private createHome() {
    this.home = new Home(this.main, this.dive.bind(this));
    this.homeContainer.addChild(this.home.container);
  }
  private createPlinko() {
    this.plinko = new PIXI.Application({ width: this.baseWidth/2, height: this.baseHeight });
    this.plinkogame = new Plinko(this.plinko,this.main.loader, this.updateGamePlus.bind(this), this.updateGameMinus.bind(this), this.decMoney.bind(this),this.dropOff.bind(this),this.addMoney.bind(this));
    this.plinko.stage.addChild(this.plinkogame.container);
    this.plinko.stage.addChild(this.plinkogame.container2);
    this.gameContainer.addChild(this.plinko.stage);
  }
  private createSlot() {
    this.slot = new PIXI.Application({ width: this.baseWidth/2, height: this.baseHeight });
    this.slot.loader = this.main.loader;
    this.slotgame = new Slot(this.slot);
    this.slot.stage.addChild(this.slotgame.container);
    this.slot.stage.x = this.baseWidth/2;
    this.slot.stage.y = 120;
    this.gameContainer.addChild(this.slot.stage);
  }
  private setObjAnimation() {
    this.diveGroupAnimation = Functions.objGroupAnimation(
      [
        {sprite: this.sceneContainer, destination: -(((this.sceneContainer.height - this.scene.sceneHeightAdjusment)/3)*2)},
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
    // this.dive();
  }
  private startGame() {
    this.mainContainer.addChild(this.sceneContainer);
    this.mainContainer.addChild(this.homeContainer);
    this.mainContainer.addChild(this.gameContainer);
    this.main.stage.addChild(this.mainContainer);
    window.addEventListener('keypress', e => this.bonus(e));
    this.createControllers();
    this.createModal();
  }
  private dive() {
    
    this.home.stopBeat();
    this.scene.bubbleAnimate();

    this.diveGroupAnimation.forEach((element: any) => {
      const {sprite, destination} = element;

      gsap.to(sprite, {
        y: destination,
        duration: this.animationSpeed,
        onComplete: () => {
          this.homeContainer.removeChild(this.home.container);
          this.plinkogame.ticker.start();
          this.plinkogame.ticker2.start();
        }
      })
    }) 
    gsap.to(this.scene.lightRay, {
      alpha: 1,
      duration: this.animationSpeed
    })
  }
  private rise() {
    this.riseGroupAnimation.forEach((element: any) => {
      const {sprite, destination} = element;

      gsap.to(sprite, {
        y: destination,
        duration: 0
      })
    })
  }
  private bonus(e: any) {
    if(e.keyCode != 109)
      return;
    console.log('bonus');
    this.scene.deleteBubbles();
    this.rise();
    // this.scene.createBubbles();
    // this.scene.bubbleAnimate();
  }
  // start julius code
  private createModal(){
    //add parent modal
    this.parentmodal = new ParentModal(this.main);
    this.modalContainer.addChild(this.parentmodal.container);
    this.parentmodal.container.alpha = 0;
    this.modalheight = this.parentmodal.container.height;
    //create modal component
    this.modal = new Modal(this.main, this.parentmodal.container);
    this.modal.gamesettings.toggleSprite.forEach(btn => {
      btn.addListener("pointerdown", () => {
        this.modal.gamesettings.toggleOnOff(btn);
      });
    });
    this.modalContainer.addChild(this.modal.container);
    //add modal container
    this.gameContainer.addChild(this.modalContainer);
  }
  private createControllers(){
    //add parent controller
    this.parentcontroller = new ParentController(this.main);
    this.controllersContainer.addChild(this.parentcontroller.container);
    this.controllerheight = this.parentcontroller.container.height;
    this.controllerposition = (this.main.screen.height - this.parentcontroller.container.height);
    //add controller container
    this.controllersContainer.position.y = this.controllerposition;
    this.gameContainer.addChild(this.controllersContainer);
    //create controller component
    this.controller = new Controllers(this.main, this.parentcontroller.container, this.bet, this.game, this.drop, this.money, this.win);
    this.controller.downbutton.sprite.addListener("pointerdown", this.minusBet.bind(this));
    this.controller.upbutton.sprite.addListener("pointerdown", this.plusBet.bind(this));
    this.controller.playbutton.sprite.addListener('pointerdown', this.startDrop.bind(this));
    this.controller.minusbutton.sprite.addListener('pointerdown', this.minusDrop.bind(this));
    this.controller.plusbutton.sprite.addListener('pointerdown', this.plusDrop.bind(this));
    this.controller.menubutton.sprite.addListener('pointerdown', this.showModal.bind(this))
    this.controllersContainer.addChild(this.controller.container);
  }
  private minusBet(){
    if(this.bet > this.betmoney){
      this.bet -= this.betmoney;
      this.controller.betbox.updateMoney(this.bet);
    }
  }
  private plusBet(){
    this.bet += this.betmoney;
    this.controller.betbox.updateMoney(this.bet);
  }
  private updateGamePlus(){
    this.game += 1;
    this.controller.gameinbox.updateGame(this.game);
    // this.slotgame.getResult();
  }
  private updateGameMinus(){
    this.game -= 1;
    this.controller.gameinbox.updateGame(this.game);
  }
  private dropOff(){
    if(this.money < this.bet || this.drop <= 0){
      this.start = false;
      this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['play.png'];
      this.plinkogame.startDrop = false;
      this.controller.dropbox.updateGame(0);
      this.checkBall();
    }
  }
  private checkBall(){
    if(this.plinkogame.startDrop){
      if(this.plinkogame.haveBall){
        this.plinkogame.isDrop = true;
      }
    }
    else{
      this.plinkogame.isDrop = false;
    }
  }
  private startDrop(){
    if(this.bet > this.money || this.drop <= 0){
      alert("Not enough Money / No Drop Count");
    }
    else{
      if(this.plinkogame.up || this.plinkogame.down || this.plinkogame.downleft || this.plinkogame.downright){
        if(this.start){
          this.start = false;
          this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['play.png'];
          this.plinkogame.startDrop = false;
        }
        else{
          this.start = true;
          this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['pause.png'];
          this.plinkogame.startDrop = true;
        }
    
        this.checkBall();
      }
    }
  }
  private minusDrop(){
    this.drop -= 5;
    if(this.drop <= 0){
      this.drop = 0;
    }
    this.controller.dropbox.updateGame(this.drop);
  }
  private plusDrop(){
    if(this.drop < 100){
      this.drop += 5;
    }
    this.controller.dropbox.updateGame(this.drop);
  }
  private decMoney(){
    this.money = this.money - this.bet;
    this.controller.balancebox.updateBalance(this.money);
    this.drop -= 1;
    this.controller.dropbox.updateGame(this.drop);
  }
  private addMoney(type: number){
    let addedmoney = 0
    if(type == 1){
      addedmoney = (this.bet / 2);
    }
    else{
      addedmoney = (this.bet * 2);
    }
    this.money += addedmoney;
    this.controller.winbox.updateWin(addedmoney);
    let reset = setTimeout(() => {
      this.controller.balancebox.updateBalance(this.money);
      clearTimeout(reset);
    }, 6000);
  }
  private showModal(){
    let alpha = 0;
    if(this.modal.container.alpha == 0){
      alpha = 1;
    }
    gsap.to(this.modal.container,{
      alpha : alpha, duration : .5
    });
  }
  // end julius code
}