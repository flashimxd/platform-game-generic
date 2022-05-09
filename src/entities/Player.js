import Phaser from 'phaser'
import initAnimations from './playerAnims'
import collidable from '../mixins/collidable'

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')

    // adding the sprint context
    scene.add.existing(this)
    // adding physics context
    scene.physics.add.existing(this)

    // Mixins (I hate them)
     Object.assign(this, collidable)

    this.init()
    this.initEvents()
  }

  init() {
    this.gravity = 500
    this.playerSpeed = 150
    this.jumpCount = 0
    this.consecutiveJumps = 1
    this.cursors = this.scene.input.keyboard.createCursorKeys()

    this.body.setGravityY(500)
    this.setCollideWorldBounds(true)

    initAnimations(this.scene.anims)
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  // addCollider(otherGameObject, callback) {
  //   this.scene.physics.add.collider(this, otherGameObject, callback, null, this)
  // }

  update() {
    const { left, right, space, up } = this.cursors
    const isOnFloor = this.body.onFloor()
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up)

    isOnFloor ?
      this.body.velocity.x !== 0 ? 
        this.play('run', true):
        this.play('idle', true) :
      this.play('jump', true)
 
     if((isOnFloor || this.jumpCount < this.consecutiveJumps) && (isSpaceJustDown || isUpJustDown)) {
      this.setVelocityY(-(this.playerSpeed * 1.8))
      this.jumpCount++
    }

    if(isOnFloor) {
      this.jumpCount = 0
    }

    if(left.isDown) {
      this.setVelocityX(-this.playerSpeed)
      this.setFlipX(true)
      return
    }

    if(right.isDown) {
      this.setVelocityX(this.playerSpeed)
      this.setFlipX(false)
      return
    }

    this.setVelocityX(0)
  }
}

export default Player