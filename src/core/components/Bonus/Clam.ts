import * as PIXI from 'pixi.js';
import Functions from '../../Functions';
import Helpers from '../../slot/tools/Helpers';
import { clamSettings, bonusStats } from './bonusSettings.json';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Clam {
  private app: PIXI.Application;
  private frame: PIXI.Sprite;
  public container: PIXI.Container;
  public value: number;
  private perColumn: number = 2;
  public position: number;
  public bonusCount: number;
  public positionText: PIXI.Text;
  public clam: PIXI.Graphics;
  private clamSettings = {
    name: "clam-black",
    width: 120,
    animationSpeed: 0.15,
    isAnimated: true,
  }
  private onClick: () => void;

  // POSITION = INDEX FOR EACH CLAM ALSO USED FOR POSITION
  // VALUE = THE VALUE FOR EACH CLAM
  // BONUSCOUNT = THE NUMBER OF COLUMN WITH BONUS NUMBER
  // FRAME = FRAME SPRITE IS PASSED (ONLY USED FOR POSITIONING OF CLAMS)
  // ONCLICK = CALLBACK TO BE USED AFTER CLICKING ON THE CLAM
  constructor(app: PIXI.Application, value: number, position: number, bonusCount: number, frame: PIXI.Sprite, onClick: () => void){
    this.app = app;
    this.frame = frame;
    this.value = value;
    this.position = position;
    this.bonusCount = bonusCount;
    this.container = new PIXI.Container;
    this.onClick = onClick;

    this.init();
  }

  private init() {
    this.updateSettings();
    this.createInteractiveClam();
    this.createPositionLabel();
  }

  // UPDATE THE NAME VALUE FOR EACH CLAM TO DETERMINE IF CLAM SHOULD SHOW (GOLD, SILVER, BLACK) PEARL
  private updateSettings() {
    if(this.value > bonusStats[this.bonusCount - 3].min + 3)
      this.clamSettings.name = 'clam-white';
    if(this.value > bonusStats[this.bonusCount - 3].min + 7)
      this.clamSettings.name = 'clam-gold';
  }

  // CREATE THE CLAM
  private createInteractiveClam() {
    const texture = this.app.loader.resources!.homebonus.textures!['clamp-close.png'];
    let img = new PIXI.Sprite(texture);
    img.height = Helpers.autoHeight(img, this.clamSettings.width + 10);
    img.width = this.clamSettings.width + 10;
    
    this.clam = new PIXI.Graphics
    this.clam.beginFill(0x000000, 0)
    .drawRect(0, 0, img.width, img.height)
    .endFill();

    const clamSpace = this.frame.width;
    const columnSpace = clamSpace - (img.width * this.perColumn);
    const rowLevel = Math.floor(this.position / this.perColumn);
    this.clam.x = this.frame.x + 80;
    this.clam.y = this.frame.y + 65;
    
    this.clam.x += (columnSpace - 30) * this.position;
    this.clam.y += (img.height + 30) * rowLevel;
    if(rowLevel > 0)
      this.clam.x -= ((columnSpace - 30) * this.perColumn) * rowLevel

    img.interactive = true;
    img.buttonMode = true;
    img.addListener('pointerdown', this.onClick)
    
    this.clam.addChild(img);
    this.container.addChild(this.clam);
  }

  // CREATE THE POSITION TEXT FOR CLAM
  private createPositionLabel() {
    let style = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 24,
      fontWeight: 'bolder',
      fill: '#ecbe6b',
      stroke: "#00000080",
      strokeThickness: 5,
    })

    this.positionText = new PIXI.Text(this.position+1, style);
    this.positionText.x = (this.clam.width - this.positionText.width) / 2;
    this.positionText.y = (this.clam.height - this.positionText.height) / 2;

    this.clam.addChild(this.positionText);
  }

  // FUNCTION FOR OPENNING THE CLAM
  public openClam() {
    this.clam.x += this.clam.width/2;
    this.clam.y += this.clam.height/2;
    this.clam.pivot.x = this.clam.width/2;
    this.clam.pivot.y = this.clam.height/2;
    this.clam.rotation = 10 * Math.PI / 180;
    const clamVibrate = gsap.to(this.clam, {
      rotation: -10 * Math.PI / 180,
      duration: 0.1,
      repeat: 3,
      ease: 'none',
      onComplete: () => {
        this.clam.rotation = 0 * Math.PI / 180;
        let img = Functions.getSprite(this.app.loader, this.clamSettings);
        img.y = (this.clam.height - img.height) / 2;
        img.x = (this.clam.width - img.width) / 2;
        
        this.clam.removeChildren();
        this.clam.addChild(img)
        this.createDisplayValue();
        
        clamVibrate.kill();
      }
    })
  }

  // CREATE THE VALUE TEXT DISPLAY FOR THE CLAM
  private createDisplayValue() {
    let style = new PIXI.TextStyle({
      fontFamily: 'Luckiest Guy',
      fontSize: 28,
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

    const textValue = new PIXI.Text(this.value, style);
    textValue.x = ((this.clam.width - textValue.width) / 2) + 5;
    textValue.y = ((this.clam.height - textValue.height) / 2) - 10;

    this.clam.addChild(textValue);
  }

  // FUNCTION TO DISABLE THE CLAM
  public disable(text:boolean = true) {
    if(text){
      const disableAnimate = gsap.to(this.positionText, {
        alpha: 0,
        duration: 0.5,
        ease: 'none',
        onComplete: () => {
          disableAnimate.kill();
        }
      })
    }
    const clamDisableAnimate = gsap.to(this.clam, {
      alpha: 0.5,
      duration: 0.5,
      ease: 'none',
      onComplete: () => {
        clamDisableAnimate.kill();
      }
    })
    this.clam.interactiveChildren = false;
  }

  // FUNCTION TO ENABLE THE CLAM
  public enable() {
    const enableAnimate = gsap.to(this.clam, {
      alpha: 1,
      duration: 0.5,
      ease: 'none',
      onComplete: () => {
        enableAnimate.kill();
      }
    })
    this.clam.interactiveChildren = true;
  }
}