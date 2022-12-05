import {Reel, Rows, Pattern, BonusNumber} from './settings.json';

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

    //CHECK BONUS COMBINATION
    reels.forEach((reel, index) => {  
      let bonusBlocks = reel.filter(val => val == BonusNumber);
      if(bonusBlocks.length > 0)
        bonusWin++
    });

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
}