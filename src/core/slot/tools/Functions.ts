import Helpers from './Helpers';
import {Reel, Rows, Pattern, BonusNumber, Paylines, Payouts} from './settings.json';

export default class Functions {
  private bet: number = 0;
  private RTP: number = 0;
  private totalCombination: number = 0;
  private lowestLineCombination: number = 3;

  constructor(bet: number, RTP: number) {
    this.bet = bet;
    this.RTP = RTP;

    this.init();
  }

  private init() {
    this.setTotalCombination();
  }

  // SET TOTAL COMBINATIONS POSSIBLE OF THE GIVEN REEL SYMBOLS
  private setTotalCombination() {
    this.totalCombination = 1;
    Reel.forEach( reel => {
      this.totalCombination *= reel.length;
    })
  }

  // GENERATE REEL RESULTS
  public generateResult(pretty: boolean = false) {
    let result: Array<Array<number>> = [];
    let prettyResult: Array<Array<number>> = [];
    Reel.forEach((reel, rIndex) => {
      result.push([]);

      for(let row = 0; row < Rows; row++){
        result[rIndex].push(reel[Math.floor(Math.random() * reel.length)]);
      }

    })

    if(pretty){
      result.forEach(reel => {
        
        reel.forEach((symbol, index) => {
          if(!prettyResult[index])
            prettyResult[index] = []
  
          prettyResult[index].push(symbol);
        })
  
      })

      return prettyResult;
    }

    return result;
  }

  public formatResult(reels: Array<Array<number>>) {
    let winningPattern: Array<any> = [];
    let bonusWin = 0;
    let bonusPattern: Array<string> = [];

    //CHECK BONUS COMBINATION
    reels.forEach((reel, index) => {  
      let bonusBlocks = reel.filter(val => val == BonusNumber);
      if(bonusBlocks.length > 0)
        bonusWin++

      reel.forEach((block,bIndex) => {
        if(block == 4)
          bonusPattern.push(`${index}-${bIndex}`);
      })
    });

    if(bonusWin >= 3)
      winningPattern.push({'index': -1,'combination': bonusPattern, 'colCount': bonusWin});

    Pattern.forEach((pat, patIndex) => {
      let counter = 0;
  
      while(counter != this.lowestLineCombination){
        const combination = new Set();
        let blocks: Array<number> = [];
        let columnCount = pat.length - counter;
        reels.forEach((reel, index) => {

          if(index < (columnCount)){
            combination.add(reel[pat[index]])
            blocks.push(reel[pat[index]]);
          }
        });
        
        if (this.combinationValidation([...combination.values()]))
        winningPattern.push({'index': patIndex,'combination': [...combination.values()], 'colCount': columnCount, 'blocks': blocks});
        counter++;
      }
    });



    return winningPattern;
  }

  // ONLY ALLOW VALID COMBINATIONS
  private combinationValidation(combination: Array<any>): boolean {
    if(combination.length == 1 && !combination.find(val => val == 4))
      return true
    if(combination.length == 2 && combination.find(val => val == 11) && !(combination.find(val => val == 4)))
      return true
    return false
  }

  public getTotalWin(result: Array<any>){
    let totalWin = 0;

    result.forEach(res => {
      totalWin += this.computePayOut(res);
    });

    return totalWin;
  }

  // COMPUTE THE PAYOUT FOR BLOCK COMBINATIONS
  private computePayOut(winPattern: any) {
    const {blocks, colCount} = winPattern;
    let pay: number = 0;
    let payLine = Helpers.getKeyValue(Paylines)(`lines-${colCount}` as keyof typeof Paylines);

    blocks.forEach((val: number) => {
      pay += Helpers.getKeyValue(Payouts)(`char-${val}` as keyof typeof Payouts);
    })

    pay *= payLine;
    pay *= this.RTP;
    pay *= this.bet;
    return pay;
  }
}