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
    this.initEvents()
  }

  init() {
    this.gravity = 500
    this.speed = 150
    this.rayGraphics = this.scene.add.graphics({ lineStyle: {
      width: 2,
      color: 0xaa00aa
    }})

    this.body.setGravityY(500)
    this.setSize(20, 45)
    this.setOffset(10, 20)
    this.setCollideWorldBounds(true)
    this.setOrigin(0.5, 1)
  }

  initEvents(time, delta) {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update(time, delta) {
    this.setVelocityX(30)
    const ray = this.raycast(this.body)

    this.rayGraphics.clear()
    this.rayGraphics.strokeLineShape(ray)
  }

  raycast(body, raylength = 30) {
    const { x, y, width, halfheight } = body
    const line = new Phaser.Geom.Line()

    line.x1 = 0
    line.y1 = 0
    line.x2 = 0
    line.y2 = 0

    return line
  }


}

export default Enemy