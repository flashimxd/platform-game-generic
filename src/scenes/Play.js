import Phaser from 'phaser'
import Player from '../entities/Player'
import Enemies from '../groups/Enemies'
import initAnims from '../anims'

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
    const enemies = this.createEnemies(layers.enemySpawns, layers.platColliderLayer)

    console.log('enemies.getProjectiles()', enemies.getProjectiles())
    this.createPlayerCollider(player, {
      colliders: {
        platformsColliders: layers.platColliderLayer,
        projectiles: enemies.getProjectiles()
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
    initAnims(this.anims)
  }

  finishDrawing(pointer, layer) {
    this.line.x2 = pointer.worldX
    this.line.y2 = pointer.worldY
    
    this.graphics.clear()
    this.graphics.strokeLineShape(this.line)

    this.tileHits = layer.getTilesWithinShape(this.line)
    if(this.tileHits.length > 0) {
      this.tileHits.forEach(tile => {
        tile.index !== -1 && tile.setCollision(true)
      })
    }

    this.drawDebug(layer)
    this.plotting = false
  }

  createPlayerCollider(player, { colliders }) {
    player
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.projectiles, this.onWeaponHit)
  }

  onPlayerCollision(enemy, player) {
    player.takesHit(enemy)
  }

  onWeaponHit(entity, source) {
    console.log('on weapon hit', {entity, source})
    entity.takesHit(source)
  }

  createEnemiesCollider(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.player, this.onPlayerCollision)
      .addCollider(colliders.player.projectiles, this.onWeaponHit)
      .addOverlap(colliders.player.meeleWeapon, this.onWeaponHit)
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

  createEnemies(spawnLayers, platColliderLayer) {
    const enemies = new Enemies(this)
    const enemyTypes = enemies.getTypes()
    
    spawnLayers.map(spawnPoint => {
      const enemy =  new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y)
      enemy.setPlatformColliders(platColliderLayer)
      enemies.add(enemy)
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