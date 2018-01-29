var gameOptions = {
    playerSpeed: 150
};

var silencerOptions = {
    bulletSpeed: 400,
    fireRate: 500,
    fireLimit: 12
};

var game = new Phaser.Game(960, 960, Phaser.AUTO, null,
    {preload: preload, create: create, update: update});

function preload() {
    game.stage.backgroundColor = "#fff";

    game.load.image("player_silencer", "assets/player/player_silencer.png");
    game.load.image("blue_silencer", "assets/blue_enemy/blue_silencer.png");

    game.load.image("silencer_bullet", "assets/bullet/silencer_bullet.png");
}

var cursors;
var shootButton;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // player mechanics
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, "player_silencer");
    this.player.anchor.set(0.5);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.collideWorldBounds = true;

    // player controls
    cursors = game.input.keyboard.createCursorKeys();
    shootButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // enemy mechanics
    this.enemies = game.add.group();
    var enemy1 = game.add.sprite(800, 500, "blue_silencer");
    enemy1.anchor.set(0.5);
    var enemy2 = game.add.sprite(700, 500, "blue_silencer");
    enemy2.anchor.set(0.5);

    this.enemies.add(enemy1);
    this.enemies.add(enemy2);
    game.physics.enable(this.enemies, Phaser.Physics.ARCADE);

    // player silencer mechanics
    this.silencer = game.add.weapon(12, "silencer_bullet");
    this.silencer.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.silencer.bulletSpeed = silencerOptions.bulletSpeed;
    this.silencer.fireRate = silencerOptions.fireRate;
    this.silencer.fireLimit = silencerOptions.fireLimit;
    this.silencer.trackSprite(this.player);
    this.silencer.trackRotation = true;
}

function update() {
    playerMovement(this);

    if (shootButton.isDown) {
        this.silencer.fire();
    }

    game.physics.arcade.collide(this.silencer.bullets, this.enemies, hitEnemy);
}

function playerMovement(e) {
    var playerVelocity = e.player.body.velocity;

    // up-down movements
    if (cursors.up.isDown) {
        playerVelocity.y = -gameOptions.playerSpeed;
        e.player.angle = -90;
    } else if (cursors.down.isDown) {
        playerVelocity.y = gameOptions.playerSpeed;
        e.player.angle = 90;
    } else {
        playerVelocity.y = 0;
    }

    // left-right movements
    if (cursors.right.isDown) {
        playerVelocity.x = gameOptions.playerSpeed;
        e.player.angle = 0;
    } else if (cursors.left.isDown) {
        playerVelocity.x = -gameOptions.playerSpeed;
        e.player.angle = 180;
    } else {
        playerVelocity.x = 0;
    }
}

function hitEnemy(bullet, enemy) {
    enemy.kill();
    bullet.kill();
}