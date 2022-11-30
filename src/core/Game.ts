import * as PIXI from 'pixi.js';
import Loader from './components/Loader';
import Plinko from './plinko/Plinko';
import Slot from './slot/Slot';
import Home from './components/Home';
import TextBox from './components/TextBox';
import PlayButton from './components/PlayButton';
import Icons from './components/Icons';
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
  private controllersContainer: PIXI.Container;
  private main: PIXI.Application;
  private plinko: PIXI.Application;
  private slot: PIXI.Application;
  private home: Home;
  private scene: Scene;
  private diveGroupAnimation: Array<object> = []; 
  private riseGroupAnimation: Array<object> = []; 
  private plinkogame: Plinko;
  private slotgame: Slot;
  private startText: PIXI.Text;
  private betText: PIXI.Text;
  private moneyText: PIXI.Text;
  private gameText: PIXI.Text;
  private start: Boolean = false;
  private bet: number = 100;
  private money: number = 1000;
  private game: number = 0;
  private drop: number = 0;
  private gift: TextBox;
  private balance: TextBox;
  private playBtn: PlayButton;

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
    PIXI.settings.RESOLUTION = 1;

    this.sceneContainer = new PIXI.Container;
    this.gameContainer = new PIXI.Container;
    this.homeContainer = new PIXI.Container;
    this.mainContainer = new PIXI.Container;
    this.controllersContainer = new PIXI.Container;
  }  

  private setRenderer() {
    this.main = new PIXI.Application({ width: this.baseWidth, height: this.baseHeight});
    this.main.stage.interactive = true;
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
    this.plinkogame = new Plinko(this.plinko,this.main.loader,this.decMoney.bind(this),this.dropOff.bind(this), this.addMoney.bind(this), this.updateGame.bind(this));
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
    // this.dive();
  }

  private startGame() {
    this.mainContainer.addChild(this.sceneContainer);
    this.mainContainer.addChild(this.homeContainer);
    this.mainContainer.addChild(this.gameContainer);
    this.main.stage.addChild(this.mainContainer);
    window.addEventListener('keypress', e => this.bonus(e));
    this.createControllers();
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
        }
      })

      gsap.to(this.scene.sunRays, {
        alpha: 1,
        duration: this.animationSpeed,
        ease: "power1.in"
      })
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
  private createControllers(){
    const boxheight = 32;
    const toppadding = 2;
    const sidepadding = 20;
    const controllerheight = this.main.screen.height - this.plinkogame.container.height;
    this.controllersContainer.position.y = this.plinkogame.container.height + toppadding;
    this.gameContainer.addChild(this.controllersContainer);

    //add parent rectangle
    const parentRect = new PIXI.Graphics();
    parentRect.beginFill(0x000000);
    parentRect.drawRect(0,0, this.main.screen.width, controllerheight);
    parentRect.alpha = .5;
    this.controllersContainer.addChild(parentRect);
    
    //add menu button
    const menubtn = new Icons(this.main, this.main.loader.resources!.icons.textures!['icons-menu.png']);
    menubtn.container.position.y = (controllerheight / 2) - (menubtn.container.height / 2);
    menubtn.container.position.x = sidepadding;
    this.controllersContainer.addChild(menubtn.container);

    //add play button
    this.playBtn = new PlayButton(this.main,this.drop,230,(controllerheight * .6));
    this.playBtn.container.position.x = (this.controllersContainer.width / 2) - (this.playBtn.container.width / 2);
    this.playBtn.container.position.y = ((this.controllersContainer.height / 2) - (this.playBtn.container.height / 2));
    this.playBtn.startSprite.addListener('pointerdown', this.startDrop.bind(this));
    this.playBtn.minusgameSprite.sprite.addListener('pointerdown', this.minusDrop.bind(this));
    this.playBtn.plusgameSprite.sprite.addListener('pointerdown', this.plusDrop.bind(this));
    this.controllersContainer.addChild(this.playBtn.container);

    //add volume button
    const volumebtn = new Icons(this.main, this.main.loader.resources!.icons.textures!['icons-volume.png']);
    volumebtn.container.position.y = (controllerheight / 2) - (volumebtn.container.height / 2);
    volumebtn.container.position.x = (this.controllersContainer.width - volumebtn.container.width) - sidepadding;
    this.controllersContainer.addChild(volumebtn.container);





    //controllers fixe variables
    
    // const paddingtop = 10;
    

    

    // //position y
    // const posy = ;
    // const posx = parentRect.width;







    //add win contoller
    this.gift = new TextBox(this.main,'WIN',999999999,135,32);
    this.gift.container.position.x = this.controllersContainer.width - 200;
    this.gift.container.position.y = 17;
    this.controllersContainer.addChild(this.gift.container);

    
    //add balance contoller
    this.balance = new TextBox(this.main,'BALANCE',this.money,135,32);
    this.balance.container.position.x = this.controllersContainer.width - 350;
    this.balance.container.position.y = 17;
    this.controllersContainer.addChild(this.balance.container);




    // const style = new PIXI.TextStyle({
    //     fontFamily: 'Questrial',
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     fill: '#ffffff',
    // });
    // this.startText = new PIXI.Text('Drop on', style);
    // this.startText.interactive = true;
    // this.startText.buttonMode = true;
    // this.startText.addListener('pointerdown', this.startDrop.bind(this));
    // this.startText.position.y = this.main.screen.height - 50;
    // this.gameContainer.addChild(this.startText);

    //bet
    // this.betText = new PIXI.Text('Bet: '+this.bet, style);
    // this.betText.position.y = this.main.screen.height - 50;
    // this.betText.position.x = 150;
    // this.gameContainer.addChild(this.betText);

    // //money
    // this.moneyText = new PIXI.Text('Money: '+this.money, style);
    // this.moneyText.position.y = this.main.screen.height - 50;
    // this.moneyText.position.x = 300;
    // this.gameContainer.addChild(this.moneyText);

    // //game
    // this.gameText = new PIXI.Text('Game: '+this.game, style);
    // this.gameText.position.y = this.main.screen.height - 50;
    // this.gameText.position.x = 500;
    // this.gameContainer.addChild(this.gameText);
  }

  private minusDrop(){
    this.drop -= 5;
    if(this.drop <= 0){
      this.drop = 0;
    }
    this.playBtn.addMinus('dec',this.drop);
  }

  private plusDrop(){
    if(this.drop <= 100){
      this.drop += 5;
    }
    this.playBtn.addMinus('inc',this.drop);
  }

  private startDrop(){
    if(this.bet > this.money || this.drop <= 0){
      alert("Not enough Money / No Drop Count");
    }
    else{
      if(this.plinkogame.up || this.plinkogame.down || this.plinkogame.downleft || this.plinkogame.downright){
        if(this.start){
          this.start = false;
          this.playBtn.startSprite.texture = this.main.loader.resources!.home.textures!['start.png'];
          this.plinkogame.startDrop = false;
        }
        else{
          this.start = true;
          this.playBtn.startSprite.texture = this.main.loader.resources!.home.textures!['pause.png'];
          this.plinkogame.startDrop = true;
        }
    
        this.checkBall();
      }
    }
  }

  private decMoney(){
    console.log('wow');
    this.money = this.money - this.bet;
    this.moneyText.text = 'Money: '+this.money;
    this.drop -= 1;
    this.playBtn.changeDropValue();
  }


  private dropOff(){
    if(this.money < this.bet || this.drop <= 0){
      this.start = false;
      this.playBtn.startSprite.texture = this.main.loader.resources!.home.textures!['start.png'];
      this.plinkogame.startDrop = false;
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

  private addMoney(type: number){
    if(type == 1){
      this.money = this.money + (this.bet / 2);
      this.moneyText.text = 'Money: '+this.money;
    }
    else{
      this.money = this.money + (this.bet * 2);
      this.moneyText.text = 'Money: '+this.money;
    }
  }

  private updateGame(){
    this.game = this.game + 1;
    this.gameText.text = 'Game: '+this.game;
    // this.slotgame.getResult();
  }

  // end julius code
}