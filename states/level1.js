    var level1 = function(game) {};

    var greenEnemies;
    var greenEnemiesXp = 10;
    var ennemiesMainXp = 20;
    var explosions;
    var shields;
    var shipTrail;
    var greenEnemyLaunchTimer;
    var gameOver;
    var endLevelOne;
    var firstLevelText;
    var fireButton;
    var score = 0;
    var scoreText;
    var wepEnemy;
    var greenDamageAmount;
    var damageAmountEnemies = 10;
    var enemyBullets;
    var livingEnemies = [];
    var livingEnemiesMain = [];
    var livingShieldChild = [];
    var nextFireEnemy = 0;
    var removeTextXp;
    var gainXpPlayer;
    var getXpPlayer;
    var tweenPlayer;
    var tweenEnnemies;
    var tweenAsteroid;
    var levelSpeedOne = -60;
    var levelSpeedTwo = -100;
    var nextIncrement = 0;
    var nextFire = 0;
    var removeTextLevelUp;
    var playerLevelUpAnim;
    var playerLevelUpAnimShield;
    var enemyHealth;
    var playerShootChainGun;
    var playerShootChainGunUpgrade;
    var explosionSound;
    var mainSound;
    var levelUpSound;
    var electricDamaged;
    var fadeInFirstLevelText;
    var style;
    var textTuto;
    var barTuto;
    var wPaused = game.width;
    var hPaused = game.height;
    var pauseGame;
    var pauseGame2;
    var removePause;
    var removePause2;
    var timeFadeTextLevel = 4;
    var timeSpawnGreenEnnemies = 9000;
    var timeSpawnMainEnnemies = 24000;
    var littleAsteroid;
    var shieldEnergy;
    var randomLoot;
    var fingerTuto;
    var first;


    level1.prototype = {

        init: function () {

            this.game.renderer.renderSession.roundPixels = true;

            this.physics.startSystem(Phaser.Physics.ARCADE);

        },

        preload: function () {

            

        },

        create: function () {

            this.background = null;
            this.midground = null;
            this.foreground = null;

            this.player = null;
            this.cursors = null;
            this.speed = 300;

            this.w = window.innerWidth;
            this.h = window.innerHeight;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setGameSize(this.w,this.h);
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVeritcally = true;
            this.game.scale.refresh();


            removePause = this.game.time.events.add(Phaser.Timer.SECOND * 3, gamePausedTuto, this);

            playerShootChainGun = this.game.add.audio('playerShootChainGun');
            playerShootChainGun.volume = 0.05;

            playerShootChainGunUpgrade = this.game.add.audio('playerShootChainGunUpgrade');
            playerShootChainGunUpgrade.volume = 0.03;

            explosionSound = this.game.add.audio('explosionSound');
            explosionSound.volume = 0.1;

            mainSound = this.game.add.audio('mainSound');
            mainSound.volume = 0.3;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function(){
                mainSound.play();
            }, this);

            levelUpSound = this.game.add.audio('levelUpSound');
            levelUpSound.volume = 0.3;

            this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

            this.midground = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'midground');
            this.midground.autoScroll(levelSpeedOne, 0);

            this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
            this.foreground.autoScroll(levelSpeedTwo, 0);


            this.player = this.add.sprite(64, 200, 'player');
            this.player.scale.x = 0.4;
            this.player.scale.y = 0.4;
            this.player.health = 100;
            this.player.frame = 7;
            this.player.exp = 0;
            this.player.level = 1;
            this.player.animations.add('walkBottom', [6, 5, 4, 3, 2 ,1 ,0], 10, true);
            this.player.animations.add('walkTop', [8, 9, 10, 11, 12 ,13 ,14 ,15], 10, true);
            this.player.alpha = 1;
            this.player.tint = 0xffffff;

            this.physics.arcade.enable(this.player);

            this.player.body.collideWorldBounds = true;

            this.player.events.onKilled.add(function(){
                shipTrail.kill();
            });
            this.player.events.onRevived.add(function(){
                shipTrail.start(false, 5000, 10);
            });

            
            this.player.level = +localStorage.getItem('currentLevel') || 1;
            this.player.exp = +localStorage.getItem('currentExp') || 0;
            

            //  Electric Damaged
            electricDamaged = this.game.add.sprite(5, 5, 'electricDamaged');
            electricDamaged.animations.add('electricDamaged', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
            electricDamaged.visible = false;
            electricDamaged.scale.set(0.15);

            // shield energy group
            shieldEnergy = game.add.group();
            shieldEnergy.enableBody = true;
            shieldEnergy.physicsBodyType = Phaser.Physics.ARCADE;
            shieldEnergy.setAll('anchor.x', 0.5);
            shieldEnergy.setAll('anchor.y', 0.5);
            shieldEnergy.setAll('outOfBoundsKill', true);
            shieldEnergy.setAll('checkWorldBounds', true);
            
            // player ship trail group
            shipTrail = this.game.add.emitter(this.player.x, this.player.y + 10, 400);
            shipTrail.width = 10;
            shipTrail.makeParticles('explosionTrail', [1,2,3,4,5]);
            shipTrail.setXSpeed(20, -20);
            shipTrail.setRotation(50,-50);
            shipTrail.setAlpha(0.4, 0, 800);
            shipTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
            shipTrail.start(false, 5000, 10);

            
            //  The baddies!
            greenEnemies = game.add.group();
            greenEnemies.enableBody = true;
            greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
            greenEnemies.createMultiple(30, 'enemy');
            greenEnemies.setAll('scale.x', -0.3);
            greenEnemies.setAll('scale.y', 0.3);
            greenEnemies.setAll('outOfBoundsKill', true);
            greenEnemies.setAll('checkWorldBounds', true);
            greenEnemies.forEach(function(enemy){
               enemy.health = 1;
               enemy.animations.add('enemyFly', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18], 15, true);
               enemy.animations.play('enemyFly');
               addEnemyEmitterTrail(enemy);
               enemy.nextFireChild = 0;
               greenDamageAmount = damageAmountEnemies;
               enemy.events.onKilled.add(function(){
                      
                    enemy.trail.kill();
                    
                });
            });

            ennemiesMain = game.add.group();
            ennemiesMain.enableBody = true;
            ennemiesMain.physicsBodyType = Phaser.Physics.ARCADE;
            ennemiesMain.createMultiple(2, 'enemyMain');
            ennemiesMain.setAll('outOfBoundsKill', true);
            ennemiesMain.setAll('checkWorldBounds', true);
            ennemiesMain.forEach(function(enemy){
               enemy.health = 3;
               enemy.alpha = 1;
               enemy.animations.add('enemyFlyMain', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 15, true);
               enemy.animations.play('enemyFlyMain');
               addEnemyEmitterTrail(enemy);
               enemy.nextFireChild = 0;
               enemyMainDamageAmount = damageAmountEnemies;
               enemy.events.onKilled.add(function(){
                      
                    enemy.trail.kill();
                    
                });
               enemy.events.onRemovedFromGroup.add(function(){
                      
                    enemy.trail.kill();
                    
                });
            });

            playerBullets = game.add.group();
            playerBullets.enableBody = true;
            playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
            playerBullets.createMultiple(50, 'playerBullets');      
            playerBullets.setAll('anchor.x', 0.5);
            playerBullets.setAll('anchor.y', 0.5);
            playerBullets.setAll('outOfBoundsKill', true);
            playerBullets.setAll('checkWorldBounds', true);
            playerBullets.forEach( function(bullet) {
                bullet.health = 1;
            });

            enemyBullets = game.add.group();
            enemyBullets.enableBody = true;
            enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            enemyBullets.createMultiple(100, 'enemyBullets');      
            enemyBullets.setAll('anchor.x', 0.5);
            enemyBullets.setAll('anchor.y', 0.5);
            enemyBullets.setAll('outOfBoundsKill', true);
            enemyBullets.setAll('checkWorldBounds', true);

            //Temps de spawn enemies
            this.game.time.events.add(timeSpawnGreenEnnemies, launchGreenEnemy);
            this.game.time.events.add(timeSpawnMainEnnemies, launchEnnemiesMain);

            // Temps de spawn asteroids
            this.game.time.events.add(12000, launchLittleAsteroid);

            //  Game over text
            gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
            gameOver.anchor.setTo(0.5, 0.5);
            gameOver.visible = false;

            // End Level Text
            endLevelOne = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'Level Completed!', 110);
            endLevelOne.anchor.setTo(0.5, 0.5);
            endLevelOne.visible = false;

            // Level 1 Text
            firstLevelText = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'Level 1', 110);
            firstLevelText.anchor.setTo(0.5, 0.5);
            firstLevelText.visible = true;
            firstLevelText.alpha = 0;
            this.game.time.events.add(Phaser.Timer.SECOND * timeFadeTextLevel, fadeLevelText, this);

            //  An explosion pool
            explosions = game.add.group();
            explosions.enableBody = true;
            explosions.physicsBodyType = Phaser.Physics.ARCADE;
            explosions.createMultiple(30, 'explosion');
            explosions.setAll('anchor.x', 0.5);
            explosions.setAll('anchor.y', 0.5);
            explosions.setAll('scale.x', 0.4);
            explosions.setAll('scale.y', 0.4);
            explosions.forEach( function(explosion) {
                explosion.animations.add('explosion');
            });

            //  Asteroid
            littleAsteroid = game.add.group();
            littleAsteroid.enableBody = true;
            littleAsteroid.physicsBodyType = Phaser.Physics.ARCADE;
            littleAsteroid.createMultiple(5, 'littleAsteroid');
            littleAsteroid.setAll('anchor.x', 0.5);
            littleAsteroid.setAll('anchor.y', 0.5);
            littleAsteroid.setAll('scale.x', -0.4);
            littleAsteroid.setAll('scale.y', 0.4);
            littleAsteroid.setAll('outOfBoundsKill', true);
            littleAsteroid.setAll('checkWorldBounds', true);
            littleAsteroid.forEach( function(asteroid) {
                asteroid.health = 2;
                asteroid.alpha = 1;
                greenDamageAmount = damageAmountEnemies;
                asteroid.animations.add('littleAsteroidFly', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], 5, true);
                asteroid.animations.play('littleAsteroidFly');
            });

            //  Animation level up player
            playerLevelUpAnim = game.add.group();
            playerLevelUpAnim.enableBody = true;
            playerLevelUpAnim.physicsBodyType = Phaser.Physics.ARCADE;
            playerLevelUpAnim.createMultiple(30, 'playerLevelUpAnim');
            playerLevelUpAnim.setAll('anchor.x', 0.5);
            playerLevelUpAnim.setAll('anchor.y', 0.5);
            playerLevelUpAnim.forEach( function(playerLevelUpAnim) {
                playerLevelUpAnim.animations.add('playerLevelUpAnim');
            });

            //  Animation heal player
            playerLevelUpAnimShield = game.add.group();
            playerLevelUpAnimShield.enableBody = true;
            playerLevelUpAnimShield.physicsBodyType = Phaser.Physics.ARCADE;
            playerLevelUpAnimShield.createMultiple(30, 'playerLevelUpAnimShield');
            playerLevelUpAnimShield.setAll('anchor.x', 0.5);
            playerLevelUpAnimShield.setAll('anchor.y', 0.5);
            playerLevelUpAnimShield.forEach( function(playerLevelUpAnimShield) {
                playerLevelUpAnimShield.animations.add('playerLevelUpAnimShield');
            });

            //  Shields stat
            shields = this.game.add.bitmapText(10, 10, 'spacefont', 'Shield: ' + this.player.health +'%', 40);

            level = this.game.add.bitmapText(this.game.world.width / 4, 10, 'spacefont', 'Level: ' + this.player.level, 40);

            experience = this.game.add.bitmapText(this.game.world.width / 2, 10, 'spacefont', 'Exp: ' + this.player.exp, 40);

            //  Score
            scoreText = this.game.add.bitmapText(this.game.world.width, 10, 'spacefont', 'Score: ' + score, 40);

            // bitmaptext align right
            scoreText.anchor.set(1,0);

            //  Cursor keys to fly + space to fire
            this.cursors = this.input.keyboard.createCursorKeys();

            this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

            fireButton = this.input.keyboard.addKey(Phaser.Keyboard.ESC);

       

        },

        update: function () {

            //  Check collisions
            this.game.physics.arcade.overlap(this.player, greenEnemies, shipCollide, null, this);
            this.game.physics.arcade.overlap(playerBullets, greenEnemies, hitEnemy, null, this);
            this.game.physics.arcade.overlap(this.player, ennemiesMain, shipCollideEnemiesMain, null, this);
            this.game.physics.arcade.overlap(playerBullets, ennemiesMain, hitEnemyMain, null, this);
            this.game.physics.arcade.overlap(this.player, littleAsteroid, shipCollideAsteroid, null, this);
            this.game.physics.arcade.overlap(this.player, shieldEnergy, shipCollideShieldEnergy, null, this);
            this.game.physics.arcade.overlap(playerBullets, littleAsteroid, hitAsteroid, null, this);
            this.game.physics.arcade.overlap(enemyBullets, this.player, enemyHitsPlayer, null, this);
            this.game.physics.arcade.overlap(playerBullets, enemyBullets, hitEnemyBullet, null, this);


            //  Game over?
            if (! this.player.alive && gameOver.visible === false) {
                gameOver.visible = true;
                gameOver.alpha = 0;
                var fadeInGameOver = this.game.add.tween(gameOver);
                fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
                fadeInGameOver.onComplete.add(setResetHandlers);
                fadeInGameOver.start();
                greenEnemyLaunchTimer = game.time.events.stop();
                ennemiesMainLaunchTimer = game.time.events.stop();
                littleAsteroidLaunchTimer = game.time.events.stop();
                playerBullets.removeAll(true);
                shieldEnergy.removeAll(true);
                function setResetHandlers() {
                    //  The "click to restart" handler
                    tapRestart = this.game.input.onTap.addOnce(_restart,this);
                    spaceRestart = fireButton.onDown.addOnce(_restart,this);
                    function _restart() {
                      tapRestart.detach();
                      spaceRestart.detach();
                      // restart();
                      mainSound.stop();
                      this.game.state.start("GameMenu");
                      score = 0;
                      levelSpeedOne = -60;
                      levelSpeedTwo = -100;
                      nextIncrement = 0;
                      livingEnemies = [];
                      livingEnemiesMain = [];
                      greenEnemyLaunchTimer = game.time.events.start();
                      ennemiesMainLaunchTimer = game.time.events.start();
                      littleAsteroidLaunchTimer = game.time.events.start();
                    }
                }
            }

            this.player.body.velocity.set(0);

            if (this.cursors.left.isDown)
            {
                this.player.body.velocity.x = -this.speed;
            }
            else if (this.cursors.right.isDown)
            {
                this.player.body.velocity.x = this.speed;
            }

            if (this.cursors.up.isDown)
            {
                this.player.body.velocity.y = -this.speed;
                this.player.play('walkTop');
                if (this.player.animations.currentFrame.index == 15) {
                    this.player.animations.currentAnim.setFrame(15, false);
                }
                
            }
            else if (this.cursors.down.isDown)
            {
                this.player.body.velocity.y = this.speed;
                this.player.play('walkBottom');
                if (this.player.animations.currentFrame.index == 0) {
                    this.player.animations.currentAnim.setFrame(0, false);
                }

            }
            else {
                this.player.frame = 7;
            }

            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            {
                // this.weapons[this.currentWeapon].fire(this.player);
                fireBullet(this.player);
            }

            //  Keep the shipTrail lined up with the ship
            shipTrail.x = this.player.x;
            shipTrail.y = this.player.y + 20;

            //  Fire bullet
            if (this.player.alive && (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))) {
                // this.weapons[this.currentWeapon].fire();
                fireBullet(this.player);
            }

            // set exp to get for level up
            gainXpPlayer = 125 * greenEnemiesXp;

            getXpPlayer = this.player.level * gainXpPlayer;

            if (this.player.exp >= getXpPlayer) {
                this.player.level++;
                level.text = 'Level: ' + this.player.level;
                localStorage.setItem('currentLevel', this.player.level);
                
                
                // Anim level up
                AnimlevelUp(this.player);
                shields.text = 'Shield: ' + Math.max(this.player.health, 0) +'%';
                levelUpSound.play();
            }

            localStorage.setItem('currentExp', this.player.exp);

            // level 3 or more higher playerBullets become more powerful
            if (this.player.level >= 3) {
                playerBullets.forEachAlive(function(bullet){
                    bullet.scale.set(0.4);
                    bullet.health = 2;
                });
            }


            if (this.player.health <= 100 / 4) {
               AnimDamaged(this.player);
            }
            if (this.player.health >= 100 / 4) {
                electricDamaged.visible = false;
                electricDamaged.animations.stop();
            }


            // score condition end level 1
            smoothStopScroll();

            // stop launch ennemies before level cleared
            if (levelSpeedOne >= -59 && levelSpeedTwo >= -99) {
                greenEnemyLaunchTimer = game.time.events.stop();
                ennemiesMainLaunchTimer = game.time.events.stop();
                littleAsteroidLaunchTimer = game.time.events.stop();
            }

            // remove all element on screen and add msg Level Complete
            if (levelSpeedOne >= 0 && levelSpeedTwo >= 0) {
                levelCleared();
            }

            // update new value for autoscroll "function smoothStopScroll()"
            this.midground.autoScroll(levelSpeedOne, 0);
            this.foreground.autoScroll(levelSpeedTwo, 0);

            // enemiesFire();
            enemiesFireMain();

            if (pauseGame == 0) {
                this.game.time.events.remove(removePause);
                timeFadeTextLevel = 2;
                timeSpawnGreenEnnemies = 7000;
                timeSpawnMainEnnemies = 22000;
            }

            if (pauseGame2 == 0) {
                this.game.time.events.remove(removePause2);
            }

        }

    };

