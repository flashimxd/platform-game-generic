export default (anims) => {
  anims.create({
    key: 'idle',
    frames: anims.generateFrameNumbers('player', {
      start: 0,
      end: 5
    }),
    frameRate: 6,
    repeat: -1
  })

  // anims.create({
  //   key: 'run',
  //   frames: anims.generateFrameNumbers('player-3', {
  //     start: 6,
  //     end: 11
  //   }),
  //   frameRate: 8,
  //   repeat: -1
  // })

    // anims.create({
    //   key: 'jump',
    //   frames: anims.generateFrameNumbers('player-3', {
    //     start: 0,
    //     end: 5
    //   }),
    //   frameRate: 15,
    //   repeat: -1
    // })

  //   anims.create({
  //     key: 'jump',
  //     frames: [
  //       { key: 'jump-1'},
  //       { key: 'jump-2'},
  //       { key: 'jump-3'}
  //     ],
  //     frameRate: 5,
  //     repeat: -1
  //   })


  // anims.create({
  //   key: 'throw',
  //   frames: anims.generateFrameNumbers('player-3', {
  //     start: 18,
  //     end: 23
  //   }),
  //   frameRate: 14,
  //   repeat: 0
  // })

  anims.create({
    key: 'run',
    frames: anims.generateFrameNumbers('player', {
      start: 11,
      end: 16
    }),
    frameRate: 8,
    repeat: -1
  })

  // anims.create({
  //   key: 'run',
  //   frames: anims.generateFrameNumbers('player-2-run', {
  //     start: 0,
  //     end: 10
  //   }),
  //   frameRate: 8,
  //   repeat: -1
  // })

  // anims.create({
  //   key: 'jump',
  //   frames: anims.generateFrameNumbers('player-2-jump', {
  //     start: 0,
  //     end: 5
  //   }),
  //   frameRate: 15,
  //   repeat: -1
  // })


  anims.create({
    key: 'jump',
    frames: anims.generateFrameNumbers('player', {
      start: 17,
      end: 23
    }),
    frameRate: 4,
    repeat: 1
  })

  anims.create({
    key: 'throw',
    frames: anims.generateFrameNumbers('player-throw', {
      start: 0,
      end: 7
    }),
    frameRate: 14,
    repeat: 0
  })
  anims.create({
    key: 'slide',
    frames: anims.generateFrameNumbers('player-slide-sheet', {
      start: 0,
      end: 2
    }),
    frameRate: 20,
    repeat: 0
  })
}