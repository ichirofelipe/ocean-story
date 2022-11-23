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

export default {
  objGroupAnimation
}