function gamePausedTuto () {
    pauseGame = +localStorage.getItem('gameWasPaused') || 1;
    game.paused = true;

    barTuto = game.add.graphics();
    barTuto.beginFill(0xffffff, 0.4);
    barTuto.drawRoundedRect(game.width/3.35, game.height/3.35, game.width / 2.5, game.height / 2.5, 10);

    style = { font: "32px Arial", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
    textTuto = game.add.text(game.world.centerX, game.world.centerY, "HOW TO PLAY : \nUse ARROW keys for move \nand SPACEBAR key for shooting \nClick or press ESC to resume \nHave fun ! :)", style);
    textTuto.padding.set(7,0);
    textTuto.setShadow(5, 5, 'rgba(0,0,0,0.3)', 5);
    textTuto.anchor.setTo(0.5, 0.5);

    var button = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    button.onDown.add(unpause, self);
    game.input.onDown.add(unpause, self);
    
};

function gamePausedTuto2 () {
    pauseGame2 = +localStorage.getItem('gameWasPaused2') || 1;
    game.paused = true;

    barTuto = game.add.graphics();
    barTuto.beginFill(0xffffff, 0.4);
    barTuto.drawRoundedRect(game.width/3.35, game.height/3.35, game.width / 2.5, game.height / 2.5, 10);

    style = { font: "32px Arial", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
    textTuto = game.add.text(game.world.centerX, game.world.centerY, "Some asteroids can contain an orb, \ntake it for restored your shield !", style);
    textTuto.padding.set(7,0);
    textTuto.setShadow(5, 5, 'rgba(0,0,0,0.3)', 5);
    textTuto.anchor.setTo(0.5, 0.5);

    fingerTuto = this.add.sprite(first.x - 30, first.y + 25, 'fingerTuto');
    fingerTuto.scale.x = 0.15;
    fingerTuto.scale.y = 0.15;

    var button = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    button.onDown.add(unpause2, self);
    game.input.onDown.add(unpause2, self);
};

function unpause (event){

    // Only act if paused
    if(game.paused){

        // Calculate the corners of the menu
        var x1 = wPaused/2 - 270/2, x2 = wPaused/2 + 270/2,
            y1 = hPaused/2 - 180/2, y2 = hPaused/2 + 180/2;

        // Check if the click was inside the menu
        if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){

            // Get menu local coordinates for the click
            var x = event.x - x1,
                y = event.y - y1;

        }
        else {
          // Remove the tuto
          barTuto.destroy();
          textTuto.destroy();

          // Unpause the game
          game.paused = false;
          pauseGame = 0;
          localStorage.setItem('gameWasPaused', pauseGame);         
      }
    }   
};

function unpause2 (event){

    // Only act if paused
    if(pauseGame2 == 1){

        // Calculate the corners of the menu
        var x1 = wPaused/2 - 270/2, x2 = wPaused/2 + 270/2,
            y1 = hPaused/2 - 180/2, y2 = hPaused/2 + 180/2;

        // Check if the click was inside the menu
        if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){

            // Get menu local coordinates for the click
            var x = event.x - x1,
                y = event.y - y1;

        }
        else {
          // Remove the tuto
          barTuto.destroy();
          textTuto.destroy();
          fingerTuto.kill();

          // Unpause the game
          game.paused = false;
          pauseGame2 = 0;
          localStorage.setItem('gameWasPaused2', pauseGame2);
      }
    }   
};

