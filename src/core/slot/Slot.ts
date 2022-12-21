import * as PIXI from 'pixi.js';

// TEST FUNCTION -- FOR GENERATING TEST RESULTS FOR SLOT GAME WITH RTP COMPUTATIONS BASED ON THE ASSIGNED VALUE
// this is used for testing if RTP is genrating results correctly by pressing ENTER KEY
import TestFunctions from './tools/TestFunctions';

// FUNCTION -- FOR GENERATING REAL RESULTS FOR SLOT GAME WITH RTP COMPUTATIONS BASED ON THE ASSIGNED VALUE
import Functions from './tools/Functions';

// GLOBAL FUNCTIONS
import GFunctions from '../Functions';

// GLOBAL VARIABLES FOR SLOT GAME
import Globals from './tools/globals.json';

// REELS CONTAINER
import ReelsContainer from './components/reel/ReelsContainer';

// SLOT SETTINGS OR SLOT CONFIG
import {ReelOffsetX, ReelOffsetY, Pattern} from './tools/settings.json';

// SLOT HELPERS AUTO WIDTH AUTO HEIGHT AND SETTINGS OBJECT VALUES
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

    // INIATIALIZE TEST FUNCTION
    this.testFunctions = new TestFunctions(this.bet, this.RTP);

    // INITIALIZE REAL FUNCTION FOR REAL RESULTS
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
  }

  // UPDATE VALUES OF FUNCTIONS FOR GENERATING RESULTS
  public updateFunctions(){
    this.testFunctions = new TestFunctions(this.bet, this.RTP);
    this.functions = new Functions(this.bet, this.RTP);
  }

  // SETTING SLOT CONTAINER TO SORTABLE
  private settings() {
    this.container.sortableChildren = true;
  }

  // CALLING TEST RESULT GENERATOR ON PRESSING ENTER KEY
  private createGenerateEvent() {
    window.document.addEventListener('keypress', e => this.testResult(e))
  }

  // INITIALIZE REELS CONTAINER
  private createReelsContainer() {

    // GENERATE INITIAL REEL VALUES FOR DISPLAY
    let initReelsArray = this.functions.generateResult();

    this.reelsContainer = new ReelsContainer(this.app, initReelsArray);
    this.reelsContainer.container.x = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.y = (this.app.screen.width/2) - (this.reelsContainer.container.width/2);
    this.reelsContainer.container.zIndex = 1;

    this.container.addChild(this.reelsContainer.container);
  }

  // INITIALIZE BACKGROUND
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

  // INITIALIZE FRAME
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

  // FUNCTION FOR TEST RESULT
  private testResult(e: any) {
    if(e.keyCode != 13)
      return;

    this.testFunctions.testResult()
  }

  // GET NEW RESULT TO BE SHOWN
  // PUBLIC FUNCTION CALLED FROM THE GAME.TS FOR GENERATING REAL RESULTS
  public getResult(winnings: (win: number) => void) {
    const result = this.functions.generateResult();                   // THIS IS REAL RESULT
    const formattedResult = this.functions.formatResult(result);      // FORMAT RESULTS FOR EASIER FOR LOOP OF GETTING DATA
    const win = this.functions.getTotalWin(formattedResult);          // GET TOTAL WIN IN THE FORMATTED RESULT
    
    this.bonusCount = 0;                                              // RESET BONUS COUNT TO 0
    this.getSymbolsToAnimate(formattedResult);                        // THIS IS TO INITIALIZE THE ARRAY FOR ALL SYMBOLS TO BE ANIMATED
    this.reelsContainer.reelsArray = result;                          // PASS THE REEL RESULT TO THE PUBLIC VARIABLE IN REELS CONTAINER

    this.reelsContainer.spinReels(() => {                             // CALL PUBLIC FUNCTION IN REELS CONTAINER TO SPIN THE REELS
      winnings(win);                                                  // CALL THE CALLBACK FUNCTION TO PASS THE TOTAL WINS
    });
  }

  // GET NUMBER MINIMUM AND MAXIMUM FREE SPIN FOR THE SLOT BONUS GAME
  public getBonusNumSpin(bonusCount: number) {
    if(bonusCount == 3){
      return GFunctions.randMinMax(5, 16);
    } else if(bonusCount == 4){
      return GFunctions.randMinMax(10, 21);
    } else{
      return GFunctions.randMinMax(20, 31);
    }
  }

  // FUNCTION FOR GETTING ALL SYMBOLS TO BE ANIMATED
  private getSymbolsToAnimate(result: Array<any>) {
    this.symbolsToAnimate = [];
    
    result.forEach(res => {
      if(res.index == -1){

        //GET BONUS SYMBOLS TO BE ANIMATED IF BONUS PATTERN IS SATISFIED
        this.bonusCount = res.colCount;
        res.combination.forEach((pat:string) => {
          let reelIndex = Number(pat.split('-')[0]);
          let value = Number(pat.split('-')[1]);

          this.symbolsToAnimate.push(this.reelsContainer.reels[reelIndex].reelBlocks[value].symbolSprite);
        })
      }
      else{

        // GET ALL WINNING LETTER AND CHARACTER SYMBOLS TO BE ANIMATED
        Pattern[res.index].forEach((value, reelIndex) => {
          if(reelIndex < res.colCount)
            this.symbolsToAnimate.push(this.reelsContainer.reels[reelIndex].reelBlocks[value].symbolSprite);
        })
      }
    })

    //TO FIX !!!! DO NOT PUSH SAME SYMBOL PATH TO BE ANIMATED
  }

  // INITIALIZE LOGO
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