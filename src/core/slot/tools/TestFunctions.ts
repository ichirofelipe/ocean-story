
import Functions from '../../Functions';
import Helpers from './Helpers';
import {Reel, Pattern, Payouts, Paylines, BonusNumber, Rows, Formula} from './settings.json';

export default class TestFunctions {
  private bet: number;
  private RTP: number;
  private totalCombination: number = 1;
  private repeat: number = 1000;
  private lowestLineCombination: number = 3;
  private baseMoney:number = 100000;
  private money!:number;
  private beforeMoney!:number;
  private bonusWin: number = 0;

  //STATISTICS VARIABLES
  private winCount: number = 0;
  private highestBalance: number = 0;
  private totalDrop: number = 0;
  private winCountAll: number = 0;
  private lines: Array<number> = [0, 0, 0];
  private bonusWinCount: number = 0;
  private blocksWinrate: Array<number> = [];
  private jsonCombination: Array<object> = [];
  private uniqueWinPatterns: any = [];
  private bonusWinPatterns: Array<string> = [];
  private sumOfUniquePatterns: number = 0;
  private totalBonusCombination: number = 0;
  private totalNormalCombination: number = 0;
  private bonusPattern: string = '';
  private formula: Array<object>;
  private plinkoReel: Array<number> = [1,1,1,1,1,1,2,2,2,3,4,5,5,5];
  private leftbar: number = 0;
  private rightbar: number = 0;
  private fishTotal: number = 0;
  private treasureTotal: number = 0;
  private waterTotal: number = 0;

  constructor(bet: number, RTP: number) {
    this.bet = bet;
    this.RTP = RTP;
    this.money = this.baseMoney; // FOR STATISTICS ONLY
    this.beforeMoney = this.baseMoney; // FOR STATISTICS ONLY
    this.formula = Formula;

    this.init();
  }

  // INITIALIZE VARIABLES
  private init() {
    Reel.forEach( reel => {
      this.totalCombination *= reel.length;
    })

    // this.setJSONCombinations();
  }

  //INITIALIZE JSON COMBINATIONS FROM LOCAL STORAGE
  private setJSONCombinations() {
    this.jsonCombination = JSON.parse(localStorage.getItem('NormalPatterns')!) ?? [];
    this.bonusWinPatterns = localStorage.getItem('BonusWinPatterns')?.split('/') ?? [];
    let bonusWinPay = localStorage.getItem('BonusWinPay') ?? 0;
    if(this.jsonCombination){
      this.jsonCombination.forEach((com: any) => {
        let paramIndex: string = com.pattern;
        if(this.uniqueWinPatterns[paramIndex] === undefined){
          this.uniqueWinPatterns[paramIndex] = com.pay;
          this.sumOfUniquePatterns+= com.pay;
        }
      })
    }

    this.bonusWinPatterns.forEach(pat => {
      this.sumOfUniquePatterns += Number(bonusWinPay);
    })
    
    console.log(this.uniqueWinPatterns);
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
      
      let plinkoSymbol = this.plinkoReel[Math.floor(Math.random() * this.plinkoReel.length)];
      this.money-= this.bet;
      this.totalDrop++;

      if(reelResult[rep] === undefined){
        reelResult.push([]);
      }

      // if(plinkoSymbol == 1){

        Reel.forEach((reel, rIndex) => {
          
          if(reelResult[rep][rIndex] === undefined){
            reelResult[rep].push([]);
          }

          for(let row = 0; row < 3; row++){
            reelResult[rep][rIndex].push(reel[Math.floor(Math.random() * reel.length)]);
          }
          
        })


        let winnings = this.checkWin(reelResult[rep]);

        if(winnings.length > 0 || this.bonusWin)
          this.winFunction(winnings)
      // }
      // else if (plinkoSymbol == 2){
      //   this.money += this.bet/2;
      //   this.fishTotal++;
      // }
      // else if (plinkoSymbol == 4){
      //   this.money += this.bet*2;
      //   this.treasureTotal++;
      // }
      // else if (plinkoSymbol == 5){
      //   if(Math.floor(Math.random() * 2) == 0){
      //     this.leftbar+=1;
      //   }
      //   else{
      //     this.rightbar+=1;
      //   }

      //   if(this.leftbar >= 50 || this.rightbar >= 50){
      //     this.money += (this.bet * 40);
      //     this.leftbar = 0;
      //     this.rightbar = 0;
      //     this.waterTotal++;
      //   }
      // }
    }

    // LOG IMPORTANT STATISTICS
    let result = this.beautifyResult(reelResult);
    // console.log(result);
    
