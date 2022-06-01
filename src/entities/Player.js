import Phaser from 'phaser'
import HealthBar from '../hud/HealthBar'
import initAnimations from './anims/playerAnims'
import collidable from '../mixins/collidable'
import anims from '../mixins/anims'
import Projectiles from '../atacks/Projectiles'

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')

    // adding the sprite context
    scene.add.existing(this)
    // adding physics context
    scene.physics.add.existing(this)

    // Mixins (I hate them)
     Object.assign(this, collidable)
     Object.assign(this, anims)
     // this = {...this, ...collidable}

    this.init()
    this.initEvents()
  }

  init() {
    this.gravity = 500
    this.playerSpeed = 150
    this.jumpCount = 0
    this.consecutiveJumps = 1
    this.hasBeenHit = false
    this.bounceVelocity = 250
    this.cursors = this.scene.input.keyboard.createCursorKeys()

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT

    this.projectiles = new Projectiles(this.scene)
    this.health = 100
    this.hp = new HealthBar(
      this.scene,
      this.scene.config.leftTopCornerPosition.x + 5,
      this.scene.config.leftTopCornerPosition.y + 5,
      1.7,
      this.health
    )
    this.setSize(20, 35)
    this.body.setGravityY(500)
    this.setCollideWorldBounds(true)
    this.setOrigin(0.5, 1)

    initAnimations(this.scene.anims)

    this.scene.input.keyboard.on('keydown-Q', () => {
      this.play('throw', true)
      this.projectiles.fireProjectile(this)
    })
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
    if(this.hasBeenHit) return
    const { left, right, space, up } = this.cursors
    const isOnFloor = this.body.onFloor()
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up)

    if(this.isPlayingAnims('throw')) {
      return
    }

    isOnFloor ?
      this.body.velocity.x !== 0 ? 
        this.play('run', true):
        this.play('idle', true) :
      this.play('jump', true)
 
     if((isOnFloor || this.jumpCount < this.consecutiveJumps)
      && (isSpaceJustDown || isUpJustDown)) {
        this.setVelocityY(-(this.playerSpeed * 1.8))
        this.jumpCount++
    }

    if(isOnFloor) {
      this.jumpCount = 0
    }

    if(left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT
      this.setVelocityX(-this.playerSpeed)
      this.setFlipX(true)
      return
    }

    if(right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
      this.setVelocityX(this.playerSpeed)
      this.setFlipX(false)
      return
    }

    this.setVelocityX(0)
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff
    })
  }

  bounceOff() {
    this.body.touching.right ?
      this.setVelocityX(-this.bounceVelocity, -this.bounceVelocity) :
      this.setVelocityX(this.bounceVelocity)

    setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0)      
  }

  takesHit(inititator) {
    if(this.hasBeenHit) return
    this.hasBeenHit = true
    this.bounceOff()
    const hitAnim = this.playDamageTween()

    this.health -= inititator.damage
    this.hp.decrease(this.health)
    
    this.scene.time.delayedCall(2000, () => { 
      this.hasBeenHit = false
      hitAnim.stop()
      this.clearTint()
    })
  }
}

export default Player