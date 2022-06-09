import Phaser from 'phaser'
import { ENEMY_TYPES } from '../types'
import collidable from '../mixins/collidable'

class Enemies extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene)
    Object.assign(this, collidable)
  }

  getProjectiles() {
    const projectiles = new Phaser.GameObjects.Group()

    this.getChildren().forEach(enemy => {
      console.log('all enemies', { enemy })
      console.log('enemy.projectiles', enemy.projectiles)
      // not all the enemies has projectiles ex[Birdman]
      enemy.projectiles && projectiles.addMultiple(enemy.projectiles.getChildren())
    })

    return projectiles
  }

  getTypes() {
    return ENEMY_TYPES
  }
}

export default Enemies