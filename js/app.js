// TODO: ADD MENU SCREEN 
// TODO: ADD CHARACTER, LEVEL, DIFFICULTY SETTING
// TODO: REDESIGN LEVEL LAYOUT
// TODO: REDESIGN CHARACTERS
var TILE_WIDTH = 101;
var TILE_HEIGHT = (171/2);
var ENEMY_START = -100;
var XPOS = [-2, 99, 200, 301, 402];
var YPOS = [58, 143.5, 229];
var GEM_IMAGES = ['images/gem-orange.png', 'images/gem-blue.png', 'images/gem-blue.png'];
var GAME_OVER = false;

// CREATE GLOBAL GAMEOBJ OBJECT TO MANIPULATE//
var gameObj = function () {
    this.sprite = '';
};

// Global render function for all game objects
gameObj.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
    // calls gameObj to be used as reference for "this"
    gameObj.call(this);
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_START;
    this.y = YPOS[Math.floor(Math.random() * 3)];
    this.speed = Math.floor((Math.random() * 200) + 110); 
};

// All objects created here fall back to gameObj for render property
Enemy.prototype = Object.create(gameObj.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 490) {
        this.x += this.speed * dt;
    }
    else {
        this.x = ENEMY_START;
        //Shifts the bugs a row, to add randomness; also keeps the bugs within the rock rows
        this.y = this.y + 83.5;
        if (this.y > 229) {
            this.y = 58;
        }
        this.x += this.speed * dt;
    }
    // Collision case, Player will reset and lose one life
    if (player.x >= this.x - 25 && player.x <= this.x + 25) {
        if (player.y >= this.y -25 && player.y <= this.y + 25){
            player.reset();
            lives.decrease();
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    gameObj.call(this);
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
    this.score = 0;
};

// Falls onto gameObj for render property
Player.prototype = Object.create(gameObj.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt){
    if (this.downKey === 'left' && this.x > 0){
        this.x -= TILE_WIDTH;
    }
    else if(this.downKey === 'right' && this.x != 402){
        this.x += TILE_WIDTH;
    }
    else if(this.downKey === 'up'){
        this.y -= TILE_HEIGHT;
    }
    else if(this.downKey === 'down' && this.y != 400){
        this.y += TILE_HEIGHT;
    }
    this.downKey = null;
    // If player hits water, life will decrease and will respawn
    if (this.y < 25){
        this.reset();
        lives.decrease();
    }
};

// reset player sprite when hit by bug or out of bounds
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

Player.prototype.handleInput = function(e) {
    this.downKey = e;
};

// Creates Gems
var Gem = function() {
    gameObj.call(this);
    // chooses random gem image to use
    this.sprite = GEM_IMAGES[Math.floor(Math.random() * 3)];
    // generate random position for gem to spawn
    this.x = XPOS[Math.floor(Math.random() * 5)];
    this.y = YPOS[Math.floor(Math.random() * 3)];
};

// fall back on gameObj for render function and make the constructor Gem
Gem.prototype = Object.create(gameObj.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function(){
    // Gem collision mechanic and respawn
    if (player.x == this.x && player.y == this.y){
        this.sprite = GEM_IMAGES[Math.floor(Math.random() * 3)];
        this.x = XPOS[Math.floor(Math.random() * 5)];
        this.y = YPOS[Math.floor(Math.random() * 3)]; 
        player.score += 100;
    }
};

var Lives = function() {
gameObj.call(this);
    this.sprite = 'images/Heart.png';
    this.lives = 5;
};

Lives.prototype = Object.create(gameObj.prototype);
Lives.prototype.constructor = Lives;

// Render life points
Lives.prototype.render = function(){
    var x = 455;
    for (var i = 0; i < this.lives; i++) {
        ctx.drawImage(Resources.get(this.sprite), x, -15, 50, 75);
        x -= 50;
    }
};

// Life point system
Lives.prototype.decrease = function() {
  if (this.lives > 1) {
    this.lives -= 1;
  } else {
    GAME_OVER = true;
  }
};

// HELPER FUNCTIONS
// Draws Score Text onto screen
function drawText() {
    ctx.fillText('score: ' + player.score, 0, 40);
    ctx.fillStyle = "black";
}

// Reset Button changes states back to init state
function reset() {
    GAME_OVER = false;
    player.score = 0;
    player.reset();
    lives.lives = 5;
    ctx.clearRect(0, 0, 505, 716);
    drawText();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var gem = new Gem();
var lives = new Lives();
var allEnemies = [];
var numEnemies = 6;
for (var i = 0; i < numEnemies; i++){
   allEnemies.push(new Enemy());
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});