function fadeLevelText () {
    fadeInFirstLevelText = game.add.tween(firstLevelText);
    fadeInFirstLevelText.to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
    fadeInFirstLevelText.yoyo(true, 1000);
    fadeInFirstLevelText.onComplete.add(function() {
        firstLevelText.visible = false;
        firstLevelText.alpha = 0;
    });
};

function fireBullet(player) {
    //  Grab the first bullet we can from the pool
    var bullet = playerBullets.getFirstExists(false);
    var bulletSpeed = 600;
    var fireRate = 100;

    if (game.time.now >= nextFire) {
        if (bullet)
            {
                //  And fire it
                bullet.reset(player.x + 70, player.y + 35);
                bullet.body.velocity.x = bulletSpeed;
                bullet.scale.set(0.3);
                bullet.health = 1;
                playerShootChainGun.play();
                if (player.level >= 3) {
                    playerShootChainGun.stop();
                    game.cache.removeSound('playerShootChainGun');
                    playerShootChainGunUpgrade.play();
                }

            }
        nextFire = game.time.now + fireRate;
    }
};

function launchGreenEnemy() {
    var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 1000;
    var ENEMY_SPEED = -150;

    var enemy = greenEnemies.getFirstExists(false);
    // var bullet = enemyBullets.getFirstExists(false);
    if (enemy) {
        enemy.reset(this.game.width, game.rnd.integerInRange(0, this.game.height - this.game.height / 7));
        enemy.body.velocity.y = game.rnd.integerInRange(50, 100);
        enemy.body.velocity.x = ENEMY_SPEED;
        enemy.body.drag.y = 100;
        enemy.health = 1;

        // enemy.trail.start(false, 800, 1);

        enemy.update = function(){
            enemy.angle = -90 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

            
            // Kill enemies once they go off screen
            if (enemy.x > this.game.width) {
                enemy.kill();
            }
        }
    }

    // Send another enemy soon
    greenEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
};

