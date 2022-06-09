import Phaser from 'phaser'
import Enemy from './Enemy'
import initAnims from './anims/snakyAnims'
import Projectiles from '../atacks/Projectiles'

class Snaky extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snaky')
    initAnims(scene.anims)
  }

  init() {
    super.init()
    this.speed = 50

    this.projectiles = new Projectiles(this.scene, 'fireball-1')
    this.timeSinceLastAttack = 0
    this.cooldown = this.getAttackCooldown()
    this.lastDirection = null

    this.setSize(this.width - 20, 45)
    this.setOffset(10, 15)
  }

  update(time, delta) {
    super.update(time, delta)

    if(this.body.velocity.x > 0) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
    } else {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT
    }

    if(this.timeSinceLastAttack + this.cooldown <= time) {
      this.projectiles.fireProjectile(this, 'fireball')
      this.timeSinceLastAttack = time
      this.cooldown = this.getAttackCooldown()
    }

    if(!this.active || this.isPlayingAnims('snaky-hurt')) return
    this.play('snaky-walk', true)
  }

  getAttackCooldown() {
    return Phaser.Math.Between(1000, 4000)
  }


  takesHit(source) {
    super.takesHit(source)
    this.play('snaky-hurt', true)
  }

}

export default Snaky