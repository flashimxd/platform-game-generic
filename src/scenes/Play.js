import Phaser from 'phaser'
import Player from '../entities/Player'

class Play extends Phaser.Scene {

  constructor() {
    super('PlayScene')
  }

  create() {
    const map = this.createMap()
    const layers = this.createLayers(map)
    const player = this.createPlayer()

    this.physics.add.collider(player, layers.platColliderLayer)
  }

  createMap() {
    const map = this.make.tilemap({ key: 'map'})
    map.addTilesetImage('main_lev_build_1', 'tiles-1')
    return map
  }

  createLayers(map) {
    const tileset = map.getTileset('main_lev_build_1')
    const platColliderLayer =  map.createStaticLayer('plataforms_colliders', tileset)
    const envLayer = map.createStaticLayer('env', tileset)
    const platLayer =  map.createStaticLayer('platforms', tileset)

    platColliderLayer.setCollisionByProperty({ collides: true})

    return {
      platLayer,
      envLayer,
      platColliderLayer
    }
  }

  createPlayer() {
    return new Player(this, 100, 250) // this.physics.add.sprite(100, 250, 'player')
  }
}

export default Play