const objGroupAnimation = (array: any) => {
  interface Animation {
    sprite: any;
    destination: number,
  }
  const arr: Animation[] = [];

  array.forEach((element: any) => {
    const {sprite, destination} = element;

    const arrTmp: Animation = {
      sprite: sprite,
      destination: destination
    }

    arr.push(arrTmp);
  })

  return arr;
}

const randMinMax = (min:number, max:number) => {
  let random = Math.random() * (max - min) + min;

  return random;
}

export default {
  objGroupAnimation,
  randMinMax
}