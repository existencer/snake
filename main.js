import { Game } from './src/game'
import io from 'socket.io-client'
let socket = window.socket = io({
  transports: ['websocket']
})

socket.on('init', data => {
  console.log(data)
  window.game = new Game(document.getElementById('game'), socket, data)
})