function launchEnnemiesMain() {
    var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 1000;
    var ENEMY_SPEED = -120;

    var enemy = ennemiesMain.getFirstExists(false);
    // var bullet = enemyBullets.getFirstExists(false);
    if (enemy) {
        enemy.reset(this.game.width, game.rnd.integerInRange(0, this.game.height - this.game.height / 7));
        enemy.body.velocity.y = game.rnd.integerInRange(50, 100);
        enemy.body.velocity.x = ENEMY_SPEED;
        enemy.body.drag.y = 50;
        enemy.scale.set(0.25);
        enemy.health = 3;
        enemy.alpha = 1;

        enemy.trail.start(false, 800, 1);

        enemy.update = function(){
            enemy.angle = -90 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

            // fumee emit par les enemies
            enemy.trail.x = enemy.x + 70;
            enemy.trail.y = enemy.y + 25;

            
            // Kill enemies once they go off screen
            if (enemy.x > this.game.width) {
                enemy.kill();
            }
        }
    }

    // Send another enemy soon
    ennemiesMainLaunchTimer = game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchEnnemiesMain);
};

function launchLittleAsteroid() {
    var MIN_ASTEROID_SPACING = 3000;
    var MAX_ASTEROID_SPACING = 10000;
    var ASTEROID_SPEED = -75;

    var asteroid = littleAsteroid.getFirstExists(false);

    if (asteroid) {
        asteroid.reset(this.game.width, game.rnd.integerInRange(0, this.game.height - this.game.height / 7));
        asteroid.body.velocity.y = game.rnd.integerInRange(50, 100);
        asteroid.body.velocity.x = ASTEROID_SPEED;
        asteroid.body.drag.y = 100;
        asteroid.health = 2;

        asteroid.update = function(){
            
            // Kill enemies once they go off screen
            if (asteroid.x > this.game.width) {
                asteroid.kill();
            }
        }
    }

    // Send another enemy soon
    littleAsteroidLaunchTimer = game.time.events.add(game.rnd.integerInRange(MIN_ASTEROID_SPACING, MAX_ASTEROID_SPACING), launchLittleAsteroid);
};


