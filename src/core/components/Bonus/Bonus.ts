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

  private createFrame() {
    const texture = this.app.loader.resources!.homebonus.textures!['frame.png'];
    this.frame = new PIXI.Sprite(texture);
    this.frame.height = Helpers.autoHeight(this.frame, (this.frame.width/1.45));
    this.frame.width = (this.frame.width/1.45);
    this.frame.x = (this.app.screen.width - this.frame.width) / 2;
    this.frame.y = (this.app.screen.height - this.frame.height) / 2;
    
    this.container.addChild(this.frame);
  }

  private createLogo() {
    const texture = this.app.loader.resources!.slot.textures!['logo.png'];
    this.logo = new PIXI.Sprite(texture);
    this.logo.height = Helpers.autoHeight(this.logo, 180);
    this.logo.width = 180;

    this.logo.x = this.frame.x + (this.frame.width - this.logo.width) / 2;
    this.logo.y = this.frame.y - (this.logo.height/2) + 30;
    
    this.container.addChild(this.logo);
  }

  private createClams() {
    this.clams.forEach((val, index) => {
      const clam = new Clam(this.app, val, index, this.bonusCount, this.frame, () => {
        
        if(this.bigClamIndex === undefined){
          this.bigClamText(clam);
          this.setBigClam();
          clam.disable();
        } else{
          clam.openClam();
        }

        
        this.clamsToPick--;
        this.clams.splice(clam.position, 1);
        this.activeClams = this.activeClams.filter(aClam => aClam.position != clam.position);
        this.nextSequence();
      });

      this.activeClams.push(clam);
      this.container.addChild(clam.container);
    })
  }

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

  private setBigClam() {
    if(this.bigClamValue > bonusStats[this.bonusCount - 3].min + 3)
      bigClamSettings.name = 'clam-white';
    if(this.bigClamValue > bonusStats[this.bonusCount - 3].min + 7)
      bigClamSettings.name = 'clam-gold';
  }

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

    this.actionsBlock.children[0].addListener('pointerdown', this.acceptOffer.bind(this));
    this.actionsBlock.children[1].addListener('pointerdown', this.nextSequence.bind(this));
    this.actionsBlock.x = this.frame.x + ((this.frame.width - this.actionsBlock.width) / 2)
    this.actionsBlock.y = this.offerText.y + this.offerText.height + 10;
    this.actionsBlock.alpha = 0;
    this.actionsBlock.interactiveChildren = false;

    this.container.addChild(this.actionsBlock);
  }

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


  private continueBonusSequence() {
    let data = Flow[this.sequence];
    
    if(data.action !== undefined){
      this.actionEnable();
    } else {
      this.actionDisable();
    }

    this.offerText.text = '';
    if(data.offer !== undefined){
      let offerSpin = this.getOfferedSpin();

      if(this.sequence < Flow.length - 1){
        this.bigClamValue = offerSpin;
        this.updateText(this.offerText, `${Functions.formatNum(offerSpin, 0)}`);
      }
    }
    
    if(data.clams !== undefined && this.clamsToPick == 0)
      this.clamsToPick = data.clams;

    if(data.clams !== undefined){
      this.activeClams.forEach(clam => clam.enable());
    } else {
      this.activeClams.forEach(clam => clam.disable(false));
    }

    if(data.bigClam !== undefined){
      if(this.actionType == 0){
        let offerSpin = this.bigClamValue;
        this.updateText(this.offerText, `${Functions.formatNum(offerSpin, 0)}`);
        this.showBigClam();

      } else {
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

    let newIntructionText = data.instruction.replace('{clams}', `${this.clamsToPick}`);
    this.updateText(this.instructionText, newIntructionText);
  }

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

  private nextSequence() {
    this.actionType = 1;
    if(this.clamsToPick == 0)
      this.sequence++;
    this.continueBonusSequence();
  }

  private acceptOffer() {
    this.actionType = 0;
    this.sequence = Flow.length - 1;
    this.continueBonusSequence();
  }

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