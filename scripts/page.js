// ===================== Fall 2022 EECS 493 Assignment 3 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==================================================
// ============ Page Scoped Globals Here ============
// ==================================================

// Div Handlers
let game_window;
let game_screen;
let onScreenAsteroid;
let onScreenPortal;
let onScreenShield;

// Difficulty Helpers
let astProjectileSpeed = 3;          // easy: 1, norm: 3, hard: 5
let spawnRatems = 0;
// Game Object Helpers
let currentAsteroid = 1;
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 15;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds
let dieAudio = new Audio('./src/audio/die.mp3');
//dieAudio.volume = $("#myRange").attr('value');
let collectAudio = new Audio('./src/audio/collect.mp3');
//collectAudio.volume =$("#myRange").attr('value');
// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;
let shielded = false;
// ==============================================
// ============ Functional Code Here ============
// ==============================================
var easy = false;
var normal = true;
var hard = false;

var numGames=0;
var level = 1;
var danger = 20;
var gameOver = false;
let endScore = 0;

var KEYS = {
  left: 37,
  right: 39,
  up: 38,
  down: 40
}
// Main
/*
TO DO:
-freeze everything for two seconds
  - store end score  DONE
  - make suree settings of game are NOT reset (difficulty and volume) //ok
  - empty onScreenAsteroid div  DONE
  - reset level DONE
  - reset danger DONE
  - reset score DONE
  - reset player left top 
-game over page, with transition
*/
$(document).ready(function () {
  // ====== Startup ====== 
  game_window = $('.game-window');
  game_screen = $("#actual_game");
  onScreenAsteroid = $('.curAstroid');
  Portal = $('.currPortal');
  Shield = $('.currShield');
  tut = $('#tutorial')
  person = $('#player');
  // TODO: ADD MORE
  // Example: Spawn an asteroid that travels from one border to another
  $('#normal').addClass('lvl-selected')
});
// TODO: ADD YOUR FUNCTIONS HERE


function hideGO(){
  $("#game-over").hide();
  $(".button-div").show();
}

// let slider = $("#myRange");
// let output = $("#demo");
// console.log(slider.val());
// output.html(slider.val());
// slider.oninput = function() {
//   console.log(this.val());
//   output.innerHTML = this.val();
//   dieAudio.volume = parseInt(this.val())/100;  //fix this so that it changes volume
//   collectAudio.volume = parseInt(this.val())/100;
// }

