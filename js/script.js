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

    //////// bullet enemies //////////

    var BulletBaddies = function (game, key) {

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

    BulletBaddies.prototype = Object.create(Phaser.Sprite.prototype);
    BulletBaddies.prototype.constructor = BulletBaddies;

    BulletBaddies.prototype.fire = function (x, y, angle, speed, gx, gy) {

        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y);
        this.scale.set(-1);

        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

        this.angle = angle;

        this.body.gravity.set(gx, gy);

    };

    BulletBaddies.prototype.update = function () {

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
    var explosions;
    var shields;
    var shipTrail;
    var greenEnemyLaunchTimer;
    var gameOver;
    var fireButton;
    var score = 0;
    var scoreText;
    var wepEnemy;
    var damageAmountEnemies = 10;
    var enemyBullets;
    var livingEnemies = [];
    var nextFireEnemy = 0;
    var removeTextXp;
    var gainXpPlayer;
    var getXpPlayer;
    var tweenPlayer;

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

///////////////////////////// Enemy weapon ////////////////////////////

    Weapon.SingleBulletEnemy = function (game) {

        Phaser.Group.call(this, game, game.world, 'Enemy Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = -600;
        this.fireRate = 1000;

        for (var i = 0; i < 64; i++)
        {
            this.add(new BulletBaddies(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.SingleBulletEnemy.prototype = Object.create(Phaser.Group.prototype);
    Weapon.SingleBulletEnemy.prototype.constructor = Weapon.SingleBulletEnemy;

    Weapon.SingleBulletEnemy.prototype.fire = function (source) {

        if (this.game.time.time >= this.nextFire) {

            var x = source.x - 10;
            var y = source.y + 10;

            this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;

        }

    };

    Weapon.SingleBulletEnemy.prototype.touch_bullet=function(item){
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

            this.load.image('foreground', 'img/spaceRoc2.png');
            this.load.image('midground', 'img/spacescape.png');
            this.load.image('background', 'img/space4.jpg');
            // this.load.image('player', 'img/ship2.png');
            this.load.image('enemy', 'img/sat1.png');
            this.load.spritesheet('player', 'img/player-ship.png', 200, 170);
            this.load.image('enemyBullets', 'img/bullet01.png');
            this.load.spritesheet('explosion', 'img/explode.png', 128, 128);
            this.load.bitmapFont('shmupfont', 'img/shmupfont.png', 'img/shmupfont.xml');
            this.load.bitmapFont('spacefont', 'img/tyjowfont.png', 'img/tyjowfont.xml');

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

            // this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            // this.background.scale.x = 1.1;
            // this.background.scale.y = 1.1;
            this.midground = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'midground');
            this.midground.autoScroll(-40, 0);

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

            wepEnemy = new Weapon.SingleBulletEnemy(this.game);

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
            shipTrail.makeParticles('explosion', [1,2,3,4,5]);
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
            // greenEnemies.setAll('anchor.x', 0.5);
            // greenEnemies.setAll('anchor.y', 0.5);
            greenEnemies.setAll('scale.x', -0.3);
            greenEnemies.setAll('scale.y', 0.3);
            // greenEnemies.setAll('angle', 180);
            greenEnemies.setAll('outOfBoundsKill', true);
            greenEnemies.setAll('checkWorldBounds', true);
            greenEnemies.forEach(function(enemy){
               addEnemyEmitterTrail(enemy);
               enemy.nextFireChild = 0;
               enemy.damageAmount = damageAmountEnemies;
               enemy.events.onKilled.add(function(){
                      
                    enemy.trail.kill();
                    
                });
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
            this.game.time.events.add(500, launchGreenEnemy);

            //  Game over text
            gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
            gameOver.anchor.setTo(0.5, 0.5);
            gameOver.visible = false;

            //  An explosion pool
            explosions = game.add.group();
            explosions.enableBody = true;
            explosions.physicsBodyType = Phaser.Physics.ARCADE;
            explosions.createMultiple(30, 'explosion');
            explosions.setAll('anchor.x', 0.5);
            explosions.setAll('anchor.y', 0.5);
            explosions.forEach( function(explosion) {
                explosion.animations.add('explosion');
            });

            //  Shields stat
            shields = this.game.add.bitmapText(10, 10, 'spacefont', 'Shield: ' + this.player.health +'%', 40);

            level = this.game.add.bitmapText(this.game.world.width / 4, 10, 'spacefont', 'Level: ' + this.player.level, 40);

            experience = this.game.add.bitmapText(this.game.world.width / 2, 10, 'spacefont', 'Exp: ' + this.player.exp, 40);

            //  Score
            scoreText = this.game.add.bitmapText(this.game.world.width, 10, 'spacefont', 'Score: ' + score, 40);

            // bitmaptext align right
            scoreText.anchor.set(1,0);

            this.foreground = this.add.tileSprite(0, this.game.world.height, this.game.width, this.game.height, 'foreground');
            this.foreground.anchor.set(0,0.7);
            this.foreground.autoScroll(-100, 0);

            // this.foreground = this.add.sprite(1920, 700, 'foreground');
            // this.foreground.animations.add('swim', Phaser.Animation.generateFrameNames('foreground', 0), 30, true);
            // this.foreground.animations.play('swim');

            

            // this.weaponName = this.add.bitmapText(10, 864, 'shmupfont', "Press ENTER = Next Weapon", 24);

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
            this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], greenEnemies, hitEnemy, null, this);
            this.game.physics.arcade.overlap(enemyBullets, this.player, enemyHitsPlayer, null, this);
            this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], enemyBullets, hitEnemyBullet, null, this);

            //  Game over?
            if (! this.player.alive && gameOver.visible === false) {
                gameOver.visible = true;
                gameOver.alpha = 0;
                var fadeInGameOver = this.game.add.tween(gameOver);
                fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
                fadeInGameOver.onComplete.add(setResetHandlers);
                fadeInGameOver.start();
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
                this.player.frame = 15;
            }
            else if (this.cursors.down.isDown)
            {
                this.player.body.velocity.y = this.speed;
                this.player.play('walkBottom');
                this.player.frame = 0;
            }
            else {
                this.player.frame = 7;
            }

            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            {
                this.weapons[this.currentWeapon].fire(this.player);
            }

            //  Keep the shipTrail lined up with the ship
            shipTrail.x = this.player.x;
            shipTrail.y = this.player.y + 30;

            //  Fire bullet
            if (this.player.alive && (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))) {
                this.weapons[this.currentWeapon].fire();
            }

            // if (this.player.alive)
            // {
            //     this.weaponsEnemy[0].fire(greenEnemies);
            // }

            gainXpPlayer = 50 * greenEnemiesXp;

            getXpPlayer = this.player.level * gainXpPlayer;

            if (this.player.exp == getXpPlayer) {
                this.player.level++;
                level.text = 'Level: ' + this.player.level;
            }


            enemiesFire();

            // for (var i = 0; i < greenEnemies.children.length; i++){
            //     wepEnemy.fire(greenEnemies.children[i]);
            // }

        }

    };

    function launchGreenEnemy() {
    var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = -200;

    var enemy = greenEnemies.getFirstExists(false);
    // var bullet = enemyBullets.getFirstExists(false);
    if (enemy) {
        enemy.reset(this.game.width, game.rnd.integerInRange(0, window.innerHeight - 20));
        enemy.body.velocity.y = game.rnd.integerInRange(50, 100);
        enemy.body.velocity.x = ENEMY_SPEED;
        enemy.body.drag.y = 100;

        enemy.trail.start(false, 800, 1);

        // var bulletX = enemy.x - 10;
        // var bulletY = enemy.y + 10;
        // var nextFire = 0;
        // var bulletSpeed = -600;
        // var fireRate = 1000;

        // var tracking = false;
        // var scaleSpeed = 0;

    
        // var gx = gx || 0;
        // var gy = gy || 0;

        // bullet.reset(bulletX, bulletY);

        // if (enemy.x == this.game.width) {
            
        //     if (game.time.time >= nextFire) {
        //         bullet.scale.set(-1);
        //         bullet.body.velocity.x = bulletSpeed;
        //         bullet.body.gravity.set(gx, gy);
        //         nextFire = game.time.time + fireRate;

        //     }
        // }


        enemy.update = function(){
            enemy.angle = -90 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

            // fumee emit par les enemies
            enemy.trail.x = enemy.x;
            enemy.trail.y = enemy.y + 10;

            
          //  Kill enemies once they go off screen
              if (enemy.x > this.game.width) {
               enemy.kill();
             }
       }



    }

   //  Send another enemy soon
    greenEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
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

function addEnemyEmitterTrail(enemy) {
    var enemyTrail = game.add.emitter(enemy.x, 10, 100);
    enemyTrail.width = 10;
    enemyTrail.makeParticles('explosion', [1,2,3,4,5]);
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
    enemy.kill();

    player.damage(enemy.damageAmount);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';

    
};

function hitEnemy(enemy, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    enemy.kill();
    bullet.kill();

    // text xp above ennemies 
    removeTextXp = this.game.add.text(enemy.x, enemy.y, 'exp: +' + greenEnemiesXp, { font: '12px Arial', fill: '#4dffa6' });  
    removeTextXp.stroke = "#000";
    removeTextXp.strokeThickness = 2;
    this.game.add.tween(removeTextXp).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);

    // add Exp
    this.player.exp += greenEnemiesXp;
    experience.text = 'Exp: ' + this.player.exp;

    // Increase score
    score += damageAmountEnemies * 10;
    scoreText.text = 'Score: ' + score;
};

function hitEnemyBullet(enemy, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    bullet.kill();
};

function enemyHitsPlayer (player, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    bullet.kill();

    game.time.events.add(400, function() {  
        tweenPlayer = this.game.add.tween(player).to( { alpha: 0.5 }, 200, "Linear", true, 0, 10);
        /*tweenPlayer.yoyo(true, 200);*/
    }, this);
    

    player.damage(damageAmountEnemies);
    shields.text = 'Shield: ' + Math.max(player.health, 0) +'%';
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
