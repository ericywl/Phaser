var gameOptions = {
    scale: 0.5,
    ballSpeed: 500
};

var game = new Phaser.Game(640 * gameOptions.scale, 960 * gameOptions.scale, Phaser.AUTO,
    null, {preload: preload, create: create, update: update});

function preload() {
    game.load.image('ball', 'assets/ball.png');
    game.load.image('trajectory', 'assets/trajectory.png');
}

var ball;
var ballLaunched = false;
var trajectory;

function create() {
    ball = createBall(game.world.centerX, game.world.height - 20);
    trajectory = createTrajectory(ball.x, ball.y);
    game.input.onDown.add(shootBall, this);
}

function update() {
    var pointerPos = game.input.activePointer.position;
    var direction = Phaser.Math.angleBetween(ball.x, ball.y, pointerPos.x, pointerPos.y);

    trajectory.position.set(ball.x, ball.y);
    trajectory.angle = Phaser.Math.radToDeg(direction) + 90;
}

function createBall(x, y) {
    var newBall = game.add.sprite(x, y, 'ball');
    newBall.anchor.set(0.5);
    newBall.scale.set(gameOptions.scale);

    game.physics.arcade.enable(newBall);
    newBall.body.collideWorldBounds = true;
    newBall.body.bounce.setTo(1, 1);

    return newBall;
}

function createTrajectory(x, y) {
    var newTrajectory = game.add.sprite(x, y, 'trajectory');
    newTrajectory.anchor.set(0.5, 1);
    newTrajectory.scale.set(gameOptions.scale);

    return newTrajectory;
}

function shootBall() {
    if (ballLaunched) {
        ball.x = game.world.centerX;
        ball.y = game.world.height - 20;
        ball.body.velocity.setTo(0, 0);

        trajectory.visible = true;
        ballLaunched = false;
    } else {
        var shootAngle = Phaser.Math.degToRad(trajectory.angle - 90);
        ball.body.velocity.x = gameOptions.ballSpeed * Math.cos(shootAngle);
        ball.body.velocity.y = gameOptions.ballSpeed * Math.sin(shootAngle);

        trajectory.visible = false;
        ballLaunched = true;
    }
}