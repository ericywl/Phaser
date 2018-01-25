var gameOptions = {
    scale: 0.5,
    ballSpeed: 500,
    blocksPerLine: 7
};

var game = new Phaser.Game(640 * gameOptions.scale, 960 * gameOptions.scale, Phaser.AUTO,
    null, {preload: preload, create: create, update: update});

function preload() {
    game.load.image('ball', 'assets/ball.png');
    game.load.image('trajectory', 'assets/trajectory.png');
    game.load.image('panel', 'assets/panel.png');
    game.load.image('block', 'assets/block.png');
}

function create() {
    var blockSize = game.world.width / gameOptions.blocksPerLine;

    this.panel = game.add.image(game.world.centerX, game.world.height, 'panel');
    this.panel.anchor.set(0.5, 1);
    this.panel.width = game.world.width;
    this.panel.height = blockSize;

    this.ball = createBall(game.world.centerX, game.world.height - 20);
    this.ballLaunched = false;
    this.trajectory = createTrajectory(this.ball.x, this.ball.y);

    this.blocks = game.add.group();
    this.blocks.add(createBlock(game.world.centerX, game.world.centerY));
}

function update() {
    // change trajectory angle based on mouse pointer
    var pointerPos = game.input.activePointer.position;
    var direction = Phaser.Math.angleBetween(this.ball.x, this.ball.y, pointerPos.x, pointerPos.y);
    this.trajectory.position.set(this.ball.x, this.ball.y);
    this.trajectory.angle = Phaser.Math.radToDeg(direction) + 90;

    // shoot the ball on mouse press
    game.input.onDown.add(shootBall, this);
    // kill block on collision
    game.physics.arcade.collide(this.ball, this.blocks, removeBlock);
}

function removeBlock(ball, block) {
    block.kill();
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

function shootBall() {
    if (this.ballLaunched) {
        this.ball.x = game.world.centerX;
        this.ball.y = game.world.height - 20;
        this.ball.body.velocity.setTo(0, 0);

        this.trajectory.visible = true;
        this.ballLaunched = false;
    } else {
        var shootAngle = Phaser.Math.degToRad(this.trajectory.angle - 90);
        this.ball.body.velocity.x = gameOptions.ballSpeed * Math.cos(shootAngle);
        this.ball.body.velocity.y = gameOptions.ballSpeed * Math.sin(shootAngle);

        this.trajectory.visible = false;
        this.ballLaunched = true;
    }
}

function createTrajectory(x, y) {
    var newTrajectory = game.add.image(x, y, 'trajectory');
    newTrajectory.anchor.set(0.5, 1);
    newTrajectory.scale.set(gameOptions.scale);

    game.world.bringToTop(newTrajectory);
    return newTrajectory;
}

function createBlock(x, y) {
    var newBlock = game.add.sprite(x, y, 'block');
    newBlock.anchor.set(0.5);
    newBlock.scale.set(gameOptions.scale);

    game.physics.arcade.enable(newBlock);
    newBlock.body.immovable = true;

    return newBlock;
}

function addLine() {

}

