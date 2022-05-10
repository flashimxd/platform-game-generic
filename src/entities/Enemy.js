import Phaser from 'phaser'
import collidable from '../mixins/collidable'

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setImmovable(true)
    Object.assign(this, collidable)

    this.init()
  }

  init() {
    this.gravity = 500
    this.speed = 150

    this.body.setGravityY(500)
    this.setSize(20, 45)
    this.setOffset(10, 20)
    this.setCollideWorldBounds(true)
    this.setOrigin(0.5, 1)
  }
}

export default Enemy