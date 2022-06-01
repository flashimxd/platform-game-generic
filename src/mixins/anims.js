export default {
  isPlayingAnims(key) {
    return this.anims.isPlaying && this.anims.getCurrentKey() === key
  }
}