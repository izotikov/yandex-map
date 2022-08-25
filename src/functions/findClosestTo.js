
// Код нахождения ближайшей точки МКАД.

export function findClosestTo(mkadCords, markerCords) {
  let tempCordsArr = [];
  let digitsArr =[];
  for (let i=0; i < mkadCords.length; i++) {
    let d = Math.sqrt(Math.pow(markerCords[0] - mkadCords[i][0], 2) + Math.pow(markerCords[1] - mkadCords[i][1], 2));
    let newobj = {id: i, digit: d};
    tempCordsArr.push(newobj);
    digitsArr.push(d);
  }
  let closest = tempCordsArr.find(elem => Math.min(...digitsArr) === elem.digit);
  return mkadCords[closest.id];
}