function enemiesFire () {
    var bulletSpeed = -500;
    var fireRate = 2000;
    livingEnemies.length = 0;
    greenEnemies.forEachAlive(function(enemy){
        livingEnemies.push(enemy)
    });

    if(game.time.now >= nextFireEnemy) { 
        var bullet = enemyBullets.getFirstExists(false);
        if(bullet && livingEnemies.length > 0) {
            for (var i = 0; i < livingEnemies.length; i++){
            var shooter = livingEnemies[i];
            if (game.time.now >= shooter.nextFireChild) {

                bullet.reset(shooter.body.x - 10, shooter.body.y + 15);
                bullet.scale.set(-0.3);
                bullet.body.velocity.x = bulletSpeed;
                shooter.nextFireChild = game.time.now + fireRate;
            }

            }
        }
    }   
};

function enemiesFireMain () {
    // bullet speed ennemies
    var bulletSpeed = -400;
    var fireRate = 1500;
    livingEnemiesMain.length = 0;
    ennemiesMain.forEachAlive(function(enemy){
        livingEnemiesMain.push(enemy)
    });

    if(game.time.now >= nextFireEnemy) { 
        var bullet = enemyBullets.getFirstExists(false);
        if(bullet && livingEnemiesMain.length > 0) {
            for (var i = 0; i < livingEnemiesMain.length; i++){
            var shooter = livingEnemiesMain[i];
            if (game.time.now >= shooter.nextFireChild) {

                bullet.reset(shooter.body.x - 10, shooter.body.y + 25);
                bullet.scale.set(-0.3);
                bullet.body.velocity.x = bulletSpeed;
                shooter.nextFireChild = game.time.now + fireRate;
            }

            }
        }
    }   
};

