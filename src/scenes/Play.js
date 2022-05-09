import Phaser from 'phaser'
import Player from '../entities/Player'

class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene')
    this.config = config
  }

  create() {
    const map = this.createMap()
    const layers = this.createLayers(map)
    const player = this.createPlayer()

    this.createPlayerCollider(player, {
      colliders: {
        platformsColliders: layers.platColliderLayer
      }
    })

    this.setUpFollowUpCameraOn(player)
  }

  createPlayerCollider(player, { colliders }) {
    player.addCollider(colliders.platformsColliders)
  }

  setUpFollowUpCameraOn(player) {
    const { height, width, mapOffset, zoomLevel } = this.config
    this.physics.world.setBounds(0,0, width + mapOffset, height + 200)
    this.cameras.main.setBounds(0,0, width + mapOffset, height).setZoom(zoomLevel)
    this.cameras.main.startFollow(player)
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