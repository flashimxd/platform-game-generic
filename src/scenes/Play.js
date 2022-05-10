import Phaser from 'phaser'
import Player from '../entities/Player'
import Enemies from '../groups/Enemies'
class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene')
    this.config = config
  }

  create() {
    const map = this.createMap()
    const layers = this.createLayers(map)
    const playerZonesLayer = this.getPlayerZones(layers.playersZones)
    const player = this.createPlayer(playerZonesLayer.start)
    const enemies = this.createEnemies(layers.enemySpawns)

    this.createPlayerCollider(player, {
      colliders: {
        platformsColliders: layers.platColliderLayer
      }
    })

    this.createEnemiesCollider(enemies, {
      colliders: {
        platformsColliders: layers.platColliderLayer,
        player
      }
    })

    this.createEndOfLevel(playerZonesLayer.end, player)
    this.setUpFollowUpCameraOn(player)
  }

  createPlayerCollider(player, { colliders }) {
    player.addCollider(colliders.platformsColliders)
  }

  createEnemiesCollider(enemies, { colliders }) {
    enemies.forEach(enemy => {
      enemy
        .addCollider(colliders.platformsColliders)
        .addCollider(colliders.player)
    })
  }

  getPlayerZones(playerZonesLayer) {
    return {
      start: playerZonesLayer.find(zone => zone.name === 'startZone'),
      end: playerZonesLayer.find(zone => zone.name === 'endZone')
    }
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
    const playersZones = map.getObjectLayer('players_zones').objects
    const enemySpawns = map.getObjectLayer('enemy_spawn').objects

    platColliderLayer.setCollisionByProperty({ collides: true})

    return {
      platLayer,
      envLayer,
      platColliderLayer,
      playersZones,
      enemySpawns
    }
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y)
  }

  createEnemies(spawnLayers) {
    const enemies = new Enemies(this)
    const enemyTypes = enemies.getTypes()
    
    spawnLayers.map(spawnPoint => {
      const enemy =  new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y)
      enemy.add(enemy)
    })

    return enemies
  }

  createEndOfLevel(end, player) {
    const endOfLevelObj = this.physics.add.sprite(end.x, end.y, 'end')
      .setSize(5, this.config.height)
      .setAlpha(0)
      .setOrigin(0.5, 1)

      const eolOverlap = this.physics.add.overlap(player, endOfLevelObj, () => {
        alert('YOU WIN! (Nothing)')
        eolOverlap.active = false
      })
  }
}

export default Play