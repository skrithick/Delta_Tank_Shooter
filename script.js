console.log('Hello, Canvas!');

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

// Break glass in case of powerups
let MAX_HEALTH = 100;
let RECOVERY_TIME = 600;
let RECOVERY_RATE = 0.5;

/* Gotta think of a better way to regen health */

class Player {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.health = MAX_HEALTH;
    this.speed = speed;
    this.takingDamage = false;
    this.turretAngle = 0;
  }

  damage(amount) {
    this.takingDamage = true;
    this.health -= amount;
  }

  regen(rate) {
    if (this.takingDamage) {
      setTimeout(() => {
        this.takingDamage = false;
      }, RECOVERY_TIME);
    }
    if (!this.takingDamage) {
      if (this.health < MAX_HEALTH) {
        this.health += rate * (1 - (this.health / MAX_HEALTH));
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    const topX = this.x - 25;
    const topY = this.y - this.radius - 15;

    ctx.fillStyle = 'red';
    ctx.fillRect(topX, topY, 50, 6);

    const healthPercentage = this.health / MAX_HEALTH;
    ctx.fillStyle = '#32cd32';
    ctx.fillRect(topX, topY, 50 * healthPercentage, 6);
    
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.turretAngle);
    ctx.fillStyle = this.color;
    ctx.fillRect(0, -10, this.radius + 20, 20);

    ctx.restore();
  }
}

class Projectile extends Player {
  constructor(x, y, radius, color, velocity, speed, owner) {
    super(x, y, radius, color, velocity);
    this.velocity = velocity;
    this.owner = owner;
  } update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  } draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Enemy extends Player {
  constructor(x, y, radius, strength, MAX_HEALTH, eyeSight=200, fireRate=1000) {
    super(x, y, radius=player.radius * 1.5, 'crimson', 2);
    this.strength = strength;
    this.lastShotTime = 0;
    this.MAX_HEALTH = MAX_HEALTH;
    this.eyeSight = eyeSight;
    this.speed = player.speed * 0.75;
    this.fireRate = fireRate;
  } rotateTowardsPlayer() {
    this.turretAngle = Math.PI + angleOfThisPoint(this.x, this.y);
  } shoot() {
    const theta = this.turretAngle;
    const projectile = new Projectile(this.x + this.radius*Math.cos(theta), this.y + this.radius*Math.sin(theta), 5, "black", {
      x: Math.cos(theta) * 5,
      y: Math.sin(theta) * 5
    }, 5, this);
    projectiles.push(projectile);
    projectile.draw();
    projectile.update();
  } update() {
    const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    if (distanceToPlayer < this.eyeSight) {
      this.rotateTowardsPlayer();
      this.x -= Math.cos(angleOfThisPoint(this.x, this.y)) * this.speed;
      this.y -= Math.sin(angleOfThisPoint(this.x, this.y)) * this.speed;
    }
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime > this.fireRate && distanceToPlayer < this.eyeSight) {
      this.shoot();
      this.lastShotTime = currentTime; // Reset the timer
    }
    this.draw();
  }
}

// PLAYER MOVEMENT

let mouseX = 0;
let mouseY = 0;
let keysPressed = {
  w: false,
  a: false,
  s: false,
  d: false
};

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// PLAYER INIT

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 25, "blue", 3);
const projectiles = [];

// ENEMIES
const enemies = [];

const enemy = new Enemy(100, 100, 25, 10, 50, 400);
enemies.push(enemy);


function angleOfThisPoint(x, y) {
  return Math.atan2(y - player.y, x - player.x);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  enemies.forEach((enemy) => {
    enemy.update();
  });
  projectiles.forEach((projectile) => {
    projectile.update();
  });
  
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

  player.turretAngle = angleOfThisPoint(mouseX, mouseY);

  if (player.health <= 0) {
    alert('Game Over!');
    keysPressed = {};
    player.health = MAX_HEALTH;
    player.x = x;
    player.y = y;
  }
  player.draw();
}

window.addEventListener('click', (e) => {
  const theta = angleOfThisPoint(e.clientX, e.clientY);
  const projectile = new Projectile(player.x + player.radius*Math.cos(theta), player.y + player.radius*Math.sin(theta), 5, "red", {
    x: Math.cos(theta) * 5,
    y: Math.sin(theta) * 5
  }, 5, player);
  projectiles.push(projectile);
  projectile.draw();
  projectile.update();
})

window.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false;
});

animate();
