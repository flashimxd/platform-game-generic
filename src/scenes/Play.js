import Phaser from 'phaser'
import Player from '../entities/Player'
import Enemies from '../groups/Enemies'
import initAnims from '../anims'
import Collectables from '../groups/Collectables'
import Hud from '../hud'
import EventEmitter from '../events/Emitter'
class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene')
    this.config = config
  }

  create({ gameStatus }) {
    this.score = 0
    this.hud = new Hud(this, 0, 0)

    this.playBGMusic()

    const map = this.createMap()

    initAnims(this.anims)

    const layers = this.createLayers(map)
    const playerZonesLayer = this.getPlayerZones(layers.playersZones)
    const player = this.createPlayer(playerZonesLayer.start)
    const enemies = this.createEnemies(layers.enemySpawns, layers.platColliderLayer)
    const collectables = this.createCollectables(layers.collectables)
    this.coinPickUpSound = this.sound.add('coin-pickup', { volume: 0.3 })

    this.createBG(map)

    this.createPlayerCollider(player, {
      colliders: {
        platformsColliders: layers.platColliderLayer,
        projectiles: enemies.getProjectiles(),
        collectables,
        traps: layers.traps
      }
    })

    this.createEnemiesCollider(enemies, {
      colliders: {
        platformsColliders: layers.platColliderLayer,
        player
      }
    })

    this.createBackButton()
    this.createEndOfLevel(playerZonesLayer.end, player)
    this.setUpFollowUpCameraOn(player)

    if(gameStatus === 'PLAYER_LOSE') return

    this.createGameEvents()
  }

  createPlayerCollider(player, { colliders }) {
    player
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.traps, this.onHit)
      .addCollider(colliders.projectiles, this.onHit)
      .addOverlap(colliders.collectables, this.onCollect, this)
  }

  onPlayerCollision(enemy, player) {
    player.takesHit(enemy)
  }

  onHit(entity, source) {
    entity.takesHit(source)
  }

  onCollect(entity, collectable) {
    this.score += collectable.score
    this.hud.updateScoreBoard(this.score)
    this.coinPickUpSound.play()
    collectable.disableBody(true, true)
  }

  createBackButton() {
    const btn = this.add.image(this.config.rightBottomCornerPosition.x, this.config.rightBottomCornerPosition.y, 'back')
      .setOrigin(1)
      .setScrollFactor(0)
      .setScale(2)
      .setInteractive()

    btn.on('pointerup', () => {
      this.scene.start('MenuScene')
    })
  }

  playBGMusic() {
    if(this.sound.get('theme')) return
    this.sound.add('theme', {
      loop: true,
      volume: 0.1
    }).play()
  }

  createBG(map) {
    const bgObject = map.getObjectLayer('distance_bg').objects[0]

    this.spikesImage = this.add.tileSprite(bgObject.x, bgObject.y, this.config.width, bgObject.height, 'bg-spikes-dark')
      .setOrigin(0,1)
      .setDepth(-10)
      .setScrollFactor(0, 1)

    this.skyImage = this.add.tileSprite(0, 0, this.config.width, 180, 'sky_play')
      .setOrigin(0,0)
      .setDepth(-11)
      .setScale(1.1)
      .setScrollFactor(0,1)
  }

  createGameEvents() {
    EventEmitter.on('PLAYER_LOSE', () => {
      this.scene.restart({ gameStatus: 'PLAYER_LOSE'})
    })
  }

  createEnemiesCollider(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.player, this.onPlayerCollision)
      .addCollider(colliders.player.projectiles, this.onHit)
      .addOverlap(colliders.player.meeleWeapon, this.onHit)
  }

  createCollectables(colletablesLabel) {
    const collectables = new Collectables(this).setDepth(-1)

    collectables.addFromLayer(colletablesLabel)
    collectables.playAnimation('diamond-shine')

    return collectables
  }

  getPlayerZones(playerZonesLayer) {
    return {
      start: playerZonesLayer.find(zone => zone.name === 'startZone'),
      end: playerZonesLayer.find(zone => zone.name === 'endZone')
    }
  }

  getCurrentLevel() {
    return this.registry.get('level') || 1
  }

  setUpFollowUpCameraOn(player) {
    const { height, width, mapOffset, zoomLevel } = this.config
    this.physics.world.setBounds(0,0, width + mapOffset, height + 200)
    this.cameras.main.setBounds(0,0, width + mapOffset, height).setZoom(zoomLevel)
    this.cameras.main.startFollow(player)
  }

  createMap() {
    const map = this.make.tilemap({ key: `level_${this.getCurrentLevel()}`})
    map.addTilesetImage('main_lev_build_1', 'tiles-1')
    // map.addTilesetImage('main_lev_build_2', 'tiles-2')
    map.addTilesetImage('bg_spikes_tileset', 'bg-spikes-tileset')
    return map
  }

  createLayers(map) {
    const tileset = map.getTileset('main_lev_build_1')
    const tilesetBg = map.getTileset('bg_spikes_tileset')

    map.createStaticLayer('distance', tilesetBg).setDepth(-12)

    const platColliderLayer =  map.createStaticLayer('plataforms_colliders', tileset)
    const envLayer = map.createStaticLayer('env', tileset).setDepth(-2)
    const platLayer =  map.createStaticLayer('platforms', tileset)
    const playersZones = map.getObjectLayer('players_zones').objects
    const enemySpawns = map.getObjectLayer('enemy_spawn').objects
    const collectables = map.getObjectLayer('collectables')
    const traps = map.createStaticLayer('traps', tileset)

    platColliderLayer.setCollisionByProperty({ collides: true})
    traps.setCollisionByExclusion(-1)

    return {
      platLayer,
      envLayer,
      platColliderLayer,
      playersZones,
      enemySpawns,
      collectables,
      traps
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
        eolOverlap.active = false

        if(this.registry.get('level') === this.config.lastLevel) {
          this.scene.start('CreditsScene')
          return
        }

        this.registry.inc('level', 1)
        this.registry.inc('unlocked-levels', 1)
        this.scene.restart({ gameStatus: 'LEVEL_COMPLETED' })
      })
  }
  update() {
    this.spikesImage.tilePositionX = this.cameras.main.scrollX * 0.3
    this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.1
  }
}

export default Play