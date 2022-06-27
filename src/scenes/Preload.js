import Phaser from 'phaser'

class Preload extends Phaser.Scene {

  constructor() {
    super('PreloadScene')
  }
  
  preload() {
    this.load.tilemapTiledJSON('level_1', 'assets/maps/crystal_cave_level_1.json')
    this.load.tilemapTiledJSON('level_2', 'assets/maps/crystal_cave_level_2.json')
    this.load.tilemapTiledJSON('level_3', 'assets/maps/crystal_cave_level_3.json')

    this.load.image('tiles-1', 'assets/maps/tilesets/main_lev_build_1.png')
    this.load.image('tiles-2', 'assets/maps/tilesets/main_lev_build_2.png')
    this.load.image('bg-spikes-tileset', 'assets/bg_spikes_tileset.png')
    this.load.image('bg-spikes-dark', 'assets/bg_spikes_dark.png')

    this.load.image('sky_play', 'assets/sky_play.png')    
    this.load.image('menu_bg', 'assets/background01.png')
    this.load.image('back', 'assets/back.png')

    this.load.image('iceball-1', 'assets/weapons/iceball_001.png')
    this.load.image('iceball-2', 'assets/weapons/iceball_002.png')

    this.load.image('fireball-1', 'assets/weapons/improved_fireball_001.png')
    this.load.image('fireball-2', 'assets/weapons/improved_fireball_002.png')
    this.load.image('fireball-3', 'assets/weapons/improved_fireball_003.png')
    this.load.image('fireball-3', 'assets/weapons/improved_fireball_003.png')

    this.load.image('diamond', 'assets/collectables/diamond.png')

    this.load.image('diamond-1', 'assets/collectables/diamond_big_01.png')
    this.load.image('diamond-2', 'assets/collectables/diamond_big_02.png')
    this.load.image('diamond-3', 'assets/collectables/diamond_big_03.png')
    this.load.image('diamond-4', 'assets/collectables/diamond_big_04.png')
    this.load.image('diamond-5', 'assets/collectables/diamond_big_05.png')
    this.load.image('diamond-6', 'assets/collectables/diamond_big_06.png')


    this.load.image('jump-1', 'assets/player/Warrior/individualSprite/Jump/Warrior_Jump_1.png')
    this.load.image('jump-2', 'assets/player/Warrior/individualSprite/Jump/Warrior_Jump_2.png')
    this.load.image('jump-3', 'assets/player/Warrior/individualSprite/Jump/Warrior_Jump_3.png')


    

    this.load.spritesheet('player', 'assets/player/move_sprite_1.png', {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32
    })

    // this.load.spritesheet('player-2', 'assets/player/ninja_frog/idle.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })

    // this.load.spritesheet('player-2-run', 'assets/player/ninja_frog/run.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })

    // this.load.spritesheet('player-2-jump', 'assets/player/ninja_frog/double_jump.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })



    this.load.spritesheet('player-3', 'assets/player/Warrior/spriteSheet/warrior_sheet_effect.png', {
      frameWidth: 69,
      frameHeight: 44,
    })
    

    this.load.spritesheet('player-slide-sheet', 'assets/player/slide_sheet_2.png', {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32
    })
    
    this.load.spritesheet('birdman', 'assets/enemy/enemy_sheet.png', {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32
    })

    this.load.spritesheet('snaky', 'assets/enemy/enemy_sheet_2.png', {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32
    })

    this.load.spritesheet('player-throw', 'assets/player/throw_attack_sheet_1.png', {
      frameWidth: 32,
      frameHeight: 38,
      spacing: 32
    })

    this.load.spritesheet('hit-sheet', 'assets/weapons/hit_effect_sheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    })

    this.load.spritesheet('sword-default', 'assets/weapons/sword_sheet_1.png', {
      frameWidth: 52,
      frameHeight: 32,
      spacing: 16
    })

    this.load.audio('theme', 'assets/music/theme_music.wav')

    this.load.audio('projectile-launch', 'assets/music/projectile_launch.wav')
    this.load.audio('step', 'assets/music/step_mud.wav')
    this.load.audio('jump', 'assets/music/jump.wav')
    this.load.audio('swipe', 'assets/music/swipe.wav')
    this.load.audio('coin-pickup', 'assets/music/coin_pickup.wav')


    this.load.audio('sword-slice', 'assets/music/sword_slice.wav')


    this.load.once('complete', () => {
      this.startGame()
    })

  }

  startGame() {
    this.registry.set('level', 1)
    this.registry.set('unlocked-levels', 1)
    this.scene.start('MenuScene')
  }
}

export default Preload