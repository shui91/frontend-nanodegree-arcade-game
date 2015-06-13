// TODO: ADD MENU SCREEN 
// TODO: ADD CHARACTER, LEVEL, DIFFICULTY SETTING
// TODO: REDESIGN LEVEL LAYOUT
// TODO: REDESIGN CHARACTERS
// TODO: GAME OVER SCREEN

var tileWidth = 101;
var tileHeight = (171/2);
var enemyStart = -100;
var xPos = [-2, 99, 200, 301, 402];
var yPos = [58, 143.5, 229];
var gemImages = ['images/gem-orange.png', 'images/gem-blue.png', 'images/gem-blue.png'];

Object.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = enemyStart;
    this.y = yPos[Math.floor(Math.random() * 3)];
    this.speed = Math.floor((Math.random() * 200) + 110); 
}

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
        this.x = enemyStart;
        this.y = this.y + 83.5
        if (this.y > 229) {
            this.y = 58;
        };
        this.x += this.speed * dt;
    }

    if (player.x >= this.x - 25 && player.x <= this.x + 25) {
        if (player.y >= this.y -20 && player.y <= this.y + 20){
            player.reset();
            lives.decrease();
        };
    }
}

// Draw the enemy on the screen, required method for game


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
    this.score = 0;
}

Player.prototype.update = function(dt){
    if (this.downKey === 'left' && this.x > 0){
        this.x -= tileWidth;
    }
    else if(this.downKey === 'right' && this.x != 402){
        this.x += tileWidth;
    }
    else if(this.downKey === 'up'){
        this.y -= tileHeight;
    }
    else if(this.downKey === 'down' && this.y != 400){
        this.y += tileHeight;
    }
    this.downKey = null;

    if (this.y < 25){
        this.reset();
    }
}

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
}

Player.prototype.handleInput = function(e) {
    this.downKey = e;
}

var Gem = function() {
    this.sprite = gemImages[Math.floor(Math.random() * 3)];
    this.x = xPos[Math.floor(Math.random() * 5)];
    this.y = yPos[Math.floor(Math.random() * 3)];
}

Gem.prototype.update = function(){
    if (player.x == this.x && player.y == this.y){
        this.sprite = gemImages[Math.floor(Math.random() * 3)];
        this.x = xPos[Math.floor(Math.random() * 5)];
        this.y = yPos[Math.floor(Math.random() * 3)]; 
        player.score += 100;
    };
}

var Lives = function() {
  this.sprite = 'images/Heart.png';
  this.x = xPos[Math.floor(Math.random() * 5)];
  this.y = yPos[Math.floor(Math.random() * 3)]; 
  this.lives = 5;
}

Lives.prototype.update = function(){

}

Lives.prototype.render = function(){
    var x = 0;
    for (var i = 0; i < this.lives; i++) {
        ctx.drawImage(Resources.get(this.sprite), x, 570, 50, 75);
        x += 50;
    }
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 171);
}

Lives.prototype.decrease = function() {
  if (this.lives > 0) {
    this.lives -= 1;
  }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var gem = new Gem();
var lives = new Lives();
var allEnemies = [];
var numEnemies = 6;
for (var i = 0; i < numEnemies; i++){
   allEnemies.push(new Enemy)
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


// HELPER FUNCTIONS

function drawText() {
    ctx.fillText('score: ' + player.score, 0, 40);
    //ctx.drawImage('images/Heart.png', 200, 400)
}
