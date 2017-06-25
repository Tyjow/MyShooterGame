var Credits = function(game) {};

Credits.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.creditCount = 0;

  },

  addCredit: function(task, author) {
    var authorStyle = { font: '40pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var taskStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var authorText = game.add.text(game.world.centerX, 900, author, authorStyle);
    var taskText = game.add.text(game.world.centerX, 950, task, taskStyle);
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
    game.add.tween(taskText).to( { y: -200 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
    this.creditCount ++;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: '#509291', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(10, (this.optionCount * 80) + game.world.centerY*1.6, text, optionStyle);

    txt.stroke = "rgb(1,1,1)";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#000";
      target.stroke = "rgb(255,255,255)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "#509291";
      target.stroke = "rgb(1,1,1)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {
    this.stage.disableVisibilityChange = true;
    if (gameOptions.playMusic) {
      music.stop();
      music = game.add.audio('music-credit');
      music.volume = 0.5;
      music.play();
    }
    var bg = game.add.sprite(0, 0, 'gameover-bg');
    this.addCredit('Free Sound', 'Music');
    this.addCredit('Tyjow', 'Developer');
    this.addCredit('Phaser.io', 'Powered By');
    this.addCredit('Richard Davey', 'Phaser\'s Author');
    this.addCredit('for playing ;)', 'Thank you');
    this.addMenuOption('◄ Back', function (e) {
      game.state.start("GameMenu");
    });
    game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
  }

};
