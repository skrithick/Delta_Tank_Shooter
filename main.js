import { Listeners } from "./scripts/keyListeners.js";
import { Player } from "./scripts/player.js";
import { Enemy } from "./scripts/enemy.js";
import { Projectile } from "./scripts/Projectile.js";
import { angleOfThisPoint, rectangleAndCircleCollided } from "./scripts/utils.js";
import { Room } from "./scripts/Room.js"
import { generateGridMap } from "./scripts/CreateSandbox.js";

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

export const camera = {
  x: 0,
  y: 0
}

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

const player = new Player(200, 200, 20, "blue", 3);
const projectiles = [];

// ENEMIES
const enemies = [];

const enemy = new Enemy(100, 100, 25, 10, 50, 400);
enemies.push(enemy);

export const mouse = {
  x: 0,
  y: 0
};

export const rooms = [];

Listeners(rooms);

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

generateGridMap(3, 20, 800, 600);


function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.x = player.x - x;
  camera.y = player.y - y;
  console.log(camera.x, camera.y)

  ctx.save(); 
  ctx.translate(-camera.x, -camera.y);

  enemies.forEach((enemy) => {
    enemy.update();
  });
  // enemies.forEach((enemy) => {
  //   enemy.rotateTowardsPlayer();
  // });
  projectiles.forEach((projectile) => {
    projectile.update(rooms, player, enemies, projectiles);
    if (projectile.isDead) {
      projectiles.splice(projectiles.indexOf(projectile), 1);
    }
  });
  rooms.forEach((room) => {
    room.draw()
  })

  let currentSpeed = {
    x: 0,
    y: 0,
  };
  
  if (keysPressed['w']) {
    currentSpeed.y = -player.speed;
    // player.y -= player.speed;
  }
  if (keysPressed['s']) {
    // player.y += player.speed;
    currentSpeed.y = player.speed;
  }
  if (keysPressed['a']) {
    // player.x -= player.speed;
    currentSpeed.x = -player.speed;
  }
  if (keysPressed['d']) {
    // player.x += player.speed;
    currentSpeed.x = player.speed;
  }
  if (keysPressed['c']) {
    player.damage(2);
  }

  // set collided to true always for sticky walls hehe

  player.x += currentSpeed.x;

  let collided = false;
  
  rooms.forEach((room) => {
    room.barriers.forEach(barrier => {
      if (rectangleAndCircleCollided(barrier, player)) {
        collided = true;
      }
    })
  })

  collided && (player.x -= currentSpeed.x);
  collided = false;

  player.y += currentSpeed.y;

  rooms.forEach((room) => {
    room.barriers.forEach(barrier => {
      if (rectangleAndCircleCollided(barrier, player)) {
        collided = true;
      }
    })
  })

  collided && (player.y -= currentSpeed.y);
  collided = false;

  player.regen(RECOVERY_RATE);

  player.turretAngle = angleOfThisPoint(camera.x + mouse.x, camera.y + mouse.y);

  if (player.health <= 0) {
    alert('Why would you do that to yourself? Please induct me 😭.');
    keysPressed = {};
    player.health = MAX_HEALTH;
    player.x = x;
    player.y = y;
  }

  enemies.forEach(enemy => {
    player.preventSpriteCollision(enemy, rooms);
    enemies.filter(e => e !== enemy).forEach(edash => {
      enemy.preventSpriteCollision(edash, rooms);
    })
  });

  // remove for invisibility?

  player.draw();
  ctx.restore();

  // ctx.restore();

}

player.x = 200;
player.y = 200;

animate();

export { player, projectiles, enemies, keysPressed, ctx };  