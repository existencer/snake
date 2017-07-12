class Snake {
  constructor(x, y) {
    this.isGrowing = 3
    this.isPreparing = true
    this.face = 'up'
    this.nowFace = 'up'
    this.head = { x, y }
    this.body = []
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
export default Snake