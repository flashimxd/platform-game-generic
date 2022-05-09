import Phaser from 'phaser'

class Preload extends Phaser.Scene {

  constructor() {
    super('PreloadScene')
  }
  preload() {
    this.load.tilemapTiledJSON('map', 'assets/maps/crystal_cave.json')
    this.load.image('tiles-1', 'assets/maps/tilesets/main_lev_build_1.png')
    this.load.image('tiles-2', 'assets/maps/tilesets/main_lev_build_2.png')
    // this.load.image('player', 'assets/player/movements/idle01.png')

    this.load.spritesheet('player', 'assets/player/move_sprite_1.png', {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32
    })    
  }

  create() {
    this.scene.start('PlayScene')
  }
}

export default Preload