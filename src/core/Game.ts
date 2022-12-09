import * as PIXI from 'pixi.js';
import Loader from './components/Loader';
import Plinko from './plinko/Plinko';
import Slot from './slot/Slot';
import Home from './components/Home';
import Scene from './components/Scene';
import Bonus from './components/Bonus/Bonus';
import Functions from './Functions';
import Globals from './slot/tools/globals.json';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
//controllers
import ParentController from './components/Controllers/ParentController';
import Controllers from './components/Controllers';
//modal
import Modal from './components/Modal';
import ParentModal from './components/Modal/ParentModal';
import Win from './components/Popup/Win';

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
  private bonus: Bonus;
  private start: Boolean = false;
  private bet: number = 1;
  private arrBetIndex: number = 0;
  private arrBet: Array<number> = [1,5,10,20,50,100];
  private arrDropIndex: number = 0;
  private arrDrop: Array<number> = [5, 10, 25, 50, 100, 250, 500, 1000, -1];
  private money: number = 100000;
  private win: number = -1;
  private game: number = 0;
  private drop: number = 5;
  private parentcontroller: ParentController;
  private parentmodal: ParentModal;
  private modalheight: number;
  private controllerheight: number;
  private controllerposition: number;
  private controller: Controllers;
  private modal: Modal;
  private readonly betmoney: number = 50;
  private tickerValidation: PIXI.Ticker;
  private winPopupAnimation: Win;
  private tickervalid: Boolean = false;
  private allbet: number = 0;
  private readonly powerup: number = 40;

  constructor() {
    this.setSettings();
    this.setRenderer();

    new Loader(this.main, this.init.bind(this));
  }
  private init() {
    this.setContainers(); 
    this.createScene();
    this.createHome();
    this.createSlot();
    this.createControllers();
    this.createModal();
    this.createPlinko();
    this.setObjAnimation();
    this.startGame();
  }
  
  private setSettings() {
    // PIXI.settings.ROUND_PIXELS = true;
    // PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;

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
    this.scene = new Scene(this.main, this.mainContainer, this.sceneContainer);
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
    this.plinkogame = new Plinko(this.plinko,this.main.loader, this.updateGamePlus.bind(this), this.updateGameMinus.bind(this), this.decMoney.bind(this),this.dropOff.bind(this),this.addMoney.bind(this), this.powerUp.bind(this));
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
        {sprite: this.sceneContainer, posY: -(((this.sceneContainer.height - this.scene.sceneHeightAdjusment)/3)*2)},
        {sprite: this.gameContainer, posY: 0},
        {sprite: this.homeContainer, posY: -this.baseHeight*2},
        {sprite: this.scene.lightRay, alpha: 1},
      ]
    )
    this.riseGroupAnimation = Functions.objGroupAnimation(
      [
        {sprite: this.sceneContainer, posY: 0},
        {sprite: this.gameContainer, posY: this.baseHeight*2},
        {sprite: this.homeContainer, posY: 0},
        {sprite: this.scene.lightRay, alpha: 0},
      ]
    )
  }

  private startGame() {
    this.mainContainer.addChild(this.sceneContainer);
    this.mainContainer.addChild(this.homeContainer);
    this.mainContainer.addChild(this.gameContainer);
    this.main.stage.addChild(this.mainContainer);


    // this.dive();
    // this.winPopup(2500, 50);
  }

  private dive() {
    this.scene.bubbleAnimate();

    this.diveGroupAnimation.forEach((el: any) => {
      gsap.to(el.sprite, {
        y: el.posY??0,
        alpha: el.alpha??1,
        duration: this.animationSpeed,
        onComplete: () => {
          this.homeContainer.removeChild(this.home.container);
          this.stopAndPlay(true);
          Functions.toggleAnimations(this.scene.homeAnimations, false);
          Functions.toggleAnimations(this.scene.oceanBedAnimations, true);
          if(this.game > 0)
            this.slotPlay();

          // this.startBonusGame(3);
        }
      })
    })
  }
  
  private rise() {
    // this.riseGroupAnimation.forEach((el: any) => {

    //   gsap.to(el.sprite, {
    //     y: el.posY??0,
    //     alpha: el.alpha??1,
    //     onComplete: () => {
    //       this.stopAndPlay(false);
    //       Functions.toggleAnimations(this.scene.homeAnimations, true);
    //       Functions.toggleAnimations(this.scene.oceanBedAnimations, false);
    //     }
    //   })
    // })
    this.stopAndPlay(false);
  }

  private slotPlay() {
    // VALIDATION TO CHECK IF SLOT IS CURRENTLY SPINNING
    if(Globals.isSpinning)
      return;
    Globals.isSpinning = true;
    this.updateGameMinus();
    this.slotgame.getResult((money: number) => {
      if(money > 0)
        this.addMoney(2, money);
      
      //CHECK IF THERE ARE SYMBOLS TO ANIMATE
      if(this.slotgame.symbolsToAnimate.length > 0){

        //PLAY SYMBOL ANIMATION
        Functions.toggleAnimations(this.slotgame.symbolsToAnimate, true);
        this.slotgame.symbolsToAnimate.forEach(element => element.zIndex = 1);
        
        //DELAY 4 SECONDS TO BEFORE STOPPING ANIMATION
        let delay = setTimeout(() => {
          Functions.toggleAnimations(this.slotgame.symbolsToAnimate, false);
          this.slotgame.symbolsToAnimate.forEach(element => element.zIndex = 0);

          // CHECK IF THERE IS BONUS COMBINATION
          if(this.slotgame.bonusCount >= 3){
            this.startBonusGame(this.slotgame.bonusCount);
            return
          }
          
          Globals.isSpinning = false;
          if(this.game > 0){
            this.slotPlay();
          }

          
          clearTimeout(delay);
        }, 4000);
      }
      else{
        Globals.isSpinning = false;
        if(this.game > 0)
          this.slotPlay();
      }
    });
  }
  private startBonusGame(bonusCount: number) {
    const bonusPay = this.slotgame.getBonusPayout(bonusCount);
    const arrayBonusPay = [
      // Math.round(Functions.randMinMax(50, 100)),
      // Math.round(Functions.randMinMax(10, 90)),
      // Math.round(Functions.randMinMax(10, 80)),
      // Math.round(Functions.randMinMax(10, 70)),
      // Math.round(Functions.randMinMax(10, 60)),
      // Math.round(Functions.randMinMax(10, 50)),
      // Math.round(Functions.randMinMax(10, 40)),
      // Math.round(Functions.randMinMax(10, 30)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
      Math.round(Functions.randMinMax(10, 100)),
    ];

    this.bonus = new Bonus(this.main, arrayBonusPay, bonusPay, this.bonusDone.bind(this));
    this.homeContainer.addChild(this.bonus.container);
    this.scene.deleteBubbles();
    this.rise();
  }

  private bonusDone(money: number, percent: number) {
    this.homeContainer.removeChild(this.bonus.container);
    this.scene.createBubbles();
    this.scene.bubbleAnimate();
    Globals.isSpinning = false;
    this.dive();

    this.addMoney(2, money);
  }

  private winPopup(money:number, bet:number) {
    this.winPopupAnimation = new Win(this.main, money, bet, this.removeWin.bind(this));
    this.winPopupAnimation.container.zIndex = 10;
    this.mainContainer.addChild(this.winPopupAnimation.container);
    this.winPopupAnimation.show()
  }

  private removeWin() {
    console.log('remove WIn');
    this.mainContainer.removeChild(this.winPopupAnimation.container);
  }

















  // start julius code
  private stopAndPlay(type: Boolean){
    if(type){
      this.plinkogame.charSprite.forEach(element => {
        element.play();
      });
      this.plinkogame.ticker.start();
      this.plinkogame.ticker2.start();
      this.plinkogame.ballArray.forEach(element => {
        element.ticker.start();
      });
    }
    else{
      let stopper = setTimeout(() => {
        this.plinkogame.charSprite.forEach(element => {
          element.gotoAndStop(0);
        });
        this.plinkogame.ticker.stop();
        this.plinkogame.ticker2.stop();
        this.plinkogame.ballArray.forEach(element => {
          element.ticker.stop();
        });
        clearTimeout(stopper);
      }, 800);
    }
  }

  private createModal(){
    //add parent modal
    this.parentmodal = new ParentModal(this.main);
    this.modalContainer.addChild(this.parentmodal.container);
    this.parentmodal.container.alpha = 0;
    this.modalheight = this.parentmodal.container.height;
    //create modal component
    this.modal = new Modal(this.main, this.parentmodal.container);
    this.modal.close.addListener("pointerdown", this.showModal.bind(this));
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
    this.controller = new Controllers(this.main, this.parentcontroller.container, this.arrBet[this.arrBetIndex], this.game, this.drop, this.money, this.win);
    this.controller.downbutton.sprite.addListener("pointerdown", this.minusBet.bind(this));
    this.controller.upbutton.sprite.addListener("pointerdown", this.plusBet.bind(this));
    this.controller.playbutton.sprite.addListener('pointerdown', this.startDrop.bind(this));
    this.controller.minusbutton.sprite.addListener('pointerdown', this.minusDrop.bind(this));
    this.controller.plusbutton.sprite.addListener('pointerdown', this.plusDrop.bind(this));
    this.controller.menubutton.sprite.addListener('pointerdown', this.showModal.bind(this));
    this.controllersContainer.addChild(this.controller.container);
  }
  private minusBet(){
    this.resetGame();
    if(this.arrBetIndex > 0){
      this.arrBetIndex -= 1;
      this.bet = this.arrBet[this.arrBetIndex];
      this.controller.betbox.updateMoney(this.arrBet[this.arrBetIndex]);
    }
  }
  private resetGame(){
    if(this.tickervalid){
      this.start = false;
      this.tickervalid = false;
      this.plinkogame.startDrop = false;
      this.plinkogame.isDrop = false;
      if(this.tickerValidation.started){
        this.tickerValidation.destroy();
      }
      this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['play.png'];
    }
  }
  private plusBet(){
    this.resetGame();
    if(this.arrBetIndex < this.arrBet.length - 1){
      this.arrBetIndex += 1;
      this.bet = this.arrBet[this.arrBetIndex];
      this.controller.betbox.updateMoney(this.arrBet[this.arrBetIndex]);
    }
  }
  private updateGamePlus(){
    this.game += 1;
    this.controller.gameinbox.updateGame(this.game);
    this.slotPlay();
  }
  private updateGameMinus(){
    this.game -= 1;
    this.controller.gameinbox.updateGame(this.game);
  }
  private dropOff(){
    if(this.drop != -1){
      if(this.money < this.bet || this.drop <= 0){
        this.start = false;
        this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['play.png'];
        this.plinkogame.startDrop = false;
        this.drop = 0;
        this.controller.dropbox.updateGame(0);
        this.checkBall();
      }
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
      this.tickerValidation.destroy();
    }
  }
  private startDrop(){
    if(this.bet > this.money || this.drop == 0){
      alert("Not enough Money / No Drop Count");
    }
    else{
      if(this.start){
        this.start = false;
        this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['play.png'];
        this.plinkogame.startDrop = false;
        this.tickerValidation.destroy();
      }
      else{
        this.start = true;
        this.controller.playbutton.sprite.texture = this.main.loader.resources!.controllers.textures!['pause.png'];
        this.tickervalid = true;
        this.DropValidation();
      }
    }
  }
  private DropValidation(){
    this.tickerValidation = new PIXI.Ticker();
    this.tickerValidation.add((delta) => {
      if(this.plinkogame.up || this.plinkogame.down || this.plinkogame.downleft || this.plinkogame.downright){
        this.plinkogame.startDrop = true;
        this.checkBall();
      }
    });
    this.tickerValidation.start();
  }
  private minusDrop(){
    this.resetGame();
    if(this.arrDropIndex > 0){
      this.arrDropIndex -= 1;
      this.drop = this.arrDrop[this.arrDropIndex];
      this.controller.dropbox.updateGame(this.arrDrop[this.arrDropIndex]);
    }
  }
  private plusDrop(){
    this.resetGame();
    if(this.arrDropIndex < this.arrDrop.length - 1){
      this.arrDropIndex += 1;
      this.drop = this.arrDrop[this.arrDropIndex];
      this.controller.dropbox.updateGame(this.arrDrop[this.arrDropIndex]);
    }
  }
  private decMoney(){
    this.allbet += this.bet;
    this.money = this.money - this.bet;
    this.controller.balancebox.updateBalance(this.money);
    if(this.drop != -1){
      this.drop -= 1;
    }
    this.controller.dropbox.updateGame(this.drop);
  }

  private powerUp(){
    const money = this.allbet * this.powerup;
    this.controller.winbox.updateWin(money);
    this.allbet = 0;
  }

  private addMoney(type: number, money: number = 0){
    let addedmoney = 0
    if(type == 1){
      addedmoney = (this.bet / 2);
    }
    else if(type == 2) {
      addedmoney = (this.bet * 2);
      
    }
    else{
      addedmoney = money;
    }
    this.money += addedmoney;
    this.controller.winbox.updateWin(addedmoney);
    let reset = setTimeout(() => {
      this.controller.balancebox.updateBalance(this.money);
      clearTimeout(reset);
    }, 5000);

    if((money/this.bet) >= 20)
      this.winPopup(money, this.bet);
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