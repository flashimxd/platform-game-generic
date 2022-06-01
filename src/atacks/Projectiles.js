import Phaser from 'phaser'
import Projectile from './Projectile'
import { getTimeStamp } from '../utils/functions'

class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)

    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: 'iceball',
      classType: Projectile
    })

    this.timeFromLastProjectile = null
  }

  fireProjectile(inititator) {
    const projectile = this.getFirstDead(false)

    if(!projectile || this.timeFromLastProjectile &&
      this.timeFromLastProjectile + projectile.cooldown > getTimeStamp()) return

    const center = inititator.getCenter()
    let centerX

    if(inititator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed)
      projectile.setFlipX(false)
      centerX = center.x + 10
    } else {
      projectile.speed = -Math.abs(projectile.speed)
      projectile.setFlipX(true)
      centerX = center.x - 10
    }

    projectile.fire(centerX, center.y)
    this.timeFromLastProjectile = getTimeStamp()
  }
}

export default Projectiles