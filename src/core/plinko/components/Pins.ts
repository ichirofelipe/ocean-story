import * as PIXI from 'pixi.js';

export default class Pins {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private rowCount: number = 5;
  private colCount: number = 8;
  private pinSize: number = 3;
  private distanceDiff: number = 0.2;
  private reelHeight: number;
  public pinsObj: Array<PIXI.Graphics> = [];

  constructor(app: PIXI.Application, reelHeight: number){
    this.app = app;
    this.container = new PIXI.Container();
    this.reelHeight = reelHeight;

    this.init();
  }

  private init(){
    this.createPins();
  }

  private createPins() {
    let distance = (this.app.screen.width - (this.app.screen.width * this.distanceDiff)) / this.colCount;

    for(let col = 0; col < this.colCount; col++){
      for(let row = 0; row < this.rowCount; row++){
        let newDistance = distance;

        const pin = new PIXI.Graphics();
        pin.beginFill(0xffffff);
        pin.drawCircle(0, 0, this.pinSize);
        pin.endFill();
        
        if(row%2 == 0)
          newDistance+=distance

        let padding = ((this.app.screen.width - ((distance * (this.colCount - 1)) + pin.width)) / 2) - newDistance/2;
        pin.x = (distance * col) + (pin.width/2) + padding + (distance/2);
        pin.y = (this.app.screen.height - this.reelHeight) - ( (distance * row) + pin.height + (distance/2));

        this.pinsObj.push(pin);
        this.container.addChild(pin);
      }
    }
  }
}