var width = 480;
var height = 320;
var game = new Phaser.Game(width, height, Phaser.AUTO, null,
    {preload: preload, create: create, update: update});

var cursors;
var player;
var foods;

var speed = 150;
var score = 0;
var scoreText;

function preload() {
    game.stage.backgroundColor = '#eee';

    game.load.image('player', 'asset/blue-square.png');
    game.load.image('food', 'asset/red-square.png');
}

function create() {
    // add physics and keyboard cursor controls
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();

    // add player sprite and set anchor to center of sprite
    player = game.add.sprite(width * 0.5, height * 0.5, 'player');
    player.anchor.set(0.5);
    // enable player physics and confine player to world
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    foods = game.add.group();
    foods.create(width*0.1, height*0.1, 'food');
    foods.create(width*0.9, height*0.1, 'food');
    foods.create(width*0.1, height*0.9, 'food');
    foods.create(width*0.9, height*0.9, 'food');
    for (var i in foods.children) {
        foods.children[i].anchor.set(0.5);
    }
    game.physics.enable(foods, Phaser.Physics.ARCADE);

    scoreText = game.add.text(5, 3, score);
}

function update() {
    var playerVelocity = player.body.velocity;

    // up-down movements
    if (cursors.up.isDown) {
        playerVelocity.y = -speed;
    } else if (cursors.down.isDown){
        playerVelocity.y = speed;
    } else {
        playerVelocity.y = 0;
    }

    // left-right movements
    if (cursors.left.isDown) {
        playerVelocity.x = -speed;
    } else if (cursors.right.isDown) {
        playerVelocity.x = speed;
    } else {
        playerVelocity.x = 0;
    }

    game.physics.arcade.overlap(player, foods, eatFood);
}

function eatFood(player, food) {
    food.kill();

    score += 10;
    scoreText.text = score;
}