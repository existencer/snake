const SIDE_LENGTH = 35

export const defaultMap = () => {
  let map = []
  for (var i = 0; i < SIDE_LENGTH; i++) {
    map[i] = []
    for (var j = 0; j < SIDE_LENGTH; j++) {
      if (i == 0 || j == 0 || i == SIDE_LENGTH - 1 || j == SIDE_LENGTH - 1) {
        map[i][j] = 1
      } else {
        map[i][j] = 0
      }
    }
  }
  return map
}

export class Map {
  constructor(map = defaultMap(), x, y) {
    this.map = map
    this.x = x || map.length
    this.y = y || map[0].length
  }
}