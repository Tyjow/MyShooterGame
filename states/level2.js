    var level2 = function(game) {};

    var midBoss;
    var midBossSprite;
    var enemyMidBoss;
    var ennemiesMidBossXp = 100;
    var enemyMidBossDamageAmount = 20;
    var livingEnemiesMidBoss = [];
    var ENEMY_SPEED_MIDBOSS = 0;

    level2.prototype = {

        init: function () {

            this.game.renderer.renderSession.roundPixels = true;

            this.physics.startSystem(Phaser.Physics.ARCADE);

        },

        preload: function () {

            

        },

        create: function () {

            this.player = null;
            this.cursors = null;
            this.speed = 300;

            levelSpeedOne = -60;
            levelSpeedTwo = -100;
            nextIncrement = 0;

            playerShootChainGun = this.game.add.audio('playerShootChainGun');
            playerShootChainGun.volume = 0.05;

            playerShootChainGunUpgrade = this.game.add.audio('playerShootChainGunUpgrade');
            playerShootChainGunUpgrade.volume = 0.03;

            explosionSound = this.game.add.audio('explosionSound');
            explosionSound.volume = 0.1;

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
            greenEnemies.createMultiple(35, 'enemy');
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
            ennemiesMain.createMultiple(4, 'enemyMain');
            ennemiesMain.setAll('outOfBoundsKill', true);
            ennemiesMain.setAll('checkWorldBounds', true);
            ennemiesMain.forEach(function(enemy){
               enemy.health = 3;
               enemy.alpha = 1;
               enemy.animations.add('enemyFlyMain', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 15, true);
               enemy.animations.play('enemyFlyMain');
               addEnemyEmitterTrail(enemy);
               enemy.nextFireChild = 0;
               enemyMainDamageAmount = damageAmountEnemies * 2;
               enemy.events.onKilled.add(function(){
                      
                    enemy.trail.kill();
                    
                });
               enemy.events.onRemovedFromGroup.add(function(){
                      
                    enemy.trail.kill();
                    
                });
            });

            // mid boss
            midBoss = game.add.group();
            midBoss.enableBody = true;
            midBoss.physicsBodyType = Phaser.Physics.ARCADE;
            midBoss.setAll('anchor.x', 0.5);
            midBoss.setAll('anchor.y', 0.5);
            midBoss.setAll('scale.x', 0.5);
            midBoss.setAll('scale.y', 0.5);
            midBoss.setAll('outOfBoundsKill', true);
            midBoss.setAll('checkWorldBounds', true);
               

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
            this.game.time.events.add(7000, launchGreenEnemy);
            this.game.time.events.add(22000, launchEnnemiesMain);

 
            this.game.time.events.add(1000, launchMidBoss);
            

            // Temps de spawn asteroids
            this.game.time.events.add(9000, launchLittleAsteroid);

            //  Game over text
            gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
            gameOver.anchor.setTo(0.5, 0.5);
            gameOver.visible = false;

            // End Level Text
            endLevelOne = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'Level Completed!', 110);
            endLevelOne.anchor.setTo(0.5, 0.5);
            endLevelOne.visible = false;

            // Level 2 Text
            firstLevelText = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'Level 2', 110);
            firstLevelText.anchor.setTo(0.5, 0.5);
            firstLevelText.visible = true;
            firstLevelText.alpha = 0;

            // fade text level time
            this.game.time.events.add(Phaser.Timer.SECOND * 2, fadeLevelText, this);

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
            this.game.physics.arcade.overlap(this.player, midBoss, shipCollideMidBoss, null, this);
            this.game.physics.arcade.overlap(playerBullets, midBoss, hitMidBoss, null, this);
            this.game.physics.arcade.overlap(this.player, littleAsteroid, shipCollideAsteroid, null, this);
            this.game.physics.arcade.overlap(this.player, shieldEnergy, shipCollideShieldEnergy, null, this);
            this.game.physics.arcade.overlap(playerBullets, littleAsteroid, hitAsteroid, null, this);
            this.game.physics.arcade.overlap(enemyBullets, this.player, enemyHitsPlayer, null, this);
            this.game.physics.arcade.overlap(enemyBullets, this.player, enemyMidBossHitsPlayer, null, this);
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
                littleAsteroid.removeAll(true);
                midBoss.removeAll(true);
                function setResetHandlers() {
                    //  The "click to restart" handler
                    tapRestart = this.game.input.onTap.addOnce(_restart,this);
                    spaceRestart = fireButton.onDown.addOnce(_restart,this);
                    function _restart() {
                      tapRestart.detach();
                      spaceRestart.detach();
                      // restart();
                      mainSound.stop();
                      music.play();
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

            if (this.player.level >= 2) {
                // playerBullets.forEachAlive(function(bullet){
                //     bullet.scale.set(0.4);
                //     bullet.health = 2;
                // });
                fireRatePlayer = 250;
            }

            // level 3 or more higher playerBullets become more powerful
            if (this.player.level >= 3) {
                fireRatePlayer = 200;
            }

            if (this.player.level >= 4) {
                fireRatePlayer = 150;
            }

            if (this.player.level >= 5) {
                fireRatePlayer = 100;
            }


            if (this.player.health <= 100 / 4) {
               AnimDamaged(this.player);
            }
            if (this.player.health >= 100 / 4) {
                electricDamaged.visible = false;
                electricDamaged.animations.stop();
            }


            // score condition end level 2
            smoothStopScrollLevel2();

            // stop launch ennemies before level cleared
            if (levelSpeedOne >= -59 && levelSpeedTwo >= -99) {
                greenEnemyLaunchTimer = game.time.events.stop();
                ennemiesMainLaunchTimer = game.time.events.stop();
                littleAsteroidLaunchTimer = game.time.events.stop();
            }

            // remove all element on screen and add msg Level Complete
            if (levelSpeedOne >= 0 && levelSpeedTwo >= 0) {
                level2Cleared();
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

function launchMidBoss() {

    midBoss.create(this.game.width,this.game.height/2.5, 'midBoss');
    enemyMidBoss = midBoss.children[0];

    if (enemyMidBoss) {

        enemyMidBoss.alive = false;
        enemyMidBoss.health = 40;
        enemyMidBoss.nextFireChild = 0;
        enemyMidBoss.nextFireChild2 = 0;
        enemyMidBoss.nextFireChild3 = 0;
        

        enemyMidBoss.alpha = 1;

        enemyMidBoss.update = function() {
            if (score >= 30000) {

                enemyMidBoss.alive = true;
                ENEMY_SPEED_MIDBOSS = -120;
                enemyMidBoss.body.velocity.x = ENEMY_SPEED_MIDBOSS;
                enemyMidBoss.body.drag.y = 50;
                enemyMidBoss.angle = -90 - game.math.radToDeg(Math.atan2(enemyMidBoss.body.velocity.x, enemyMidBoss.body.velocity.y));
            
                // Kill mid boss once he go off screen
                if (enemyMidBoss.x > this.game.width) {
                    enemyMidBoss.kill();
                }

                if (enemyMidBoss.x <= this.game.width/1.4) {
                    enemyMidBoss.body.velocity.x = 0;
                    enemyMidBoss.angle = 0;
                }
            }

            if (enemyMidBoss.visible == true && enemyMidBoss.body.velocity.x == 0) {
                enemiesFireMidBoss();
                enemiesFireMidBoss2();
                enemiesFireMidBoss3();
            }
        }
    }
};

function shipCollideMidBoss(player, enemy) {
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

    player.kill();
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';

    
};

function hitMidBoss(bullet, enemy) {

    if (enemy.alive == false) { return; }
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
        removeTextXp = this.game.add.text(enemy.x, enemy.y, 'exp: +' + ennemiesMidBossXp, { font: '12px Arial', fill: '#4dffa6' });  
        removeTextXp.stroke = "#000";
        removeTextXp.strokeThickness = 2;
        this.game.add.tween(removeTextXp).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);

        // add Exp
        this.player.exp += ennemiesMidBossXp;
        experience.text = 'Exp: ' + this.player.exp;

        // Increase score
        score += enemyMidBossDamageAmount * 50;
        scoreText.text = 'Score: ' + score;
    }
};

function enemyMidBossHitsPlayer (player, bullet) {
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

    player.damage(enemyMidBossDamageAmount);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';
};

function enemiesFireMidBoss () {
    if (!ENEMY_SPEED_MIDBOSS == 0) {
        // bullet speed ennemies
        var bulletSpeed = -400;
        var fireRate = 800;

        if(game.time.now >= nextFireEnemy) { 
            var bullet = enemyBullets.getFirstExists(false);
            var shooter = enemyMidBoss;
            if (game.time.now >= shooter.nextFireChild) {

                bullet.reset(shooter.x - 10, shooter.y + 25);
                bullet.scale.set(-0.3);
                bullet.body.velocity.x = bulletSpeed;
                shooter.nextFireChild = game.time.now + fireRate;
            }
        }

    }

};

function enemiesFireMidBoss2 () {
    if (!ENEMY_SPEED_MIDBOSS == 0) {
    // bullet speed ennemies
    var bulletSpeed = -400;
    var fireRate = 800;

    if(game.time.now >= nextFireEnemy) { 
        var bullet = enemyBullets.getFirstExists(false);
        var shooter = enemyMidBoss;
        if (game.time.now >= shooter.nextFireChild2) {

            bullet.reset(shooter.x - 10, shooter.y + 75);
            bullet.scale.set(-0.3);
            bullet.body.velocity.x = bulletSpeed;
            shooter.nextFireChild2 = game.time.now + fireRate;
        }
    }
   }

};

function enemiesFireMidBoss3 () {
    if (!ENEMY_SPEED_MIDBOSS == 0) {
    // bullet speed ennemies
    var bulletSpeed = -400;
    var fireRate = 800;

    if(game.time.now >= nextFireEnemy) { 
        var bullet = enemyBullets.getFirstExists(false);
        var shooter = enemyMidBoss;
        if (game.time.now >= shooter.nextFireChild3) {

            bullet.reset(shooter.x - 10, shooter.y + 125);
            bullet.scale.set(-0.3);
            bullet.body.velocity.x = bulletSpeed;
            shooter.nextFireChild3 = game.time.now + fireRate;
        }
    }
   }

};

    function smoothStopScrollLevel2(){
    if (score >= 40000) {
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

function level2Cleared() {
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
        littleAsteroid.removeAll(true);
        function setResetHandlersLevel() {
            //  The "click to restart" handler
            tapRestart = game.input.onTap.addOnce(_restart,this);
            spaceRestart = fireButton.onDown.addOnce(_restart,this);
            function _restart() {
              tapRestart.detach();
              spaceRestart.detach();
              // restart();
              game.state.start("GameMenu");
              greenEnemyLaunchTimer = game.time.events.start();
              ennemiesMainLaunchTimer = game.time.events.start();
              littleAsteroidLaunchTimer = game.time.events.start();
            }
        }
    }
    
};

