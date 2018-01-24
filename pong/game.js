var game = new Phaser.Game(800, 600, Phaser.AUTO, null,
    {preload: preload, create: create, update: update});

var paddleScaleX = 0.65;
var paddleScaleY = 0.5;
var paddle1;
var paddle2;

var ball;
var ballLaunched = false;
var ballVelocity = 400;

var score1 = 0;
var score2 = 0;
var score1Text;
var score2Text;

function preload() {
    game.load.image('paddle', 'asset/paddle.png');
    game.load.image('ball', 'asset/ball.png');

    game.load.bitmapFont('font', 'asset/font.png', 'asset/font.xml');
}

function create() {
    paddle1 = createPaddle(0, game.world.centerY);
    paddle2 = createPaddle(game.world.width - 16 * paddleScaleY, game.world.centerY);

    ball = createBall(game.world.centerX, game.world.centerY);
    game.input.onDown.add(launchBall, this);

    score1Text = game.add.bitmapText(128, 128, 'font', '0', 64);
    score2Text = game.add.bitmapText(game.world.width - 128, 128, 'font', '0', 64);
}

function update() {
    controlPaddle(paddle1, game.input.y);

    game.physics.arcade.collide(paddle1, ball);
    game.physics.arcade.collide(paddle2, ball);

    if (ball.body.blocked.left) {
        console.log('Player 2 Scores!');
        score2++;
        score2Text.text = score2;
    } else if (ball.body.blocked.right) {
        console.log('Player 1 Scores!');
        score1++;
        score1Text.text = score1;
    }

    checkScore();

    paddle2.body.velocity.setTo(0, ball.body.velocity.y);
    paddle2.body.maxVelocity.y = 250;
}

function createPaddle(x, y) {
    var paddle = game.add.sprite(x, y, 'paddle');
    paddle.anchor.set(0.5);
    paddle.scale.setTo(paddleScaleX, paddleScaleY);

    game.physics.arcade.enable(paddle);
    paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;

    return paddle;
}

function controlPaddle(paddle, y) {
    paddle.y = y;

    var halfPaddleHeight = paddle.height / 2;
    if (paddle.y < halfPaddleHeight) {
        paddle.y = halfPaddleHeight;
    } else if (paddle.y > game.world.height - halfPaddleHeight) {
        paddle.y = game.world.height - halfPaddleHeight;
    }
}

function createBall(x, y) {
    var ball = game.add.sprite(x, y, 'ball');
    ball.anchor.set(0.5);

    game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    return ball;
}

function launchBall() {
    if (ballLaunched) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.setTo(0, 0);
        ballLaunched = false;
    } else {
        ball.body.velocity.setTo(-ballVelocity, ballVelocity);
        ballLaunched = true;
    }
}

function checkScore() {
    if (score1 >= 5) {
        console.log('Player 1 Wins!');
        launchBall();
        score1 = 0;
        score2 = 0;
    } else if (score2 >= 5) {
        console.log('Player 2 Wins!');
        launchBall();
        score1 = 0;
        score2 = 0;
    }
}