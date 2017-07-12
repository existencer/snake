const defaultMap = new Array()
for (var i = 0; i < 20; i++) {
	defaultMap[i] = new Array()
	for (var j = 0; j < 20; j++) {
		if (i == 0 || j == 0 || i == 19 || j ==19) {
			defaultMap[i][j] = 1
		} else {
			defaultMap[i][j] = 0
		}
	}
}

var Game = function (ele) {
	this._element = ele
	this.init()
	this.start()

}
Game.prototype.init = function() {
	var c = document.createElement('canvas')
	c.width = 600
	c.height = 600
	this._element.append(c)
	this.canvas = c

	this.map = defaultMap
	this.x = this.map.length
	this.y = this.map[0].length
	this.mapWidth = 20 * this.x
	this.mapHeight = 20 * this.y
	this.k = 600 / Math.max(this.mapWidth, this.mapHeight) 

	this.isGaming = false
}
Game.prototype.creatPoints = function() {
	var x, y
	do {
		x = parseInt(Math.random() * (this.x - 2) + 1)
		y = parseInt(Math.random() * (this.y - 2) + 1)
	} while (this.map[x][y] != 0)
	this.map[x][y] = 2
}
Game.prototype.start = function() {
	var x, y
	do {
		x = parseInt(Math.random() * (this.x - 2) + 1)
		y = parseInt(Math.random() * (this.y - 2) + 1)
	} while (this.map[x][y] != 0)
	this.player = new Snake(x, y)
	this.addListener()
	this.map[x][y] = 1
	this.creatPoints()
	this.isGaming = true
	this.draw()

	var self = this
	this.stiv = setInterval(function () {
		if (self.isGaming) {
			var tail = self.player.move()
			var h = self.player.head
			if (self.map[h.x][h.y] == 1 && !self.player.isPreparing) {
				self.gameover()
			} else if (self.map[h.x][h.y] == 2) {
				self.player.isGrowing++
				self.creatPoints()
			} else {
				self.map[h.x][h.y] = 1
			}
			if (tail) {
				self.map[tail.x][tail.y] = 0
			}
		}
		self.draw()
	}, 120)
}
Game.prototype.draw = function() {
	var ctx = this.canvas.getContext('2d')
	ctx.save()
	ctx.scale(this.k, this.k)
	ctx.clearRect(0, 0, 600, 600)
	for (var i = 0; i < this.x; i++) {
		for (var j = 0; j < this.y; j++) {
			var v = this.map[i][j]
			if (v == 1) {
				ctx.fillStyle = '#999'
			} else if (v == 2) {
				ctx.fillStyle = '#d00'
			} else {
				ctx.fillStyle = '#eee'
			}
			ctx.fillRect(i * 20, j * 20, 19, 19)
		}
	}

	var p = this.player
	if (this.isGaming) {
		var h = p.head
		var b = p.body
		ctx.fillStyle = '#060'
		ctx.fillRect(h.x * 20, h.y * 20, 19, 19)
		ctx.fillStyle = '#090'
		for (var i = 0; i < b.length; i++) {
			ctx.fillRect(b[i].x * 20, b[i].y * 20, 19, 19)
		}
	}
	ctx.restore()
}
Game.prototype.addListener = function() {
	var self = this
	document.onkeydown = function (e) {
		if (!self.player) {
			return
		}
		self.player.isPreparing = false
		switch (e.code) {
			case('KeyW'): if (self.player.nowFace != 'down') self.player.face = 'up'; break
			case('KeyS'): if (self.player.nowFace != 'up') self.player.face = 'down'; break
			case('KeyA'): if (self.player.nowFace != 'right') self.player.face = 'left'; break
			case('KeyD'): if (self.player.nowFace != 'left') self.player.face = 'right'; break
		}
	}
}
Game.prototype.gameover = function() {
	this.isGaming = false
	for (var i = 0; i < this.player.body.length; i++) {
		var b = this.player.body[i]
		this.map[b.x][b.y] = 0
	}
	this.player = null
	alert('GameOver')
}

var Snake = function (x, y) {
	this.isGrowing = 3
	this.isPreparing = true
	this.face = 'up'
	this.nowFace = 'up'
	this.head = {
		x: x,
		y: y
	}
	this.body = []
}
Snake.prototype.move = function() {
	if (this.isPreparing) {
		return
	}
	this.body.unshift({
		x: this.head.x,
		y: this.head.y
	})
	switch (this.face) {
		case ('up'): this.head.y--; break
		case ('down'): this.head.y++; break
		case ('left'): this.head.x--; break
		case ('right'): this.head.x++; break
	}
	this.nowFace = this.face
	if (this.isGrowing) {
		this.isGrowing--
	} else {
		return this.body.pop()
	}
}

var game = new Game(document.getElementById('game'))