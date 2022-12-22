import * as PIXI from 'pixi.js';
import Helpers from '../../slot/tools/Helpers';
import Clam from './Clam';
import { Flow, bigClamSettings, clamSettings, bonusStats } from './bonusSettings.json';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Functions from '../../Functions';
import { off } from 'process';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Bonus {
  private app: PIXI.Application;
  public container: PIXI.Container;
  public clams: Array<number>;
  private frame: PIXI.Sprite;
  private logo: PIXI.Sprite;
  private bigClam: PIXI.Graphics;
  private bigClamIndex: number;
  private bigClamValue: number;
  private offerValue: number;
  private positionText: PIXI.Text;
  private instructionText: PIXI.Text;
  private offerText: PIXI.Text;
  private actionsBlock: PIXI.Graphics;
  private sequence: number = 0;
  private clamsToPick: number = 0;
  private actionType: number;
  public bonusCount: number;
  private activeClams: Array<Clam> = [];
  private bonusDone: (spin: number) => void;
  
  // clams = array of numbers for the clams to be opened for bonus game
  // bonusCount = to determine how many columns had the bonus number to determine how many spins for MIN and MAX
  // example 3 columns with bonus number will display a minimum of 5 spins to a maximum of 15 spins
  // bonusDone = callback if bonus game is done
  constructor(app: PIXI.Application, clams: Array<number>, bonusCount: number, bonusDone: (spin: number) => void) {
    this.app = app;
    this.clams = clams;
    this.bonusCount = bonusCount;
    this.container = new PIXI.Container;
    this.bonusDone = bonusDone;

    this.init();
  }

  private init() {
    this.createFrame();
    this.createLogo();
    this.createClams();
    this.createBigClam();
    this.createInstructionText();
    this.createOfferText();
    this.createActions();

    this.continueBonusSequence();
  }

  // INITIALIZE FRAME FOR BONUS GAME
  private createFrame() {
    const texture = this.app.loader.resources!.homebonus.textures!['frame.png'];
    this.frame = new PIXI.Sprite(texture);
    this.frame.height = Helpers.autoHeight(this.frame, (this.frame.width/1.45));
    this.frame.width = (this.frame.width/1.45);
    this.frame.x = (this.app.screen.width - this.frame.width) / 2;
    this.frame.y = (this.app.screen.height - this.frame.height) / 2;
    
    this.container.addChild(this.frame);
  }

  // INITIALIZE LOGO FOR BONUS GAME
  private createLogo() {
    const texture = this.app.loader.resources!.slot.textures!['logo.png'];
    this.logo = new PIXI.Sprite(texture);
    this.logo.height = Helpers.autoHeight(this.logo, 180);
    this.logo.width = 180;

    this.logo.x = this.frame.x + (this.frame.width - this.logo.width) / 2;
    this.logo.y = this.frame.y - (this.logo.height/2) + 30;
    
    this.container.addChild(this.logo);
  }

  // INITIALIZE CLAMS FOR BONUS GAME
  private createClams() {
    this.clams.forEach((val, index) => {

      const clam = new Clam(this.app, val, index, this.bonusCount, this.frame, () => {
        
        // THIS IS THE START OF THE CALL BACK FUNCTION AFTER CLICKING ON EACH CLAM

        // CHECK IF BIG CLAM IS UNDEFINED TO KNOW IF ITS THE FIRST CLAM THAT THE PLAYER SELECTED
        if(this.bigClamIndex === undefined){
          
          // SET FIRST CLAM AS THE BIG CLAM TO BE OPENED FOR LATER
          this.bigClamText(clam);
          this.setBigClam();
          clam.disable();
        } else{

          // IF BIG CLAM IS ALREADY SELECTED OPEN THE NEXT SELECTED CLAM
          clam.openClam();
        }

        // DECREMENT THE TOTAL CLAMS TO BE SELECTED FOR EACH ROUND
        this.clamsToPick--;

        // REMOVE CLAM FROM ARRAY
        this.clams.splice(clam.position, 1);

        // FILTER ACTIVE CLAMS TO HAVE A LIST OF HOW MANY REMAINING ACTIVE CLAMS CAN PLAYER STILL SELECT
        this.activeClams = this.activeClams.filter(aClam => aClam.position != clam.position);

        // GO TO THE NEXT PHASE OF THE BONUS GAME
        this.nextSequence();
      });

      this.activeClams.push(clam);
      this.container.addChild(clam.container);
    })
  }

  // CREATE THE BIG CLAM
  private createBigClam() {
    const texture = this.app.loader.resources!.homebonus.textures!['clamp-close.png'];
    let img = new PIXI.Sprite(texture);
    img.height = Helpers.autoHeight(img, bigClamSettings.width + 10);
    img.width = bigClamSettings.width + 10;

    this.bigClam = new PIXI.Graphics
    this.bigClam.beginFill(0xFFFFFF, 0)
    .drawRect(0, 0, img.width, img.height)
    .endFill();
    this.bigClam.x = this.frame.x + (this.frame.width - img.width) / 2;
    this.bigClam.y = this.frame.height - img.height - 10;
    this.bigClam.alpha = 0.5;

    this.bigClam.addChild(img);
    this.container.addChild(this.bigClam);
  }

  // SET THE NAME VALUE FOR THE BIG CLAM
  private setBigClam() {
    if(this.bigClamValue > bonusStats[this.bonusCount - 3].min + 3)
      bigClamSettings.name = 'clam-white';
    if(this.bigClamValue > bonusStats[this.bonusCount - 3].min + 7)
      bigClamSettings.name = 'clam-gold';
  }

  // CREATE THE TEXT FOR BIG CLAM
  private bigClamText(clam: Clam) {
    const {position, value} = clam;

    this.createPositionText(position, value);

    this.bigClamIndex = position;
    this.bigClamValue = value;

    const showClam = gsap.to(this.bigClam, {
      alpha: 1,
      duration: 0.5,
      ease: 'none',
      onComplete: () => {
        showClam.kill();
      }
    })
    const showText = gsap.to(this.positionText, {
      alpha: 1,
      duration: 0.5,
      ease: 'none',
      onComplete: () => {
        showText.kill();
      }
    })
  }

  // FUNCTION FOR REPLACING THE SPRITE OF THE BIG CLAM WITH ANIMATED SPRITE TO DISPLAY OPENING ANIMATION
  private showBigClam() {
    this.setBigClam();
    this.bigClam.x += this.bigClam.width/2;
    this.bigClam.y += this.bigClam.height/2;
    this.bigClam.pivot.x = this.bigClam.width/2;
    this.bigClam.pivot.y = this.bigClam.height/2;
    this.bigClam.rotation = 10 * Math.PI / 180;
    const clamVibrate = gsap.to(this.bigClam, {
      rotation: -10 * Math.PI / 180,
      duration: 0.1,
      repeat: 3,
      ease: 'none',
      onComplete: () => {
        this.bigClam.rotation = 0 * Math.PI / 180;
        let img = Functions.getSprite(this.app.loader, bigClamSettings);
        img.y = (this.bigClam.height - img.height) / 2;
        img.x = (this.bigClam.width - img.width) / 2;
        
        this.bigClam.removeChildren();
        this.bigClam.addChild(img)
        this.createDisplayValue(this.bigClam, this.bigClamValue);
        
        let spin = this.bigClamValue;
        let delayBeforeExit = setTimeout(() => {
          this.bonusDone(spin);
          clearTimeout(delayBeforeExit);
        }, 5000);
        
        clamVibrate.kill();
      }
    })
  }

  // CREATE THE POSITION TEXT OF CLAM
  private createPositionText(position: number, value: number) {
    let style = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 42,
      fontWeight: 'bold',
      fill: '#ecbe6b',
      stroke: "#00000080",
      strokeThickness: 5,
    })
    this.positionText = new PIXI.Text(position+1, style);
    this.positionText.x = (this.bigClam.width - this.positionText.width) / 2;
    this.positionText.y = (this.bigClam.height - this.positionText.height) / 2;
    this.positionText.alpha = 0;

    this.bigClam.addChild(this.positionText);
  }

  // CREATE THE INSTRUCTION TEXT FOR BONUS GAME
  private createInstructionText() {
    let style = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 18,
      fill: '#ecbe6b',
      stroke: "#00000080",
      strokeThickness: 5,
      letterSpacing: 3,
      dropShadow: true,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
      dropShadowBlur: 3
    })
    
    this.instructionText = new PIXI.Text('', style);
    this.instructionText.x = this.frame.x + (this.frame.width - this.instructionText.width) / 2;
    this.instructionText.y = this.logo.y + this.logo.height + 5;

    this.container.addChild(this.instructionText);
  }

  // CREATE THE OFFER TEXT FOR BONUS GAME
  private createOfferText() {
    let style = new PIXI.TextStyle({
      fontFamily: 'Luckiest Guy',
      fontSize: 60,
      fillGradientType: 0,
      fill: ['#f1c001', '#bf6600'],
      fillGradientStops: [0.4, 0.9],
      fontWeight: 'bold',
      stroke: "#00000080",
      strokeThickness: 5,
      letterSpacing: 3,
      dropShadow: true,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
      dropShadowBlur: 3
    })

    this.offerText = new PIXI.Text('', style);
    this.offerText.x = this.frame.x + (this.frame.width - this.offerText.width) / 2;
    this.offerText.y = this.instructionText.y + this.instructionText.height + 10;

    this.container.addChild(this.offerText);
  }

  // CREATE THE ACTIONS FOR BONUS GAME (ACCEPT AND DECLINE)
  private createActions() {
    const acceptTexture = this.app.loader.resources!.homebonus.textures!['accept.png'];
    const rejectTexture = this.app.loader.resources!.homebonus.textures!['reject.png'];
    let actionButtons: Array<PIXI.Sprite> = [];

    actionButtons.push(new PIXI.Sprite(acceptTexture));
    actionButtons.push(new PIXI.Sprite(rejectTexture));

    this.actionsBlock = new PIXI.Graphics;
    this.actionsBlock.beginFill(0x000000)
    .drawRect(0, 0, 0, 0)
    .endFill();

    actionButtons.forEach((button, index) => {
      button.x = (button.width + 20) * index;
      button.interactive = true;
      button.buttonMode = true;

      this.actionsBlock.addChild(button);
    })

    // IF USER SELECTED ACCEPT
    this.actionsBlock.children[0].addListener('pointerdown', this.acceptOffer.bind(this));

    // IF USER SELECTED DECLINE, BONUS GAME WILL PROCEED TO NEXT SEQUENCE
    this.actionsBlock.children[1].addListener('pointerdown', this.nextSequence.bind(this));


    this.actionsBlock.x = this.frame.x + ((this.frame.width - this.actionsBlock.width) / 2)
    this.actionsBlock.y = this.offerText.y + this.offerText.height + 10;
    this.actionsBlock.alpha = 0;
    this.actionsBlock.interactiveChildren = false;

    this.container.addChild(this.actionsBlock);
  }

  // FUNCTION TO ENABLE ACTIONS BLOCK
  private actionEnable() {
    const showAnimate = gsap.to(this.actionsBlock, {
      alpha: 1,
      duration: 0.5,
      ease: 'none',
      onComplete: () => {
        this.actionsBlock.interactiveChildren = true;
        showAnimate.kill();
      }
    })
  }

  // FUNCTION TO DISABLE ACTIONS BLOCK
  private actionDisable() {
    const disableAnimate = gsap.to(this.actionsBlock, {
      alpha: 0,
      duration: 0.5,
      ease: 'none',
      onComplete: () => {
        this.actionsBlock.interactiveChildren = false;
        disableAnimate.kill();
      }
    })
  }


  // FUNCTION TO PROCEED WITH THE NEXT SEQUENCE IN THE BONUS GAME
  // CHECK ALL THE SEQUENCE OF THE BONUS GAME IN bonusSettings.json (flow) ARRAY PROPERTY
  private continueBonusSequence() {
    let data = Flow[this.sequence];
    
    // CHECK IF ACTION SHOULD BE DISPLAYED
    if(data.action !== undefined){
      this.actionEnable();
    } else {
      this.actionDisable();
    }

    // FUNCTION TO RESET OFFER TEXT AND REPLACE OFFER
    this.offerText.text = '';
    if(data.offer !== undefined){
      let offerSpin = this.getOfferedSpin();

      // CHECK IF THE SEQUENCE NUMBER IS THE LAST PART OF BONUS GAME
      if(this.sequence < Flow.length - 1){
        this.bigClamValue = offerSpin;
        this.updateText(this.offerText, `${Functions.formatNum(offerSpin, 0)}`);
      }
    }
    
    if(data.clams !== undefined && this.clamsToPick == 0)
      this.clamsToPick = data.clams;

    // CHECK IF CLAMS IS READY FOR SELECTING TO ENABLE OR DISABLE CLAMS
    if(data.clams !== undefined){
      this.activeClams.forEach(clam => clam.enable());
    } else {
      this.activeClams.forEach(clam => clam.disable(false));
    }

    // CHECK IF BIGCLAM IS SELECTED
    if(data.bigClam !== undefined){

      // CHECK IF ACTION TYPE IS ACCEPT
      if(this.actionType == 0){
        let offerSpin = this.bigClamValue;
        this.updateText(this.offerText, `${Functions.formatNum(offerSpin, 0)}`);
        this.showBigClam();

      } 
      // THIS IS IF ACTION TYPE IS DECLINE THEN SWAP THE LAST CLAM TO THE BIG CLAM WHICH IS THE FIRST CLAM SELECTED BY THE PLAYER
      else {
        let clam = this.activeClams[0].clam;
        const clamAnim = gsap.to(clam, {
          height: this.bigClam.height,
          width: this.bigClam.width,
          x: this.bigClam.x,
          y: this.bigClam.y,
          duration: 1,
          ease: 'none',
          onComplete: () => {
            clamAnim.revert();
            clamAnim.kill();
          }
        })

        const bigClamAnim = gsap.to(this.bigClam, {
          height: clam.height,
          width: clam.width,
          x: clam.x,
          y: clam.y,
          duration: 1,
          ease: 'none',
          onComplete: () => {
            bigClamAnim.revert();
            let smallClamNewIndex = this.bigClamIndex;
            this.bigClamIndex = this.activeClams[0].position;
            this.bigClamValue = this.activeClams[0].value;
            this.positionText.text = this.activeClams[0].position + 1;
            this.activeClams[0].positionText.text = smallClamNewIndex + 1;
            
            let offerSpin = this.bigClamValue;
            this.updateText(this.offerText, `${Functions.formatNum(offerSpin, 0)}`);
            this.showBigClam();
            bigClamAnim.kill();
          }
        })
      }
    }

    // UPDATE THE INSTRUCTION TEXT
    let newIntructionText = data.instruction.replace('{clams}', `${this.clamsToPick}`);
    this.updateText(this.instructionText, newIntructionText);
  }

  // GET THE OFFERED SPIN WITH A BIT OF RNG
  private getOfferedSpin() {
    let offerSpin = 0;
    let stats = bonusStats[this.bonusCount - 3];

    this.activeClams.forEach(clam => {
      offerSpin += clam.value;
    })
    
    offerSpin = Math.floor(offerSpin/this.activeClams.length);

    if(Functions.randMinMax(-1.5,1) > 0){
      offerSpin += 2;
    } else {
      offerSpin -= 2;
    }

    if(offerSpin > stats.max){
      offerSpin = stats.max;
    }
    
    if(offerSpin < stats.min){
      offerSpin = stats.min;
    }


    return offerSpin;
  }

  private updateText(text: PIXI.Text, string: string) {
    text.text = string;
    text.x = this.frame.x + ((this.frame.width - text.width) / 2);
  }

  // FUNCTION FOR NEXT PROCEEDING TO NEXT SEQUENCE
  private nextSequence() {
    this.actionType = 1;
    if(this.clamsToPick == 0)
      this.sequence++;
    this.continueBonusSequence();
  }

  // FUNCTION TO CALL IF PLAYER ACCEPTED THE OFFER
  private acceptOffer() {
    this.actionType = 0;
    this.sequence = Flow.length - 1;
    this.continueBonusSequence();
  }

  // CREATE THE VALUE FOR CLAM
  private createDisplayValue(clam: PIXI.Graphics, value: number) {
    let style = new PIXI.TextStyle({
      fontFamily: 'Luckiest Guy',
      fontSize: 60,
      fillGradientType: 0,
      fill: ['#f1c001', '#bf6600'],
      fillGradientStops: [0.4, 0.9],
      fontWeight: 'bold',
      stroke: "#00000080",
      strokeThickness: 5,
      letterSpacing: 3,
      dropShadow: true,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
      dropShadowBlur: 3
    })

    const textValue = new PIXI.Text(value.toFixed(0), style);
    textValue.x = ((clam.width - textValue.width) / 2) + 5;
    textValue.y = ((clam.height - textValue.height) / 2) - 30;

    clam.addChild(textValue);
  }
}