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

  // FORMAT RESULT
  public formatResult(reels: Array<Array<number>>) {
    let winningPattern: Array<any> = [];
    let bonusWin = 0;
    let bonusPattern: Array<string> = [];

    //CHECK BONUS COMBINATION
    reels.forEach((reel, reelIndex) => {  
      let bonusBlocks = reel.filter((val, index) => {
        if(val == BonusNumber && index != 0 && index != reels.length - 1)
          return val
      });
      if(bonusBlocks.length > 0)
        bonusWin++
      
      reel.forEach((block,bIndex) => {
        if(block == BonusNumber)
          bonusPattern.push(`${reelIndex}-${bIndex}`);
      })
    });

    // IF THREE OR MORE REELS HAS THE BONUS SYMBOL THEN PASS THE BONUS SYMBOLS INDEXES
    if(bonusWin >= 3){
      console.log('BONUS GAME!');
      winningPattern.push({'index': -1,'combination': bonusPattern, 'colCount': bonusWin});
    }

    // CHECKING OF SATISFIED PATTERNS
    // CHECK THE PATTERNS TO BE SATISFIED IN THE SETTINGS.JSON FILE
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

  // GET THE TOTAL PAYOUT FOR ALL WINNING CHARACTER AND SYMBOL COMBINATION
  public getTotalWin(result: Array<any>){
    let totalWin = 0;

    result.forEach(res => {
      if(res.index != -1)
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

  // COMPUTE THE PAYOUT FOR BONUS COMBINATION
  // THIS IS NOT USED!!!
  public computeBonusPayOut(bonusCount: number) {
    let payLine = Helpers.getKeyValue(Paylines)(`lines-${bonusCount}` as keyof typeof Paylines);
    let payOut = (((Helpers.getKeyValue(Payouts)(`char-${BonusNumber}` as keyof typeof Payouts) * bonusCount) * payLine) * this.RTP) * this.bet;
    // let randPayout = Functions.randMinMax(payOut/4,payOut*1.75);
    // let equation = Functions.randMinMax(1,0);

    // if(equation == 0){
    //   payOut /= (multiplier*1.5)
    // } else {
    //   payOut *= (multiplier/1.5)
    // }
    // console.log(payOut)
    return payOut;
  }
}