import Functions from '../../Functions';
import Helpers from './Helpers';
import {Reel, Pattern, Payouts, Paylines, BonusNumber, Rows} from './settings.json';

export default class SlotFunctions {
  private bet: number;
  private RTP: number;
  private totalCombination: number = 1;
  private repeat: number = 10000;
  private lowestLineCombination: number = 3;
  private baseMoney:number = 100000000;
  private money!:number;
  private beforeMoney!:number;
  private bonusWin: boolean = false;

  //STATISTICS VARIABLES
  private winCount: number = 0;
  private highestBalance: number = 0;
  private totalSpin: number = 0;
  private winCountAll: number = 0;
  private lines: Array<number> = [0, 0, 0];
  private bonusWinCount: number = 0;
  private blocksWinrate: Array<number> = [];
  private uniqueWinPatterns: any = [];
  private sumOfUniquePatterns: number = 0;
  private bonusPattern: string = '';

  constructor(bet: number, RTP: number) {
    this.bet = bet;
    this.RTP = RTP;
    this.money = this.baseMoney; // FOR STATISTICS ONLY
    this.beforeMoney = this.baseMoney; // FOR STATISTICS ONLY

    this.init();
  }

  // INITIALIZE VARIABLES
  private init() {
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

  // GENERATE TEST REEL RESULTS (YOU CAN SET HOW MANY SPINS)
  public testResult() {
    let reelResult:Array<Array<Array<number>>> = [];
    let rep!:number;
    this.winCount = 0;
    
    for(rep = 0; rep < this.repeat; rep++){
      if(this.bet > this.money){
        console.log('Insufficient Balance!:', this.money);
        continue;
      }

      this.money-= this.bet;
      this.totalSpin++;
      
      reelResult.push([]);

      Reel.forEach((reel, rIndex) => {
        reelResult[rep].push([]);

        for(let row = 0; row < 3; row++){
          reelResult[rep][rIndex].push(reel[Math.floor(Math.random() * reel.length)]);
        }

      })


      let winnings = this.checkWin(reelResult[rep]);

      if(winnings.length > 0 || this.bonusWin)
        this.winFunction(winnings)
    }

    // LOG IMPORTANT STATISTICS
    let result = this.beautifyResult(reelResult);
    // console.log(result);
    
    console.log('repeat spin:', rep);
    console.log('current balance:', this.money);
    console.log('Total Repeat Win Count:', this.winCount);
    console.log('Overall Win Count:', this.winCountAll);
    console.log('Total Spins:', this.totalSpin);
    console.log('Highest Balance:', this.highestBalance);
    console.log('5 lines won:', this.lines[0]);
    console.log('4 lines won:', this.lines[1]);
    console.log('3 lines won:', this.lines[2]);
    console.log('Bonus Total Count:', this.bonusWinCount);
    console.log('Win Percentage', `${(this.winCountAll/this.totalSpin)*100}%`);
    console.log('Total Payout Percentage', `${(this.money/this.baseMoney)*100}%`);
    console.log('Total Repeat Payout Percentage', `${(this.money/this.beforeMoney)*100}%`);

    // console.log('Unique Patterns and Pay:', this.uniqueWinPatterns);
    console.log('RTP:', this.sumOfUniquePatterns/(this.totalCombination*this.bet));

    // this.blocksWinrate.forEach((winrate, index) => {
    //   console.log(`${index}'s winrate:`, winrate);
    // })

    return result;
  }

  // FOR BETTER DISPLAY OF REELS RESULT
  private beautifyResult (result: Array<Array<Array<number>>>){
    let beautifiedRes: Array<Array<Array<number>>> = [];
    
    result.forEach((reels, spinIndex) => {
      beautifiedRes.push([]);

      reels.forEach(reel => {
        
        reel.forEach((symbol, index) => {
          if(!beautifiedRes[spinIndex][index])
            beautifiedRes[spinIndex][index] = []

          beautifiedRes[spinIndex][index].push(symbol);
        })
  
      })
  
    })
  
    return beautifiedRes;
  }

  // CHECK FOR WINNING PATTERNS
  private checkWin (reels: Array<Array<number>>) {
    let winningPattern: Array<any> = [];
    Pattern.forEach((pat, patIndex) => {
      let counter = 0;
      let bonusCount!:number;
  
      while(counter != this.lowestLineCombination){
        const combination = new Set();
        let blocks: Array<number> = [];
        let columnCount = pat.length - counter;
        bonusCount = 0
  
        reels.forEach((reel, index) => {
          if(index < (columnCount)){
            combination.add(reel[pat[index] - 1])
            blocks.push(reel[pat[index] - 1]);

            //CHECK BONUS COMBINATION
            let bonusBlocks = reel.filter(val => val == BonusNumber);
            if(bonusBlocks.length > 0)
              bonusCount++
            if(bonusCount == 3)
              this.bonusWin = true;
          }
        });
        
        if (this.combinationValidation([...combination.values()]))
        winningPattern.push({'index': patIndex,'combination': [...combination.values()], 'colCount': columnCount, 'blocks': blocks});
        counter++;
      }
      
    });
    this.bonusPattern = '';
    reels.forEach(reel => {
      if(reel !== undefined)
        this.bonusPattern += `${reel.join('-')}-`;
    })
    
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

  // UPDATE VARIABLES AFTER WINNING SPINS
  private winFunction(winnings: Array<any>) {
    if(this.bonusWin){
      this.bonusWin = false;
      this.money += this.computeBonusPayOut();
      this.bonusWinCount++;

      if(this.uniqueWinPatterns[this.bonusPattern] === undefined){
        let combinations = 2;
        this.sumOfUniquePatterns += (this.computeBonusPayOut());
        this.uniqueWinPatterns[this.bonusPattern] = (this.computeBonusPayOut());
      }
    }

    winnings.forEach(win => {
      // this.uniqueWinPatterns[`${}`]
      

      let index = Pattern[win.index].length - win.colCount;
      this.money += this.computePayOut(win);
      this.lines[index]++;
      this.winCount++;
      this.winCountAll++;

      let wildCount = win.blocks.filter((block:number) => block == 11);

      // console.log('Winning Combination: ', `${win.combination} --- PAY:  ${this.computePayOut(win)} --- LINES:  ${win.colCount} ---  WILDCOUNT: ${wildCount.length}`);
      if(this.blocksWinrate[win.combination.join('')] === undefined)
        this.blocksWinrate[win.combination.join('')] = 1;
      this.blocksWinrate[win.combination.join('')] += 1;
  
      if(this.highestBalance < this.money)
        this.highestBalance = this.money;
      
      const uniquePattern = win.blocks.join('-');
      if(this.uniqueWinPatterns[uniquePattern] === undefined){
        let multiplier = 1;
        if(win.blocks.length == 3)
          multiplier = 30;
        if(win.blocks.length == 4)
          multiplier = 900;
        let combinations = 1;
        win.blocks.forEach((block:number, index: number) => {
          combinations *= Reel[index].filter((val) => val == block).length;
        })
        this.sumOfUniquePatterns += (this.computePayOut(win) * (combinations * multiplier));
        this.uniqueWinPatterns[uniquePattern] = (this.computePayOut(win) * (combinations * multiplier));
      }
    })
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
  private computeBonusPayOut() {
    let payLine = Helpers.getKeyValue(Paylines)(`lines-${3}` as keyof typeof Paylines);
    let payOut = (((Helpers.getKeyValue(Payouts)(`char-${BonusNumber}` as keyof typeof Payouts) * 3) * payLine) * this.RTP) * this.bet;
    let randPayout = Functions.randMinMax(payOut/4,payOut*1.75);
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