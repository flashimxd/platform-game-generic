import Phaser from "phaser"
import PlayScene from './scenes/Play'
import PreloadScene from './scenes/Preload'

const MAP_WIDTH = 1600
const WIDTH = document.body.offsetWidth
const HEIGHT = 600

const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomLevel: 1.7
}

const Scenes = [PreloadScene, PlayScene]

const initScene = () => Scenes.map(Scene => new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: initScene()
}

new Phaser.Game(config)