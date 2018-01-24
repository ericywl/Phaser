Snake = function (game, spriteKey, x, y) {
    this.game = game;

    // array of snakes
    if (!this.game.snakes) {
        this.game.snakes = [];
    }

    this.game.snakes.push(this);
    this.debug = false;
    this.snakeLength = 0;
    this.spriteKey = spriteKey;

    // variables
    this.scale = 0.6;
    this.fastSpeed = 200;
    this.slowSpeed = 130;
    this.speed = this.slowSpeed;
    this.rotationSpeed = 40;

    this.collisionGroup = this.game.physics.p2.createCollisionGroup();
    this.sections = [];
    this.headPath = [];
    this.food = [];

    this.preferredDistance = 17 * this.scale;
};