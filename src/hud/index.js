import Phaser from "phaser"

class Hud extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    scene.add.existing(this)

    const { rightTopCornerPosition } = scene.config
    this.setPosition(rightTopCornerPosition.x - 70, rightTopCornerPosition.y + 10)
    this.setScrollFactor(0)

    this.fontSize = 20
    this.setupList()
  }
  setupList() {
    
    const scoreBoard = this.createScoreBoard()

    this.add(scoreBoard)
  }

  createScoreBoard() {
    const scoreText = this.scene.add.text(0,0,'0', { fontSize: `${this.fontSize}px`})
    const scoreImage = this.scene.add.image(scoreText.width + 5, 0, 'diamond')
      .setOrigin(0)
      .setScale(1.4)

    const scoreBoard = this.scene.add.container(0,0, [scoreText, scoreImage])
    scoreBoard.setName('scoreBoard')
    return scoreBoard
  }

  updateScoreBoard(score) {
    const [ scoreText, scoreImage ] = this.getByName('scoreBoard').list
    scoreText.setText(score)
    scoreImage.setX(scoreText.width + 5)
  }  

}

export default Hud
