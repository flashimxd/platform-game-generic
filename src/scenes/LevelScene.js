import BaseScene from './BaseScene'

class LevelScene extends BaseScene {
  constructor(config) {
    super('LevelScene', { ...config, canGoBack: true })
  }

  create() {
    super.create()

    const levels = this.registry.get('unlocked-levels')
    this.menu = [...Array(levels).keys()].map((_, i) => {
      return {
        scene: 'PlayScene',
        text: `Level ${i + 1}`,
        level: i + 1
      }
    })

    this.createMenu(this.menu, (menuItem) => this.handleMenuEvents(menuItem))
  }

  handleMenuEvents(menuItem) {
    const { textGO } = menuItem
    textGO.setInteractive()

    textGO.on('pointerover', () => textGO.setStyle({ fill: '#ff0' }))
    textGO.on('pointerout', () => textGO.setStyle({ fill: '#713E01' }))

    textGO.on('pointerup', () => {
      if(!menuItem.scene) {
        this.game.destroy(true)
        return
      }
      
      this.registry.set('level', menuItem.level)
      this.scene.start(menuItem.scene)
    })
  }
}

export default LevelScene