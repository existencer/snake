const SIDE_LENGTH = 35

export const defaultMap = () => {
  let map = []
  for (var i = 0; i < SIDE_LENGTH; i++) {
    map[i] = []
    for (var j = 0; j < SIDE_LENGTH; j++) {
      if (i == 0 || j == 0 || i == SIDE_LENGTH - 1 || j == SIDE_LENGTH - 1) {
        map[i][j] = { isReachable: false, entity: 1 }
      } else {
        map[i][j] = { isReachable: true, entity: 0 }
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

  setPoint(type, x, y) {
    switch (type.toLowerCase()) {
    case 'snake':
      this.map[x][y] = { isReachable: false, entity: 2 }
      break
    case 'wall':
      map[x][y] = { isReachable: false, entity: 1 }
      break
    case 'food':
      map[x][y] = { isReachable: true, entity: -1 }
      break
    case 'air':
      map[x][y] = { isReachable: true, entity: 0 }
      break
    }
  }
}