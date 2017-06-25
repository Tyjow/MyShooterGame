var Options = function(game) {};

Options.prototype = {

  menuConfig: {
    className: "inverse",
    startY: 260,
    startX: "center"
  },


  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Options", {
      font: 'bold 50pt TheMinion',
      fill: '#509291',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },
  create: function () {
    var playSound = gameOptions.playSound,
        playMusic = gameOptions.playMusic,
        Info;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);
    this.addMenuOption(playMusic ? 'Music Off' : 'Music On', function (target) {
      playMusic = !playMusic;
      target.text = playMusic ? 'Music Off' : 'Music On';
      music.volume = playMusic ? 0.2 : 0;
    });
    this.addMenuOption(playSound ? 'Sound Off' : 'Sound On', function (target) {
      playSound = !playSound;
      target.text = playSound ? 'Sound Off' : 'Sound On';
    });
    this.addMenuOption('◄ Back', function () {
      game.state.start("GameMenu");
    });
  }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);
