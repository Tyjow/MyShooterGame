var Splash = function () {};
    playSound = true,
    playMusic = true,
music;

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/gamemenu.js');
    game.load.script('level1', 'states/level1.js');
    game.load.script('level2', 'states/level2.js');
    game.load.script('gameover','states/gameover.js');
    game.load.script('credits', 'states/credits.js');
    game.load.script('options', 'states/options.js');
  },

  loadBgm: function () {
    
    game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
    game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
    game.load.audio('music-menu', 'assets/bgm/MyVeryOwnDeadShip.ogg');
    game.load.audio('music-credit', 'assets/bgm/A Journey Awaits.mp3');
    game.load.audio('playerShootChainGun', 'assets/bgm/sprites-sound/basicshoot.mp3', true);
    game.load.audio('playerShootChainGunUpgrade', 'assets/bgm/sprites-sound/basicshoot-upgrade.mp3', true);
    game.load.audio('explosionSound', 'assets/bgm/sprites-sound/explosion2-sound.mp3', true);
    game.load.audio('mainSound', 'assets/bgm/level1-sound/main-sound.ogg', true);
    game.load.audio('levelUpSound', 'assets/bgm/sprites-sound/levelup-sound.wav', true);
  },
  
  loadImages: function () {
    game.load.image('menu-bg', 'assets/images/menu-bg.jpg');
    game.load.image('options-bg', 'assets/images/options-bg.jpg');
    game.load.image('gameover-bg', 'assets/images/gameover-bg.jpg');

    game.load.image('foreground', 'assets/sprites/level1/stars.png');
    game.load.image('midground', 'assets/sprites/level1/spacescape.png');
    game.load.image('background', 'assets/sprites/level1/space4.jpg');

    game.load.image('playerBullets', 'assets/sprites/bullet01.png');
    game.load.image('enemyBullets', 'assets/sprites/bullet01.png');

    game.load.spritesheet('littleAsteroid', 'assets/sprites/little-asteroid.png', 147, 196);
    game.load.spritesheet('shieldEnergy', 'assets/sprites/powerups/shield-energy.png', 130, 129);

    game.load.spritesheet('player', 'assets/sprites/player/player-ship.png', 178, 165);
    game.load.spritesheet('playerLevelUpAnim', 'assets/sprites/player/levelup-anim.png', 128, 128);

    game.load.spritesheet('enemy', 'assets/sprites/enemies/enemies-sat1.png', 94, 101);
    game.load.spritesheet('enemyMain', 'assets/sprites/enemies/enemies-main1.png', 276, 215);

    game.load.spritesheet('explosionTrail', 'assets/sprites/explode.png', 128, 128);
    game.load.spritesheet('explosion', 'assets/sprites/explode-anim.png', 300, 292);
    game.load.spritesheet('electricDamaged', 'assets/sprites/player/electric-damaged.png', 512, 512);

    game.load.bitmapFont('spacefont', 'assets/fonts/tyjowfont.png', 'assets/fonts/tyjowfont.xml');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['assets/style/theminion.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), game.world.centerY, "loading");
    this.logo       = game.make.sprite(game.world.centerX, game.world.centerY-(game.world.centerY/3), 'brand');
    this.status     = game.make.text(game.world.centerX, game.world.centerY-(game.world.centerY/8), 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    /*game.add.sprite(0, 0, 'nuit');*/
    game.add.existing(this.logo).scale.setTo(1);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("level1",level1);
    game.state.add("level2",level2);
    game.state.add("GameOver",GameOver);
    game.state.add("Credits",Credits);
    game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready !');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};