function spawnRate(){
  if(hard === true){
    astProjectileSpeed = 5;
    spawnRatems = 600;
  }
  else if(normal === true){
    astProjectileSpeed = 3;
    spawnRatems = 800;
  }
  else if(easy === true){
    astProjectileSpeed = 1;
    spawnRatems = 1000;
  }
  else if(gameOver === true){
    spawnRatems = 300000;
  }
}
// Keydown event handler
document.onkeydown = function (e) {
  console.log('key down');
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
  movePerson();
  shieldCollision();
  portalCollision();
  //asteroidCollision();
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

function vol(val) {
  $('#demo').html(val);
  dieAudio.volume = val/100;
  collectAudio.volume = val/100;
}

function movePerson(){
  var newPosX = parseInt(person.css("left"));
  var newPosY = parseInt(person.css("top"));
  img = $('#r_img');
  if(LEFT === true){
    newPosX = parseInt(person.css("left")) - PERSON_SPEED;
    if(shielded === false){
      img.attr('src', "./src/player/player_left.gif")
    }
    else{
      img.attr('src', "./src/player/player_shielded_left.gif")
    }
    if (newPosX < 0){
      newPosX = 0;
    }
  }
  if(RIGHT === true){
    newPosX = parseInt(person.css("left")) + PERSON_SPEED;
    if(shielded === false){
      img.attr('src', "./src/player/player_right.gif")
    }
    else{
      img.attr('src', "./src/player/player_shielded_right.gif")
    }
    if(newPosX > maxPersonPosX){
      newPosX = maxPersonPosX;
    }
  }
  if(UP === true){
    newPosY = parseInt(person.css("top")) - PERSON_SPEED;
    if(shielded === false){
      img.attr('src', "./src/player/player_up.gif")
    }
    else{
      img.attr('src', "./src/player/player_shielded_up.gif")
    }
    if(newPosY < 0){
      newPosY = 0;
    }
  }
  if(DOWN === true){
    newPosY = parseInt(person.css("top")) + PERSON_SPEED;
    if(shielded === false){
      img.attr('src', "./src/player/player_down.gif")
    }
    else{
      img.attr('src', "./src/player/player_shielded_down.gif")
    }
    if(newPosY > maxPersonPosY){
      newPosY = maxPersonPosY;
    }
  }
  person.css('left', newPosX)
  person.css('top', newPosY)
}


function setting_click() {
  $("#Settings").show()
  if(normal === true){
    $('#normal').addClass('lvl-selected')
  }
}

function play_game() {   //integrate show_game into this
  $("#landing-page").hide()
  if(numGames === 0){
    $('#tutorial').show()
    numGames = numGames+1;
  }
  else {
    $('#actual_game').show();
    splash_fade();
  }
  PERSON_SPEED = 15;
  currentAsteroid = 1;
  gameOver=false;
  spawnRate();
  $("#danger_num").html(danger);
  $("#level_num").html('1');
  if($('#splash').is(':hidden')){  //figure out where to put this if user wants to play multiple rounds
    updateScore();
    spawnShield();
    spawnPortal();
    spawnInt = setInterval(() => {
      if($('#splash').is(':hidden')){
        spawn();
      }
      if(gameOver === true){
        clearInterval(spawnInt);
      }
    }, spawnRatems);
  }
}

function close_settings() {
  $("#Settings").hide()
}

function show_game() {
  $("#actual_game").show()
  $("#tutorial").hide()
  splash_fade();
}

function easy_click() {
  if(easy === true){
    return;
  }
  if(normal === true){
    normal=false;
    $('#normal').removeClass('lvl-selected')
  }
  if(hard === true){
    $('#hard').removeClass('lvl-selected')
    hard=false;
  }
  $('#easy').addClass('lvl-selected')
  easy=true;
  console.log(easy);
  danger = 10;
}

function normal_click() {
  if(normal === true){
    return;
  }
  if(easy === true){
    $('#easy').removeClass('lvl-selected')
    easy=false;
  }
  if(hard === true){
    $('#hard').removeClass('lvl-selected')
    hard=false;
  }
  $('#normal').addClass('lvl-selected')
  normal=true;
  console.log(normal);
  danger = 20;
}

function hard_click() {
  if(hard === true){
    return;
  }
  if(normal === true){
    $('#normal').removeClass('lvl-selected')
    normal=false;
  }
  if(easy === true){
    $('#easy').removeClass('lvl-selected')
    easy = false;
  }
  $('#hard').addClass('lvl-selected')
  hard=true;
  console.log(hard);
  danger = 30;
}


// Starter Code for randomly generating and moving an asteroid on screen
// Feel free to use and add additional methods to this class
class Asteroid {
  // constructs an Asteroid object
  constructor() {
      /*------------------------Public Member Variables------------------------*/
      // create a new Asteroid div and append it to DOM so it can be modified later
      let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAstroid' > <img src = 'src/asteroid.png'/></div>";
      onScreenAsteroid.append(objectString);
      // select id of this Asteroid
      this.id = $('#a-' + currentAsteroid);
      currentAsteroid++; // ensure each Asteroid has its own id
      // current x, y position of this Asteroid
      this.cur_x = 0; // number of pixels from right
      this.cur_y = 0; // number of pixels from top

      /*------------------------Private Member Variables------------------------*/
      // member variables for how to move the Asteroid
      this.x_dest = 0;
      this.y_dest = 0;
      this.hitShielded = false;
      // member variables indicating when the Asteroid has reached the boarder
      this.hide_axis = 'x';
      this.hide_after = 0;
      this.sign_of_switch = 'neg';
      // spawn an Asteroid at a random location on a random side of the board
      this.#spawnAsteroid();
      setInterval(() => {
        this.personCollide()
      }, 50);
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
      if(this.hide_axis == 'x'){
          if(this.sign_of_switch == 'pos'){
              if(this.cur_x > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_x < this.hide_after){
                  return true;
              }          
          }
      }
      else {
          if(this.sign_of_switch == 'pos'){
              if(this.cur_y > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_y < this.hide_after){
                  return true;
              }          
          }
      }
      return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
      // ensures all asteroids travel at current level's speed
      this.cur_y += this.y_dest * astProjectileSpeed;
      this.cur_x += this.x_dest * astProjectileSpeed;
      // update asteroid's css position
      this.id.css('top', this.cur_y);
      this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
      // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
      let x = getRandomNumber(0, 1280);
      let y = getRandomNumber(0, 720);
      let floor = 784;
      let ceiling = -64;
      let left = 1344;
      let right = -64;
      let major_axis = Math.floor(getRandomNumber(0, 2));
      let minor_aix =  Math.floor(getRandomNumber(0, 2));
      let num_ticks;

      if(major_axis == 0 && minor_aix == 0){
          this.cur_y = floor;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 0 && minor_aix == 1){
          this.cur_y = ceiling;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = 784;
          this.sign_of_switch = 'pos';
      }
      if(major_axis == 1 && minor_aix == 0) {
          this.cur_y = y;
          this.cur_x = left;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 1 && minor_aix == 1){
          this.cur_y = y;
          this.cur_x = right;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = 1344;
          this.sign_of_switch = 'pos';
      }
      // show this Asteroid's initial position on screen
      this.id.css("top", this.cur_y);
      this.id.css("right", this.cur_x);
      // normalize the speed s.t. all Asteroids travel at the same speed
      let speed = Math.sqrt((this.x_dest)*(this.x_dest) + (this.y_dest)*(this.y_dest));
      this.x_dest = this.x_dest / speed;
      this.y_dest = this.y_dest / speed;
  }

  personCollide(){
    if(isColliding($('#r_img'), this.id.children('img'))){
      if(shielded === true){
        shielded = false;
        this.hitShielded = true;
      }
      else if(this.hitShielded === false) {
        setTimeout(function(){
          $("#r_img").attr('src', "./src/player/player_touched.gif")
          dieAudio.play();
          gameOver = true;
        }, 100)
        
        PERSON_SPEED = 0;
        endScore = $("#score_num").html();
        setTimeout(function(){
          gameFINISHED();
        }, 2000);
      }
    }
  }
}

function gameFINISHED(){
  console.log('hi');
  for(let i = 1; i<currentAsteroid+1; i++){
    id = "#a-"+i;
    $(id).remove();
  }
  if(easy === true){danger = 10;}
  if(normal === true){danger = 20;}
  if(hard === true){danger = 30;}
  $("#score_num").html("0");
  $('#r_img').attr('src', "./src/player/player.gif");
  person.css('top', 300);
  person.css('left', 600);
  $("#landing-page").show();
  game_screen.hide();
  $(".button-div").hide();
  $('#final-score').html(endScore);
  $("#game-over").show();
}
// Spawns an asteroid travelling from one border to another
function spawn() {
  if(gameOver === false){
    let asteroid = new Asteroid();
    console.log(asteroid.id)
    setTimeout(spawn_helper(asteroid), 0);
  }
}

function spawnPortal(){
  let port = setInterval(function() {
    setTimeout(function() {
      Portal.hide()
    }, vaccineGone);
    Portal.css('left', getRandomNumber(62, maxPersonPosX-62));
    Portal.css('top', getRandomNumber(62, maxPersonPosY-62));
    Portal.show();
    // collision logic here?
    if(gameOver === true){
      clearInterval(port);
    }
  }, vaccineOccurrence);
}

function spawnShield(){
  let sh = setInterval(function() {
    Shield.css('left', getRandomNumber(62, maxPersonPosX-62));
    Shield.css('top', getRandomNumber(62, maxPersonPosY-62));
    Shield.show();
    setTimeout(function() {
      Shield.hide()
    }, maskGone);
    if(gameOver === true){
      clearInterval(sh);
    }
  }, maskOccurrence);
}

function splash_fade() {
  setTimeout(function(){
    $('#splash').fadeOut('fast');
  }, 3000);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    console.log(spawnRatems);
    // update asteroid position on screen
    if(gameOver === false){asteroid.updatePosition();}
    // determine whether asteroid has reached its end position, i.e., outside the game border
    if (asteroid.hasReachedEnd()) {
      asteroid.id.remove();
      clearInterval(astermovement);
    }
    if (gameOver === true){
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================
function shieldCollision(){
  if(isColliding(person, Shield) && gameOver === false){
    shielded = true;
    collectAudio.play();
    Shield.hide()
  }
}

function portalCollision(){
  if(isColliding(person, Portal) && gameOver === false){
    collectAudio.play();
    level = level + 1;
    $("#level_num").html(level);
    danger = danger+2;
    $("#danger_num").html(danger);
    astProjectileSpeed = astProjectileSpeed+(0.2*astProjectileSpeed);
    Portal.hide();
  }
}

var score = 0;
function updateScore(){
  up_score = setInterval(function() {
    score = parseInt($("#score_num").html());
    score = score+40;
    $("#score_num").html(score);
    if(gameOver === true){clearInterval(up_score);}
  }, 500);
}
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
