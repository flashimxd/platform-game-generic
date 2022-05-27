import Phaser from 'phaser'
import collidable from '../mixins/collidable'

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key)
    this.config = scene.config
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setImmovable(true)
    Object.assign(this, collidable)

    this.init()
    this.initEvents()
  }

  init() {
    this.gravity = 500
    this.speed = 50
    this.timeSinceLastTurn = 0
    this.maxPatrolDistance = 200
    this.currentPatrolDistance = 0
    this.damage = 10
    this.platformCollidersLayer = null
    this.rayGraphics = this.scene.add.graphics({ lineStyle: {
      width: 2,
      color: 0xaa00aa
    }})

    this.body.setGravityY(500)
    this.setSize(20, 45)
    this.setOffset(10, 20)
    this.setCollideWorldBounds(true)
    this.setOrigin(0.5, 1)
    this.setVelocityX(this.speed)
  }

  initEvents(time, delta) {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }
  
  getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  update(time) {
    this.patrol(time)
  }

  patrol(time) {
    if(!this.body || !this.body.onFloor()) return
    this.currentPatrolDistance += Math.abs(this.body.deltaX())
    const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer,{
      raylength: 30, precision: 5, steepnes: 0.2 
    })

    if((!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
      this.timeSinceLastTurn + 200 < time) {
        this.setFlipX(!this.flipX)
        this.setVelocityX(this.speed = -this.speed)
        this.timeSinceLastTurn = time
        this.maxPatrolDistance = this.getRandomNumberBetween(100, 280)
        this.currentPatrolDistance = 0
    }


    if(this.config.debug && ray) {
      this.rayGraphics.clear()
      this.rayGraphics.strokeLineShape(ray)
    }
  }

  setPlatformColliders(platformCollidersLayer) {
    this.platformCollidersLayer = platformCollidersLayer
  }
}

export default Enemy