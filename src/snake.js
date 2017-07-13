export class Snake {
  constructor(x, y, body) {
    this.isGrowing = 0
    this.face = ''
    this.nowFace = ''
    this.head = { x, y }
    this.body = []
    if (body && body.length > 0) {
      body.forEach((v) => {
        this.body.push(v)
      })
    }
  }

  move() {
    if (this.isPreparing) {
      return
    }
    this.body.unshift({
      x: this.head.x,
      y: this.head.y
    })
    switch (this.face) {
    case 'up':
      this.head.y--;
      break
    case 'down':
      this.head.y++;
      break
    case 'left':
      this.head.x--;
      break
    case 'right':
      this.head.x++;
      break
    }
    this.nowFace = this.face
    if (this.isGrowing) {
      this.isGrowing--
    } else {
      return this.body.pop()
    }
  }
}