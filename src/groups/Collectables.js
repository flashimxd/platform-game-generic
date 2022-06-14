import Phaser from 'phaser'
import Collectable from '../collectables/Collectable'

class Collectables extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.createFromConfig({
      classType: Collectable
    })
  }

  mapProperties(propertiesList) {
    
    if(!propertiesList || propertiesList.length === 0) return {}
    console.log('iniit', propertiesList)
    console.log('len', propertiesList.length)
    console.log({ propertiesList })
    return propertiesList.reduce((map, row) => {
      map[row.name] = row.value
      return map
    }, {})
  }

  addFromLayer(layer) {
    const { score: defaultScore, type } = this.mapProperties(layer.properties)

    layer.objects.forEach(collectable => {
      const collec = this.get(collectable.x, collectable.y, type)
      const props = this.mapProperties(collectable.properties)

      collec.score = props.score || defaultScore
    })
  }
}

export default Collectables