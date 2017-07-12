import { Game } from './src/game'
import { Map } from './src/map'
window.game = new Game(document.getElementById('game'), new Map())