import Phaser from "phaser"
import PlayScene from './scenes/Play'
import PreloadScene from './scenes/Preload'

const WIDTH = 1280
const HEIGHT = 600

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
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