    // console.log('repeat spin:', rep);
    // console.log('current balance:', this.money);
    // console.log('Total Repeat Win Count:', this.winCount);
    // console.log('Overall Win Count:', this.winCountAll);
    console.log('Total Drops:', this.totalDrop);
    // console.log('Highest Balance:', this.highestBalance);
    // console.log('5 lines won:', this.lines[0]);
    // console.log('4 lines won:', this.lines[1]);
    // console.log('3 lines won:', this.lines[2]);
    console.log('Bonus Total Count:', this.bonusWinCount);
    console.log('Win Percentage', `${(this.winCountAll/this.totalDrop)*100}%`);
    console.log('Total Payout Percentage', `${(this.money/this.baseMoney)*100}%`);
    console.log('Total Repeat Payout Percentage', `${(this.money/this.beforeMoney)*100}%`);
    console.log('Left Bar Status', this.leftbar);
    console.log('Right Bar Status', this.rightbar);
    console.log('Fish Total', this.fishTotal);
    console.log('Treasure Total', this.treasureTotal);
    console.log('Water Total', this.waterTotal);
    // console.log('Unique Patterns and Pay:', this.uniqueWinPatterns);
    // console.log('Total Normal Combination:', this.totalNormalCombination);
    // console.log('Total Bonus Combination Count:', this.totalBonusCombination);
    // console.log('Unique Patterns Length:', this.jsonCombination.length);
    // console.log('RTP:', this.sumOfUniquePatterns/(this.totalCombination*this.bet));
    // console.log('Total Sum Combinations:', this.formula);
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
    this.bonusWin = 0;

    //CHECK BONUS COMBINATION
    // reels.forEach((reel, index) => {  
    //   let bonusBlocks = reel.filter(val => val == BonusNumber);
    //   if(bonusBlocks.length > 0)
    //     this.bonusWin++
    // });

    Pattern.forEach((pat, patIndex) => {
      let counter = 0;
  
      while(counter != this.lowestLineCombination){
        const combination = new Set();
        let blocks: Array<number> = [];
        let columnCount = pat.length - counter;
        reels.forEach((reel, index) => {

          if(index < (columnCount)){
            combination.add(reel[pat[index] - 1])
            blocks.push(reel[pat[index] - 1]);
          }
        });
        if (this.combinationValidation([...combination.values()]))
        winningPattern.push({'index': patIndex,'combination': [...combination.values()], 'colCount': columnCount, 'blocks': blocks});
        counter++;
      }
      
    });

    if(this.bonusWin >= 3){
      this.bonusPattern = '_';
      reels.forEach((reel, index) => {
        let columnChecked = false;
        // if(index == 0 || index == reels.length - 1)
        //   return;
        // if(reel !== undefined)
        //   this.bonusPattern += `${reel.join('-')}-`;
        reel.forEach((block,bIndex) => {
          if(block == 4 && !columnChecked){
            this.bonusPattern += `${index}-${bIndex}/`;
            columnChecked = true;
          }
        })
      })
    }
    
    
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
    if(this.bonusWin >= 3){
      this.money += this.computeBonusPayOut();
      this.bonusWinCount++;

      if(this.uniqueWinPatterns[this.bonusPattern] === undefined){
        this.sumOfUniquePatterns += this.computeBonusPayOut();
        this.totalBonusCombination++;
        this.uniqueWinPatterns[this.bonusPattern] = this.computeBonusPayOut();

        this.formula.forEach((eq: any) => {
          if(eq.lines == this.bonusWin && eq.wilds == 0 && eq.symbol == 4)
            eq.total -= this.computeBonusPayOut();
        })
      }
    }

    winnings.forEach(win => {

      let index = Pattern[win.index].length - win.colCount;
      this.money += this.computePayOut(win);
      this.lines[index]++;
      this.winCount++;
      this.winCountAll++;

      let symbol = win.combination[0];
      let wildCount = [];
      if(win.combination.length > 1){
        wildCount = win.blocks.filter((block:number) => block == 11);
        symbol = win.blocks.find((block:number) => block != 11);
      }

      // console.log('Winning Combination: ', `${win.combination} --- PAY:  ${this.computePayOut(win)} --- LINES:  ${win.colCount} ---  WILDCOUNT: ${wildCount.length}`);
      if(this.blocksWinrate[win.combination.join('')] === undefined)
        this.blocksWinrate[win.combination.join('')] = 1;
      this.blocksWinrate[win.combination.join('')] += 1;
  
      if(this.highestBalance < this.money)
        this.highestBalance = this.money;
      
      const uniquePattern = win.blocks.join('-');
      if(this.uniqueWinPatterns[uniquePattern] === undefined){
        let multiplier = 1;
        let combinations = 1;

        if(win.blocks.length == 4)
          multiplier = 30;
        if(win.blocks.length == 3)
          multiplier = 900;

        win.blocks.forEach((block:number, index: number) => {
          combinations *= Reel[index].filter((val) => val == block).length;
        })
        
        this.totalNormalCombination++;
        this.sumOfUniquePatterns += (this.computePayOut(win) * (combinations * multiplier * Pattern.length));
        this.uniqueWinPatterns[uniquePattern] = (this.computePayOut(win) * (combinations * multiplier * Pattern.length));
        this.formula.forEach((eq: any) => {
          if(eq.lines == win.blocks.length && eq.wilds == wildCount.length && eq.symbol == symbol)
            eq.total -= (this.computePayOut(win) * (combinations * multiplier * Pattern.length));
        })
        // this.jsonCombination.push({
        //   pattern: uniquePattern,
        //   pay: (this.computePayOut(win) * (combinations * multiplier)),
        //   isBonus: false
        // })
        // localStorage.setItem('NormalPatterns', JSON.stringify(this.jsonCombination));
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
    let payLine = Helpers.getKeyValue(Paylines)(`lines-${this.bonusWin}` as keyof typeof Paylines);
    let payOut = (((Helpers.getKeyValue(Payouts)(`char-${BonusNumber}` as keyof typeof Payouts) * this.bonusWin) * payLine) * this.RTP) * this.bet;
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