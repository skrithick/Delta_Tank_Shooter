import { Listeners } from "./scripts/keyListeners.js";
import { Player } from "./scripts/player.js";
import { Enemy } from "./scripts/enemy.js";
import { Projectile } from "./scripts/Projectile.js";
import { angleOfThisPoint } from "./scripts/utils.js";
import { Room } from "./scripts/Room.js"

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

/**
 * 
 * IMPLEMENT AMMO COUNT
 * IMPLEMENT AUTOFIRE
 * IMPLEMENT FIRERATE
 * 
 */

// Break glass in case of powerups
export let MAX_HEALTH = 100;
export let RECOVERY_TIME = 600;
export let RECOVERY_RATE = 0.5;

/* Gotta think of a better way to regen health */

let keysPressed = {
  w: false,
  a: false,
  s: false,
  d: false
};

// PLAYER INIT

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 25, "blue", 3);
const projectiles = [];

// ENEMIES
const enemies = [];

const enemy = new Enemy(100, 100, 25, 10, 50, 400);
enemies.push(enemy);

Listeners();

export const mouse = {
  x: 0,
  y: 0
};

export const rooms = [];

const baseRoom = new Room(
  x - 100,
  y-100,
  200,
  200,
  { top: true, bottom: true, left: true, right: true }
);


const newRoom = new Room(
  x - 100 + 200 + 80,
  y-75,
  150,
  150,
  { top: false, left: false, right: true, bottom: false }
);

rooms.push(baseRoom, newRoom)

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  enemies.forEach((enemy) => {
    enemy.update();
  });
  enemies.forEach((enemy) => {
    enemy.rotateTowardsPlayer();
  });
  projectiles.forEach((projectile) => {
    projectile.update();
  });
  rooms.forEach((room) => {
    room.draw()
  })
  
  if (keysPressed['w']) {
    player.y -= player.speed;
  }
  if (keysPressed['s']) {
    player.y += player.speed;
  }
  if (keysPressed['a']) {
    player.x -= player.speed;
  }
  if (keysPressed['d']) {
    player.x += player.speed;
  }
  if (keysPressed['d']) {
    player.x += player.speed;
  }
  if (keysPressed['c']) {
    player.damage(2);
  }

  player.regen(RECOVERY_RATE);

  player.turretAngle = angleOfThisPoint(mouse.x, mouse.y);

  if (player.health <= 0) {
    alert('Game Over!');
    keysPressed = {};
    player.health = MAX_HEALTH;
    player.x = x;
    player.y = y;
  }
  player.draw();
  console.log(mouse)
}

animate();

export { player, projectiles, enemies, keysPressed, ctx };  