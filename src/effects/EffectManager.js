import SpriteEffect from './SpriteEffect'

class EffectManager {
  constructor(scene) {
    this.scene = scene
  }

  playEffectOn(effectname, target, impactPosition) {
    const effect = new SpriteEffect(this.scene, 0, 0, effectname, impactPosition)
    effect.playOn(target)
  }
}

export default EffectManager