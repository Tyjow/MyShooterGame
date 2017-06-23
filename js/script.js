    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    //  Our core Bullet class
    //  This is a simple Sprite object that we set a few properties on
    //  It is fired by all of the Weapon classes

    var Bullet = function (game, key) {

        Phaser.Sprite.call(this, game, 0, 0, key);

        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

        this.anchor.set(0.5);

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.enableBody = true;

        this.tracking = false;
        this.scaleSpeed = 0;

    };

    Bullet.prototype = Object.create(Phaser.Sprite.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y);
        this.scale.set(0.3);

        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

        this.angle = angle;

        this.body.gravity.set(gx, gy);

    };

    Bullet.prototype.update = function () {

        if (this.tracking)
        {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }

        if (this.scaleSpeed > 0)
        {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }

    };

    var greenEnemies;
    var greenEnemiesXp = 10;
    var ennemiesMainXp = 20;
    var explosions;
    var shields;
    var shipTrail;
    var greenEnemyLaunchTimer;
    var gameOver;
    var endLevelOne;
    var fireButton;
    var score = 0;
    var scoreText;
    var wepEnemy;
    var greenDamageAmount;
    var damageAmountEnemies = 10;
    var enemyBullets;
    var livingEnemies = [];
    var livingEnemiesMain = [];
    var nextFireEnemy = 0;
    var removeTextXp;
    var gainXpPlayer;
    var getXpPlayer;
    var tweenPlayer;
    var tweenEnnemies;
    var levelSpeedOne = -40;
    var levelSpeedTwo = -100;
    var nextIncrement = 0;
    var nextFire = 0;
    var removeTextLevelUp;
    var playerLevelUpAnim;
    var enemyHealth;
    var playerShootChainGun;
    var explosionSound;
    var mainSound;
    var levelUpSound;

    // addEnemy = function(game,x,y) {

    //     var foreGroup = this.game.add.group();

    //     this.enemy = foreGroup.create(x,y,'enemy');
    //     this.enemy.anchor.setTo(0.5,0.5);
    //     this.enemy.animations.add('swim', Phaser.Animation.generateFrameNames('enemy', 0), 30, true);
    //     this.enemy.animations.play('swim');
    //     this.enemy.scale.x *= -1;

    //     this.game.add.tween(foreGroup).to({ x: -3500 }, 15000, Phaser.Easing.Quadratic.InOut, true, 0, 2000, false);
    //      // this.foreground = this.add.sprite(1920, 700, 'foreground');
    // };

    var Weapon = {};

    ////////////////////////////////////////////////////
    //  A single bullet is fired in front of the ship //
    ////////////////////////////////////////////////////

    Weapon.SingleBullet = function (game) {

        Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet01'), true);
        }

        return this;

    };

    Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
    Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

    Weapon.SingleBullet.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) { 

            var x = source.x + 70;
            var y = source.y + 40;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }

    };

    Weapon.SingleBullet.prototype.touch_bullet=function(item){
        this.weapon.bullets.forEach(function(item){
            if(item.alive){ 
                item.visible=false
            }
        });
    };

    /////////////////////////////////////////////////////////
    //  A bullet is shot both in front and behind the ship //
    /////////////////////////////////////////////////////////

    Weapon.FrontAndBack = function (game) {

        Phaser.Group.call(this, game, game.world, 'Front And Back', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.FrontAndBack.prototype = Object.create(Phaser.Group.prototype);
    Weapon.FrontAndBack.prototype.constructor = Weapon.FrontAndBack;

    Weapon.FrontAndBack.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) { 

            var x = source.x + 10;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    //////////////////////////////////////////////////////
    //  3-way Fire (directly above, below and in front) //
    //////////////////////////////////////////////////////

    Weapon.ThreeWay = function (game) {

        Phaser.Group.call(this, game, game.world, 'Three Way', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 96; i++)
        {
            this.add(new Bullet(game, 'bullet7'), true);
        }

        return this;

    };

    Weapon.ThreeWay.prototype = Object.create(Phaser.Group.prototype);
    Weapon.ThreeWay.prototype.constructor = Weapon.ThreeWay;

    Weapon.ThreeWay.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) { 

            var x = source.x + 10;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    /////////////////////////////////////////////
    //  8-way fire, from all sides of the ship //
    /////////////////////////////////////////////

    Weapon.EightWay = function (game) {

        Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 96; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
    Weapon.EightWay.prototype.constructor = Weapon.EightWay;

    Weapon.EightWay.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 16;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    ////////////////////////////////////////////////////
    //  Bullets are fired out scattered on the y axis //
    ////////////////////////////////////////////////////

    Weapon.ScatterShot = function (game) {

        Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 40;

        for (var i = 0; i < 32; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
    Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

    Weapon.ScatterShot.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 16;
            var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    //////////////////////////////////////////////////////////////////////////
    //  Fires a streaming beam of lazers, very fast, in front of the player //
    //////////////////////////////////////////////////////////////////////////

    Weapon.Beam = function (game) {

        Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 1000;
        this.fireRate = 45;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet11'), true);
        }

        return this;

    };

    Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
    Weapon.Beam.prototype.constructor = Weapon.Beam;

    Weapon.Beam.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 40;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    ///////////////////////////////////////////////////////////////////////
    //  A three-way fire where the top and bottom bullets bend on a path //
    ///////////////////////////////////////////////////////////////////////

    Weapon.SplitShot = function (game) {

        Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 700;
        this.fireRate = 40;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet8'), true);
        }

        return this;

    };

    Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
    Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

    Weapon.SplitShot.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 20;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -500);
            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 500);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    ///////////////////////////////////////////////////////////////////////
    //  Bullets have Gravity.y set on a repeating pre-calculated pattern //
    ///////////////////////////////////////////////////////////////////////

    Weapon.Pattern = function (game) {

        Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 40;

        this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
        this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

        this.patternIndex = 0;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet4'), true);
        }

        return this;

    };

    Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
    Weapon.Pattern.prototype.constructor = Weapon.Pattern;

    Weapon.Pattern.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 20;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, this.pattern[this.patternIndex]);

            this.patternIndex++;

            if (this.patternIndex === this.pattern.length)
            {
                this.patternIndex = 0;
            }

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    ///////////////////////////////////////////////////////////////////
    //  Rockets that visually track the direction they're heading in //
    ///////////////////////////////////////////////////////////////////

    Weapon.Rockets = function (game) {

        Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 400;
        this.fireRate = 250;

        for (var i = 0; i < 32; i++)
        {
            this.add(new Bullet(game, 'bullet10'), true);
        }

        this.setAll('tracking', true);

        return this;

    };

    Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
    Weapon.Rockets.prototype.constructor = Weapon.Rockets;

    Weapon.Rockets.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 10;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -700);
            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 700);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    ////////////////////////////////////////////////////////////////////////
    //  A single bullet that scales in size as it moves across the screen //
    ////////////////////////////////////////////////////////////////////////

    Weapon.ScaleBullet = function (game) {

        Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 800;
        this.fireRate = 100;

        for (var i = 0; i < 32; i++)
        {
            this.add(new Bullet(game, 'bullet9'), true);
        }

        this.setAll('scaleSpeed', 0.05);

        return this;

    };

    Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
    Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

    Weapon.ScaleBullet.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x + 10;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }


    };

    /////////////////////////////////////////////
    //  A Weapon Combo - Single Shot + Rockets //
    /////////////////////////////////////////////

    Weapon.Combo1 = function (game) {

        this.name = "Combo One";
        this.weapon1 = new Weapon.SingleBullet(game);
        this.weapon2 = new Weapon.Rockets(game);

    };

    Weapon.Combo1.prototype.reset = function () {

        this.weapon1.visible = false;
        this.weapon1.callAll('reset', null, 0, 0);
        this.weapon1.setAll('exists', false);

        this.weapon2.visible = false;
        this.weapon2.callAll('reset', null, 0, 0);
        this.weapon2.setAll('exists', false);

    };

    Weapon.Combo1.prototype.fire = function (source) {

        this.weapon1.fire(source);
        this.weapon2.fire(source);

    };

    /////////////////////////////////////////////////////
    //  A Weapon Combo - ThreeWay, Pattern and Rockets //
    /////////////////////////////////////////////////////

    Weapon.Combo2 = function (game) {

        this.name = "Combo Two";
        this.weapon1 = new Weapon.Pattern(game);
        this.weapon2 = new Weapon.ThreeWay(game);
        this.weapon3 = new Weapon.Rockets(game);

    };

    Weapon.Combo2.prototype.reset = function () {

        this.weapon1.visible = false;
        this.weapon1.callAll('reset', null, 0, 0);
        this.weapon1.setAll('exists', false);

        this.weapon2.visible = false;
        this.weapon2.callAll('reset', null, 0, 0);
        this.weapon2.setAll('exists', false);

        this.weapon3.visible = false;
        this.weapon3.callAll('reset', null, 0, 0);
        this.weapon3.setAll('exists', false);

    };

    Weapon.Combo2.prototype.fire = function (source) {

        this.weapon1.fire(source);
        this.weapon2.fire(source);
        this.weapon3.fire(source);

    };

    //  The core game loop

    var PhaserGame = function () {

        this.background = null;
        this.midground = null;
        this.foreground = null;

        this.player = null;
        this.cursors = null;
        this.speed = 300;

        this.weapons = [];
        this.currentWeapon = 0;
        this.weaponName = null;
        this.weaponsEnemy = [];

    };

    PhaserGame.prototype = {

        init: function () {

            this.game.renderer.renderSession.roundPixels = true;

            this.physics.startSystem(Phaser.Physics.ARCADE);

        },

        preload: function () {

            //  We need this because the assets are on Amazon S3
            //  Remove the next 2 lines if running locally
            // this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue007/';
            // this.load.crossOrigin = 'anonymous';
            this.load.crossOrigin = true;

            this.load.image('foreground', 'img/spaceRoc3.png');
            this.load.image('midground', 'img/spacescape.png');
            this.load.image('background', 'img/space4.jpg');
            // this.load.image('player', 'img/ship2.png');
            // this.load.image('enemy', 'img/sat1.png');
            this.load.spritesheet('player', 'img/player-ship.png', 200, 170);
            this.load.spritesheet('enemy', 'img/enemies-sat1.png', 94, 101);
            this.load.spritesheet('enemyMain', 'img/enemies-main1.png', 276, 215);
            this.load.spritesheet('playerLevelUpAnim', 'img/levelup-anim.png', 128, 128);
            this.load.image('playerBullets', 'img/bullet01.png');
            this.load.image('enemyBullets', 'img/bullet01.png');
            this.load.spritesheet('explosionTrail', 'img/explode.png', 128, 128);
            this.load.spritesheet('explosion', 'img/explode-anim.png', 300, 292);
            this.load.bitmapFont('shmupfont', 'img/shmupfont.png', 'img/shmupfont.xml');
            this.load.bitmapFont('spacefont', 'img/tyjowfont.png', 'img/tyjowfont.xml');

            this.load.audio('playerShootChainGun', 'media/shoot5.mp3', true);
            this.load.audio('explosionSound', 'media/explosion2-sound.mp3', true);
            this.load.audio('mainSound', 'media/main-sound.ogg', true);
            this.load.audio('levelUpSound', 'media/levelup-sound.wav', true);

            for (var i = 1; i <= 11; i++)
            {
                this.load.image('bullet0' + i, 'img/bullet0' + i + '.png');
            }

            //  Note: Graphics are not for use in any commercial project

        },

        create: function () {

            this.w = window.innerWidth;
            this.h = window.innerHeight;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setGameSize(this.w,this.h);
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVeritcally = true;
            this.game.scale.refresh();

            playerShootChainGun = this.game.add.audio('playerShootChainGun');
            playerShootChainGun.volume = 0.3;

            explosionSound = this.game.add.audio('explosionSound');
            explosionSound.volume = 0.2;

            mainSound = this.game.add.audio('mainSound');
            mainSound.volume = 0.9;
            mainSound.play();

            levelUpSound = this.game.add.audio('levelUpSound');
            levelUpSound.volume = 1.1;

            // this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            // this.background.scale.x = 1.1;
            // this.background.scale.y = 1.1;
            this.midground = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'midground');
            this.midground.autoScroll(levelSpeedOne, 0);

            this.weapons.push(new Weapon.SingleBullet(this.game));
            this.weapons.push(new Weapon.FrontAndBack(this.game));
            this.weapons.push(new Weapon.ThreeWay(this.game));
            this.weapons.push(new Weapon.EightWay(this.game));
            this.weapons.push(new Weapon.ScatterShot(this.game));
            this.weapons.push(new Weapon.Beam(this.game));
            this.weapons.push(new Weapon.SplitShot(this.game));
            this.weapons.push(new Weapon.Pattern(this.game));
            this.weapons.push(new Weapon.Rockets(this.game));
            this.weapons.push(new Weapon.ScaleBullet(this.game));
            this.weapons.push(new Weapon.Combo1(this.game));
            this.weapons.push(new Weapon.Combo2(this.game));

            // wepEnemy = new Weapon.SingleBulletEnemy(this.game);

            // this.weaponsEnemy.push(new Weapon.SingleBulletEnemy(this.game));

            this.currentWeapon = 0;

            for (var i = 1; i < this.weapons.length; i++)
            {
                this.weapons[i].visible = false;
            }

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


            shipTrail = this.game.add.emitter(this.player.x, this.player.y + 10, 400);
            shipTrail.width = 10;
            shipTrail.makeParticles('explosionTrail', [1,2,3,4,5]);
            shipTrail.setXSpeed(20, -20);
            shipTrail.setRotation(50,-50);
            shipTrail.setAlpha(0.4, 0, 800);
            shipTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
            shipTrail.start(false, 5000, 10);

            // playerLevelUpAnim = this.game.add.emitter(this.player.x, this.player.y, 0);
            // playerLevelUpAnim.makeParticles('playerLevelUpAnim', Phaser.ArrayUtils.numberArray(1, 56));
            
            //  The baddies!
            greenEnemies = game.add.group();
            greenEnemies.enableBody = true;
            greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
            greenEnemies.createMultiple(30, 'enemy');
            // greenEnemies.setAll('anchor.x', 0.5);
            // greenEnemies.setAll('anchor.y', 0.5);
            greenEnemies.setAll('scale.x', -0.3);
            greenEnemies.setAll('scale.y', 0.3);
            // greenEnemies.setAll('angle', 180);
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
            // greenEnemies.setAll('anchor.x', 0.5);
            // greenEnemies.setAll('anchor.y', 0.5);
/*            ennemiesMain.setAll('scale.x', 0.25);
            ennemiesMain.setAll('scale.y', 0.25);*/
            // greenEnemies.setAll('angle', 180);
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
            this.game.time.events.add(1000, launchGreenEnemy);
            this.game.time.events.add(15000, launchEnnemiesMain);

            //  Game over text
            gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
            gameOver.anchor.setTo(0.5, 0.5);
            gameOver.visible = false;

            // End Level Text
            endLevelOne = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'Level Complete!', 110);
            endLevelOne.anchor.setTo(0.5, 0.5);
            endLevelOne.visible = false;

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

            //  Shields stat
            shields = this.game.add.bitmapText(10, 10, 'spacefont', 'Shield: ' + this.player.health +'%', 40);

            level = this.game.add.bitmapText(this.game.world.width / 4, 10, 'spacefont', 'Level: ' + this.player.level, 40);

            experience = this.game.add.bitmapText(this.game.world.width / 2, 10, 'spacefont', 'Exp: ' + this.player.exp, 40);

            //  Score
            scoreText = this.game.add.bitmapText(this.game.world.width, 10, 'spacefont', 'Score: ' + score, 40);

            // bitmaptext align right
            scoreText.anchor.set(1,0);

            this.foreground = this.add.tileSprite(0, this.game.height - this.game.cache.getImage('foreground').height, this.game.width, this.game.height, 'foreground');
            
            this.foreground.autoScroll(levelSpeedTwo, 0);

            //  Cursor keys to fly + space to fire
            this.cursors = this.input.keyboard.createCursorKeys();

            this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

            fireButton = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
            // var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // changeKey.onDown.add(this.nextWeapon, this);

        },

        // nextWeapon: function () {

        //     //  Tidy-up the current weapon
        //     if (this.currentWeapon > 9)
        //     {
        //         this.weapons[this.currentWeapon].reset();
        //     }
        //     else
        //     {
        //         this.weapons[this.currentWeapon].visible = false;
        //         this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
        //         this.weapons[this.currentWeapon].setAll('exists', false);
        //     }

        //     //  Activate the new one
        //     this.currentWeapon++;

        //     if (this.currentWeapon === this.weapons.length)
        //     {
        //         this.currentWeapon = 0;
        //     }

        //     this.weapons[this.currentWeapon].visible = true;

        //     this.weaponName.text = this.weapons[this.currentWeapon].name;

        // },

        update: function () {

            // c'est comme this.background.autoScroll(-40, 0);
            // this.background.tilePosition.x -= 1.5;

            //  Check collisions
            this.game.physics.arcade.overlap(this.player, greenEnemies, shipCollide, null, this);
            this.game.physics.arcade.overlap(playerBullets, greenEnemies, hitEnemy, null, this);
            this.game.physics.arcade.overlap(this.player, ennemiesMain, shipCollideEnemiesMain, null, this);
            this.game.physics.arcade.overlap(playerBullets, ennemiesMain, hitEnemyMain, null, this);
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
                function setResetHandlers() {
                    //  The "click to restart" handler
                    tapRestart = this.game.input.onTap.addOnce(_restart,this);
                    spaceRestart = fireButton.onDown.addOnce(_restart,this);
                    function _restart() {
                      tapRestart.detach();
                      spaceRestart.detach();
                      // restart();
                      this.game.state.restart();
                      score = 0;
                      levelSpeedOne = -40;
                      levelSpeedTwo = -100;
                      nextIncrement = 0;
                      livingEnemies = [];
                      livingEnemiesMain = [];
                      greenEnemyLaunchTimer = game.time.events.start();
                      ennemiesMainLaunchTimer = game.time.events.start();
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
            shipTrail.y = this.player.y + 30;

            //  Fire bullet
            if (this.player.alive && (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))) {
                // this.weapons[this.currentWeapon].fire();
                fireBullet(this.player);
            }

            // set exp to get for level up
            gainXpPlayer = 75 * greenEnemiesXp;

            getXpPlayer = this.player.level * gainXpPlayer;

            if (this.player.exp >= getXpPlayer) {
                this.player.level++;
                level.text = 'Level: ' + this.player.level;
                
                // Anim level up
                AnimlevelUp(this.player);
                this.player.health = 100;
                shields.text = 'Shield: ' + Math.max(this.player.health, 0) +'%';
                levelUpSound.play();
            }

            if (this.player.level >= 3) {
                playerBullets.forEachAlive(function(bullet){
                    bullet.scale.set(0.4);
                    bullet.health = 2;
                });
            }

            // score condition end level 1
            smoothStopScroll();

            // stop launch ennemies before level cleared
            if (levelSpeedOne >= -39 && levelSpeedTwo >= -99) {
                greenEnemyLaunchTimer = game.time.events.stop();
                ennemiesMainLaunchTimer = game.time.events.stop();
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

        }

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
                bullet.reset(player.x + 70, player.y + 40);
                bullet.body.velocity.x = bulletSpeed;
                bullet.scale.set(0.3);
                bullet.health = 1;
                playerShootChainGun.play();

                // game.physics.arcade.velocityFromAngle(0, bulletSpeed, bullet.body.velocity);

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
        enemy.reset(this.game.width, game.rnd.integerInRange(0, this.game.height - this.game.height / 8));
        enemy.body.velocity.y = game.rnd.integerInRange(50, 100);
        enemy.body.velocity.x = ENEMY_SPEED;
        enemy.body.drag.y = 100;
        enemy.health = 1;

        // enemy.trail.start(false, 800, 1);

        enemy.update = function(){
            enemy.angle = -90 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

            // fumee emit par les enemies
            // enemy.trail.x = enemy.x;
            // enemy.trail.y = enemy.y + 10;

            
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
    var ENEMY_SPEED = -100;

    var enemy = ennemiesMain.getFirstExists(false);
    // var bullet = enemyBullets.getFirstExists(false);
    if (enemy) {
        enemy.reset(this.game.width, game.rnd.integerInRange(0, this.game.height - this.game.height / 8));
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
    // game.add.tween(removeTextLevelUp).to( { y: player.y - 10 }, 1500, Phaser.Easing.Linear.None, true);
    trailAnimText = removeTextLevelUp;

    animlevelUpEmit.update = function(){

        trailAnim.x = player.x + 40;
        trailAnim.y = player.y;

        trailAnimText.x = player.x;
        trailAnimText.y = player.y;
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
            levelSpeedOne = levelSpeedTwo + 4;
            levelSpeedTwo = levelSpeedTwo + 10;
            nextIncrement+=1000;
            levelSpeedOne = Math.min(levelSpeedOne,0);
            levelSpeedTwo = Math.min(levelSpeedTwo,0);
            // console.log(levelSpeedTwo);
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
        function setResetHandlersLevel() {
            //  The "click to restart" handler
            tapRestart = game.input.onTap.addOnce(_restart,this);
            spaceRestart = fireButton.onDown.addOnce(_restart,this);
            function _restart() {
              tapRestart.detach();
              spaceRestart.detach();
              // restart();
              game.state.restart();
              score = 0;
              levelSpeedOne = -40;
              levelSpeedTwo = -100;
              nextIncrement = 0;
              livingEnemies = [];
              livingEnemiesMain = [];
              greenEnemyLaunchTimer = game.time.events.start();
              ennemiesMainLaunchTimer = game.time.events.start();
            }
        }
    }
    
};

// function restart (player) {
//     //  Reset the enemies
//     greenEnemies.callAll('kill');
//     game.time.events.remove(greenEnemyLaunchTimer);
//     game.time.events.add(1000, launchGreenEnemy);

//     //  Revive the player
//     player.reset(0,0);
//     player.health = 100;
//     score = 0;
//     scoreText.render();

//     //  Hide the text
//     gameOver.visible = false;

// }

    game.state.add('Game', PhaserGame, true);
