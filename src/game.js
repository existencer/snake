import Snake from './snake'

export const BLOCK_LENGTH = 20
export const REFRESH_SPEED = 120
export const SQUARE_SIDE_LENGTH = 800
export class Game {
  constructor(ele, map) {
    this._element = ele
    this.init(map)
    this.start()
  }

  init(map) {
    let c = window.document.createElement('canvas')
    c.width = SQUARE_SIDE_LENGTH
    c.height = SQUARE_SIDE_LENGTH
    this._element.append(c)
    this._element.style.height = SQUARE_SIDE_LENGTH + 'px'
    this._element.style.width = SQUARE_SIDE_LENGTH + 'px'
    this.canvas = c

    this.map = map
    this.x = this.map.x
    this.y = this.map.y
    this.mapWidth = BLOCK_LENGTH * this.x
    this.mapHeight = BLOCK_LENGTH * this.y
    this.k = SQUARE_SIDE_LENGTH / Math.max(this.mapWidth, this.mapHeight)

    this.isGaming = false
  }

  createPoints() {
    let x, y
    do {
      x = parseInt(Math.random() * (this.x - 2) + 1)
      y = parseInt(Math.random() * (this.y - 2) + 1)
    }
    while (this.map.map[x][y])
    this.map.map[x][y] = 2
  }

  start() {
    let x, y
    do {
      x = parseInt(Math.random() * (this.x - 2) + 1)
      y = parseInt(Math.random() * (this.y - 2) + 1)
    }
    while (this.map.map[x][y])
    this.player = new Snake(x, y)
    this.addListener()
    this.map.map[x][y] = 1
    this.createPoints()
    this.isGaming = true
    this.draw()

    let self = this
    this.stiv = window.setInterval(() => {
      if (self.isGaming) {
        let tail = self.player.move()
        let h = self.player.head
        if (self.map.map[h.x][h.y] == 1 && !self.player.isPreparing) {
          self.gameover()
        } else if (self.map.map[h.x][h.y] == 2) {
          self.player.isGrowing++
            self.createPoints()
        } else {
          self.map.map[h.x][h.y] = 1
        }
        if (tail) {
          self.map.map[tail.x][tail.y] = 0
        }
      }
      self.draw()
    }, REFRESH_SPEED)
  }

  draw() {
    let ctx = this.canvas.getContext('2d')
    ctx.save()
    ctx.scale(this.k, this.k)
    ctx.clearRect(0, 0, SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH)
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        let v = this.map.map[i][j]
        if (v == 1) {
          ctx.fillStyle = '#999'
        } else if (v == 2) {
          ctx.fillStyle = '#d00'
        } else {
          ctx.fillStyle = '#FFF'
        }
        ctx.fillRect(i * 20, j * 20, 19, 19)
      }
    }

    let p = this.player
    if (this.isGaming) {
      let h = p.head
      let b = p.body
      ctx.fillStyle = '#060'
      ctx.fillRect(h.x * 20, h.y * 20, 19, 19)
      ctx.fillStyle = '#090'
      for (let i = 0; i < b.length; i++) {
        ctx.fillRect(b[i].x * 20, b[i].y * 20, 19, 19)
      }
    }
    ctx.restore()
  }

  addListener() {
    let self = this
    window.document.onkeydown = function (e) {
      if (!self.player) {
        return
      }
      self.player.isPreparing = false
      switch (e.code) {
      case 'KeyW':
        if (self.player.nowFace != 'down') self.player.face = 'up';
        break
      case 'KeyS':
        if (self.player.nowFace != 'up') self.player.face = 'down';
        break
      case 'KeyA':
        if (self.player.nowFace != 'right') self.player.face = 'left';
        break
      case 'KeyD':
        if (self.player.nowFace != 'left') self.player.face = 'right';
        break
      }
    }
  }

  gameover() {
    this.isGaming = false
    for (let i = 0; i < this.player.body.length; i++) {
      let b = this.player.body[i]
      this.map.map[b.x][b.y] = 0
    }
    this.player = null
    alert('GameOver')
  }
}