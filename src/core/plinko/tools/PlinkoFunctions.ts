import * as PIXI from 'pixi.js';

const checkCoinHit = (coin: PIXI.Graphics, pin: PIXI.Graphics): any => {
  let distance = Math.sqrt(Math.pow(coin.x - pin.x, 2) + Math.pow(coin.y - pin.y, 2));
  let coindRad = coin.height / 2;
  let pinRad = pin.height / 2;
  let hitPosition = coin.x - pin.x;

  if(distance <= coindRad - pinRad){
    console.log('1');
    return hitPosition;
  }
  else if(distance <= pinRad - coindRad){
    console.log('2');
    return hitPosition;
  }
  else if(distance < pinRad + coindRad){
    console.log('3');
    return hitPosition;
  }
  else if(distance == pinRad + coindRad){
    console.log('4');
    return hitPosition;
  }
  else {
    return false;
  }

}

export default {
  checkCoinHit
}