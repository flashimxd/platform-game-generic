import Phaser from 'phaser'
import HealthBar from '../hud/HealthBar'
import initAnimations from './anims/playerAnims'
import collidable from '../mixins/collidable'
import anims from '../mixins/anims'
import Projectiles from '../atacks/Projectiles'
import MeeleWeapon from '../atacks/MeeleWeapon'
import { getTimeStamp } from '../utils/functions'
import EventEmitter from '../events/Emitter'
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
    this.isSliding = false
    this.bounceVelocity = 250
    this.lastAtackTime = null
    this.cursors = this.scene.input.keyboard.createCursorKeys()

    this.jumpSound = this.scene.sound.add('jump', { volume: 0.3 })
    this.propjectileSound = this.scene.sound.add('projectile-launch', { volume: 0.3 })
    this.swordSound = this.scene.sound.add('sword-slice', { volume: 0.3 })
    this.stepSound = this.scene.sound.add('step', { volume: 0.3 })
    this.swipeSound = this.scene.sound.add('swipe', { volume: 0.3 })

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT

    this.projectiles = new Projectiles(this.scene, 'iceball-1')
    this.meeleWeapon = new MeeleWeapon(this.scene, 0, 0, 'sword-default')

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

    this.handleAttacks()
    this.handleMovements()

    this.scene.time.addEvent({
      delay: 350,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if(this.isPlayingAnims('run')) {
          this.stepSound.play()
        }
      }
    })
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  handleAttacks() {
    this.scene.input.keyboard.on('keydown-Q', () => {
      this.play('throw', true)
      this.propjectileSound.play()
      this.projectiles.fireProjectile(this, 'iceball')
    })

    this.scene.input.keyboard.on('keydown-E', () => {

      if(this.lastAtackTime &&
          this.lastAtackTime + this.meeleWeapon.attackSpeed > getTimeStamp()) return

      // this.swipeSound.play()
      this.swordSound.play()
      this.play('throw', true)
      this.meeleWeapon.attack(this)
      this.lastAtackTime = getTimeStamp()
    })
  }

  handleMovements() {
    this.scene.input.keyboard.on('keydown-DOWN', () => {
      if(!this.body.onFloor()) return
      this.body.setSize(this.width, this.height / 2)
      this.setOffset(0, this.height / 2)
      this.setVelocityX(0)
      this.play('slide', true)
      this.isSliding = true
    })
    this.scene.input.keyboard.on('keyup-DOWN', () => {
      this.body.setSize(this.width, 38)
      this.setOffset(0, 0)
      this.isSliding = false
    })
  }

  update() {
    if(this.hasBeenHit || this.isSliding || !this.body) return

    if(this.getBounds().top > this.scene.config.height) {
      EventEmitter.emit('PLAYER_LOSE')
      return
    }    
    const { left, right, space, up } = this.cursors
    const isOnFloor = this.body.onFloor()
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up)

    if(this.isPlayingAnims('throw') || this.isPlayingAnims('slide')) {
      return
    }

    isOnFloor ?
      this.body.velocity.x !== 0 ? 
        this.play('run', true):
        this.play('idle', true) :
      this.play('jump', true)
 
     if((isOnFloor || this.jumpCount < this.consecutiveJumps)
      && (isSpaceJustDown || isUpJustDown)) {
        this.jumpSound.play()
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

  bounceOff(source) {
    if(source.body) {
      this.body.touching.right ?
      this.setVelocityX(-this.bounceVelocity, -this.bounceVelocity) :
      this.setVelocityX(this.bounceVelocity)
    } else {
      this.body.blocked.right ?
      this.setVelocityX(-this.bounceVelocity, -this.bounceVelocity) :
      this.setVelocityX(this.bounceVelocity)
    }

    setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0)      
  }

  takesHit(source) {
    if(this.hasBeenHit) return

    this.health -= source.damage || source.properties.damage || 0

    if(this.health <= 0) {
      EventEmitter.emit('PLAYER_LOSE')
      return
    }

    this.hasBeenHit = true
    this.bounceOff(source)

    const hitAnim = this.playDamageTween()

    this.hp.decrease(this.health)
    source.deliversHit && source.deliversHit(this)

    this.scene.time.delayedCall(2000, () => {
      this.hasBeenHit = false
      hitAnim.stop()
      this.clearTint()
    })
  }
}

export default Player