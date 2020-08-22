import { GameController } from './game-controller'

const canvas = document.querySelector('#c')
const gameController = new GameController(canvas)
requestAnimationFrame(gameController.animate.bind(gameController))
