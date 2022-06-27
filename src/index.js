import Phaser from "phaser"
import PlayScene from './scenes/Play'
import PreloadScene from './scenes/Preload'
import MenuScene from './scenes/MenuScene'
import LevelScene from './scenes/LevelScene'
import CreditsScene from './scenes/CreditsScene'

const MAP_WIDTH = 1600
const WIDTH = document.body.offsetWidth
const HEIGHT = 600
const ZOOM_LEVEL = 1.5

const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomLevel: ZOOM_LEVEL,
  debug: false,
  leftTopCornerPosition: {
    x: (WIDTH - (WIDTH / ZOOM_LEVEL)) / 2,
    y: (HEIGHT - (HEIGHT / ZOOM_LEVEL)) / 2
  },
  rightTopCornerPosition: {
    x: ((WIDTH / ZOOM_LEVEL) + ((WIDTH - (WIDTH / ZOOM_LEVEL)) / 2)),
    y: (HEIGHT - (HEIGHT / ZOOM_LEVEL)) / 2
  },
  rightBottomCornerPosition: {
    x: ((WIDTH / ZOOM_LEVEL) + ((WIDTH - (WIDTH / ZOOM_LEVEL)) / 2)),
    y: ((HEIGHT / ZOOM_LEVEL) + ((HEIGHT - (HEIGHT / ZOOM_LEVEL)) / 2))
  },
  lastLevel: 2
}

const Scenes = [PreloadScene, MenuScene, LevelScene, PlayScene, CreditsScene]

const initScene = () => Scenes.map(Scene => new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: SHARED_CONFIG.debug
    }
  },
  scene: initScene()
}

new Phaser.Game(config)