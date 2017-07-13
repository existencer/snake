import { Snake } from './snake'
import { Map } from './Map'

export const BLOCK_LENGTH = 20
export const REFRESH_SPEED = 120
export const SQUARE_SIDE_LENGTH = 800
export class Game {
  constructor(ele, socket, data) {
    this._element = ele
    this.socket = socket
    this.players = {}

    const renewPlayers = (data) => {
      // console.log(data)
      this._scoreEle.innerHTML = ''
      for (let i in data.players) {
        let e = window.document.createElement('li')
        e.innerHTML = data.players[i].name + ':' + data.players[i].score
        this._scoreEle.appendChild(e)
        if (data.players[i].died) {
          this.players[i] = null
          continue
        }
        this.players[i] = new Snake(data.players[i].snake.head.x, data.players[i].snake.head.y, data.players[i].snake.body)
      }
    }

    this.socket.on('newState', data => {
      // console.log(data)
      this.ticks = data.ticks
      this.map = new Map(data.map)
      renewPlayers(data)
    })
    this.socket.on('playerDie', () => {
      window.alert('Game over')
    })

    this.name = data.name
    this.sessionId = data.sessionId
    this.ticks = data.ticks
    this.init(new Map(data.map))

    renewPlayers(data)

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

    this._scoreEle = window.document.getElementById('scoreboard')
  }

  start() {
    this.addListener()
    this.draw()
    this.int = window.setInterval(() => { this.draw() }, REFRESH_SPEED)
  }

  draw() {
    let ctx = this.canvas.getContext('2d')
    ctx.save()
    ctx.scale(this.k, this.k)
    ctx.clearRect(0, 0, SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH)
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        let v = this.map.map[i][j].entity
        if (v == 1) {
          ctx.fillStyle = '#999'
        } else if (v == -1) {
          ctx.fillStyle = '#DA0'
        } else if (v == 0) {
          ctx.fillStyle = '#FFF'
        }
        ctx.fillRect(i * BLOCK_LENGTH, j * BLOCK_LENGTH, 19, 19)
      }
    }

    for (let i in this.players) {
      let p = this.players[i]
      if (!p) {
        continue
      }
      let h = p.head
      let b = p.body
      if (i == this.sessionId) {
        ctx.fillStyle = '#060'
        ctx.fillRect(h.x * BLOCK_LENGTH, h.y * BLOCK_LENGTH, BLOCK_LENGTH - 1, BLOCK_LENGTH - 1)
        ctx.fillStyle = '#090'
        for (let i = 0; i < b.length; i++) {
          ctx.fillRect(b[i].x * BLOCK_LENGTH, b[i].y * BLOCK_LENGTH, BLOCK_LENGTH - 1, BLOCK_LENGTH - 1)
        }
      } else {
        ctx.fillStyle = '#A33'
        ctx.fillRect(h.x * BLOCK_LENGTH, h.y * BLOCK_LENGTH, BLOCK_LENGTH - 1, BLOCK_LENGTH - 1)
        ctx.fillStyle = '#E66'
        for (let i = 0; i < b.length; i++) {
          ctx.fillRect(b[i].x * BLOCK_LENGTH, b[i].y * BLOCK_LENGTH, BLOCK_LENGTH - 1, BLOCK_LENGTH - 1)
        }
      }
    }
    ctx.restore()
  }

  addListener() {
    window.document.onkeydown = (e) => {
      switch (e.code) {
      case 'KeyW':
        this.socket.emit('playerOperate', { forwards: 'up' })
        break
      case 'KeyS':
        this.socket.emit('playerOperate', { forwards: 'down' })
        break
      case 'KeyA':
        this.socket.emit('playerOperate', { forwards: 'left' })
        break
      case 'KeyD':
        this.socket.emit('playerOperate', { forwards: 'right' })
        break
      }
    }
  }
}