function AnimDamaged (player) {
    electricDamaged.x = player.x;
    electricDamaged.y = player.y - 5;
    electricDamaged.visible = true;
    electricDamaged.play('electricDamaged');
    if (!player.alive) {
        electricDamaged.animations.stop();
        electricDamaged.visible = false;
        electricDamaged.kill();
    }
};

function AnimlevelUp (player) {
    var animlevelUpEmit = playerLevelUpAnim.getFirstExists(false);
    animlevelUpEmit.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    animlevelUpEmit.body.velocity.y = player.body.velocity.y;
    animlevelUpEmit.alpha = 0.7;
    animlevelUpEmit.play('playerLevelUpAnim', 30, false, true);
    trailAnim = animlevelUpEmit;

    // text xp above ennemies 
    removeTextLevelUp = game.add.bitmapText(player.x, player.y, 'spacefont', 'Level Up', 15);
    game.add.tween(removeTextLevelUp).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
    trailAnimText = removeTextLevelUp;

    animlevelUpEmit.update = function(){

        trailAnim.x = player.x + 35;
        trailAnim.y = player.y - 10;

        trailAnimText.x = player.x;
        trailAnimText.y = player.y - 5;
   }
};

function addEnemyEmitterTrail(enemy) {
    var enemyTrail = game.add.emitter(enemy.x, 10, 100);
    enemyTrail.width = 10;
    enemyTrail.makeParticles('explosionTrail', [1,2,3,4,5]);
    enemyTrail.setXSpeed(20, -20);
    enemyTrail.setRotation(50,-50);
    enemyTrail.setAlpha(0.4, 0, 800);
    enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
    enemy.trail = enemyTrail;
};

