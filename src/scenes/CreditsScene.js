import BaseScene from './BaseScene'

class CreditsScene extends BaseScene {
  constructor(config) {
    super('CreditsScene', { ...config, canGoBack: true })

    this.menu = [
      { id: 1, scene: null, text: 'Thank you for playing!'},
      { id: 2, scene: null, text: 'Author: R Netto'},
    ]
  }

  create() {
    super.create()
    this.createMenu(this.menu, () => {})
  }
}

export default CreditsScene