function shipCollide(player, enemy) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    explosionSound.play();
    enemy.kill();

    // flash effect on hit
    tweenPlayer = this.game.add.tween(player).to( { alpha: 0.5, tint: 0xf1f1f1 }, 50, "Linear", true, 0, 6);
    tweenPlayer.yoyo(true, 0);
    tweenPlayer.onComplete.add(function() {  
        tweenPlayer.stop();
        player.alpha = 1;
        player.tint = 0xffffff;
    });

    player.damage(greenDamageAmount);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';

    
};

function shipCollideEnemiesMain(player, enemy) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    explosionSound.play();
    enemy.kill();

    // flash effect on hit
    tweenPlayer = this.game.add.tween(player).to( { alpha: 0.5, tint: 0xf1f1f1 }, 50, "Linear", true, 0, 6);
    tweenPlayer.yoyo(true, 0);
    tweenPlayer.onComplete.add(function() {  
        tweenPlayer.stop();
        player.alpha = 1;
        player.tint = 0xffffff;
    });

    player.damage(enemyMainDamageAmount);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';

    
};

function shipCollideAsteroid(player, asteroid) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(asteroid.body.x + asteroid.body.halfWidth, asteroid.body.y + asteroid.body.halfHeight);
    explosion.body.velocity.y = asteroid.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    explosionSound.play();
    asteroid.kill();

    // flash effect on hit
    tweenPlayer = this.game.add.tween(player).to( { alpha: 0.5, tint: 0xf1f1f1 }, 50, "Linear", true, 0, 6);
    tweenPlayer.yoyo(true, 0);
    tweenPlayer.onComplete.add(function() {  
        tweenPlayer.stop();
        player.alpha = 1;
        player.tint = 0xffffff;
    });

    player.damage(greenDamageAmount);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';

    
};

function shipCollideShieldEnergy(player, shieldEnergy) {
    var animShieldRestored = playerLevelUpAnimShield.getFirstExists(false);
    animShieldRestored.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    animShieldRestored.body.velocity.y = player.body.velocity.y;
    animShieldRestored.alpha = 0.7;
    animShieldRestored.play('playerLevelUpAnimShield', 30, false, true);
    trailAnim = animShieldRestored;

    shieldEnergy.kill();
    if (player.health <= 99) {
        player.health+=20;
    }
    if (player.health > 100) {
        player.health = 100;
    }
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';

    animShieldRestored.update = function(){

        trailAnim.x = player.x + 35;
        trailAnim.y = player.y - 10;
   }

    
};

function hitEnemy(bullet, enemy) {
    
    enemy.health-=bullet.health;
    bullet.kill();
       
    if (enemy.health <= 0) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        explosionSound.play();
       
        enemy.kill();
        // text xp above ennemies 
        removeTextXp = this.game.add.text(enemy.x, enemy.y, 'exp: +' + greenEnemiesXp, { font: '12px Arial', fill: '#4dffa6' });  
        removeTextXp.stroke = "#000";
        removeTextXp.strokeThickness = 2;
        this.game.add.tween(removeTextXp).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);

        // add Exp
        this.player.exp += greenEnemiesXp;
        experience.text = 'Exp: ' + this.player.exp;

        // Increase score
        score += greenDamageAmount * 10;
        scoreText.text = 'Score: ' + score;
    }
};

function hitEnemyMain(bullet, enemy) {

    enemy.health-=bullet.health;
    bullet.kill();
    tweenEnnemies = this.game.add.tween(enemy).to( { alpha: 0.5, tint: 0xf1f1f1 }, 20, "Linear", true, 0, 6);
    tweenEnnemies.yoyo(true, 0);
    tweenEnnemies.onComplete.add(function() {
        tweenEnnemies.stop();
        enemy.alpha = 1;
        enemy.tint = 0xffffff;
    });

    if (enemy.health <= 0) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        explosionSound.play();

        enemy.kill();

        // text xp above ennemies 
        removeTextXp = this.game.add.text(enemy.x, enemy.y, 'exp: +' + ennemiesMainXp, { font: '12px Arial', fill: '#4dffa6' });  
        removeTextXp.stroke = "#000";
        removeTextXp.strokeThickness = 2;
        this.game.add.tween(removeTextXp).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);

        // add Exp
        this.player.exp += ennemiesMainXp;
        experience.text = 'Exp: ' + this.player.exp;

        // Increase score
        score += enemyMainDamageAmount * 10;
        scoreText.text = 'Score: ' + score;
    }
};

function hitAsteroid(bullet, asteroid) {
    
    asteroid.health-=bullet.health;
    bullet.kill();
    tweenAsteroid = this.game.add.tween(asteroid).to( { alpha: 0.5, tint: 0xf1f1f1 }, 20, "Linear", true, 0, 6);
    tweenAsteroid.yoyo(true, 0);
    tweenAsteroid.onComplete.add(function() {
        tweenAsteroid.stop();
        asteroid.alpha = 1;
        asteroid.tint = 0xffffff;
    });
       
    if (asteroid.health <= 0) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = asteroid.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        explosionSound.play();
       
        asteroid.kill();

        // random loot from asteroid
        randomLoot = game.rnd.integerInRange(1,5);

        if (randomLoot == 1) {
            // shield energy
            var lootEnergy = shieldEnergy.create(asteroid.x, asteroid.y, 'shieldEnergy');
            lootEnergy.anchor.setTo(0.5,0.5);
            lootEnergy.scale.set(1);
            lootEnergy.animations.add('shieldEnergy', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 20, true);
            lootEnergy.play('shieldEnergy');
            lootEnergy.body.velocity.x = -75;

            livingShieldChild.length = 0;
            for (var i = 0; i < shieldEnergy.children.length; i++){
                livingShieldChild.push(shieldEnergy.children[0]);
            }
            first = livingShieldChild[0];

            if (first.visible) {
                removePause2 = this.game.time.events.add(Phaser.Timer.SECOND * 1.3, gamePausedTuto2, this);          
            }
           
        }

    }
};



function hitEnemyBullet(bullet, bullet2) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    explosion.body.velocity.y = bullet.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    explosionSound.play();
    bullet.kill();
    bullet2.kill();
};

function enemyHitsPlayer (player, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    explosionSound.play();
    bullet.kill();

    // flash effect on hit
    tweenPlayer = this.game.add.tween(player).to( { alpha: 0.5, tint: 0xf1f1f1 }, 50, "Linear", true, 0, 6);
    tweenPlayer.yoyo(true, 0);
    tweenPlayer.onComplete.add(function() {  
        tweenPlayer.stop();
        player.alpha = 1;
        player.tint = 0xffffff;
    });

    player.damage(enemyMainDamageAmount);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';
};

function smoothStopScroll(){
    if (score >= 20000) {
        if (game.time.now >= nextIncrement) {
            if (nextIncrement == 0) {
                nextIncrement = game.time.now;
            }
            levelSpeedOne = levelSpeedTwo + 6;
            levelSpeedTwo = levelSpeedTwo + 10;
            nextIncrement+=1000;
            levelSpeedOne = Math.min(levelSpeedOne,0);
            levelSpeedTwo = Math.min(levelSpeedTwo,0);
        }
    }
};

function levelCleared() {
    greenEnemies.removeAll(true);
    ennemiesMain.removeAll(true);
    enemyBullets.removeAll(true);

    if ( endLevelOne.visible == false) {
        endLevelOne.visible = true;
        endLevelOne.alpha = 0;
        var fadeInEndLevel = game.add.tween(endLevelOne);
        fadeInEndLevel.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
        fadeInEndLevel.onComplete.add(setResetHandlersLevel);
        fadeInEndLevel.start();
        playerBullets.removeAll(true);
        shieldEnergy.removeAll(true);
        function setResetHandlersLevel() {
            //  The "click to restart" handler
            tapRestart = game.input.onTap.addOnce(_restart,this);
            spaceRestart = fireButton.onDown.addOnce(_restart,this);
            function _restart() {
              tapRestart.detach();
              spaceRestart.detach();
              // restart();
              game.state.start('level2');
              greenEnemyLaunchTimer = game.time.events.start();
              ennemiesMainLaunchTimer = game.time.events.start();
              littleAsteroidLaunchTimer = game.time.events.start();
            }
        }
    }
    
};
