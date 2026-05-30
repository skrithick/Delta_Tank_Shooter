import { Player } from "./Player.js";
import { Projectile } from "./Projectile.js";
import { angleOfThisPoint, rectangleAndCircleCollided } from "./utils.js";
import { projectiles, player, MAX_HEALTH, rooms, ctx } from "../main.js";

export class Enemy extends Player {
  constructor(x, y, radius = 25, color = 'crimson', strength=20, speed = 1.5, maxHealth = MAX_HEALTH, eyeSight = 150, fireRate = 1600) {

    super(x=x, y=y, color='crimson', strength=20);
    this.strength = strength;
    this.lastShotTime = 0;
    this.max_health = MAX_HEALTH;
    this.radius = radius;
    this.projectileRadius = 5;
    this.projectileSpeed = 5;
    this.color = 'crimson';
    this.health = this.max_health;
    this.eyeSight = eyeSight;
    this.speed = player.speed * 0.5;
    this.fireRate = fireRate;
    this.state = '';
    this.chaseRange = this.eyeSight * 2;
    
  } 
  rotateTowardsPlayer() {
    this.turretAngle = Math.PI + angleOfThisPoint(this.x, this.y);
  }
  shoot() {
    const theta = this.turretAngle;

    const projectile = new Projectile(this.x + this.radius*Math.cos(theta), this.y + this.radius*Math.sin(theta), this.projectileRadius, "black", {
      x: Math.cos(theta) * this.projectileSpeed,
      y: Math.sin(theta) * this.projectileSpeed
    }, 5, this);

    projectiles.push(projectile);
  }
  update() {
    const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    
    const attackRange = this.eyeSight;
    const chaseRange = this.chaseRange;

    if (distanceToPlayer < chaseRange) {
      this.rotateTowardsPlayer();
      // console.log('Rotated', this)
      const currentTime = Date.now();
      if (currentTime - this.lastShotTime > this.fireRate) {
        this.shoot();
        this.lastShotTime = currentTime; 
      } 
      
      else {
        let currentSpeed = {
          x: -Math.cos(angleOfThisPoint(this.x, this.y)) * this.speed,
          y: -Math.sin(angleOfThisPoint(this.x, this.y)) * this.speed
        };

        let collided = false;

        this.x += currentSpeed.x;
        rooms.forEach((room) => {
          room.barriers.forEach(barrier => {
            if (rectangleAndCircleCollided(barrier, this)) collided = true;
          });
        });
        collided && (this.x -= currentSpeed.x);
        collided = false;

        this.y += currentSpeed.y;
        rooms.forEach((room) => {
          room.barriers.forEach(barrier => {
            if (rectangleAndCircleCollided(barrier, this)) collided = true;
          });
        });
        collided && (this.y -= currentSpeed.y);
      }
    }

    this.draw();
  }
}

export class Sniper extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.strength = 40;
    this.color = 'purple';
    this.turretLength *= 3;
    this.eyeSight = 500;
    this.fireRate *= 3.5;
    this.chaseRange = 500;
  }
}

export class Machiner extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.color = 'orange';
    this.fireRate /= 3;
    this.strength = 5;
    this.eyeSight = 150;
    this.radius /= 1.2;
  }
}

export class BIGBOY extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.color = 'teal';
    this.fireRate /= 1.2;
    this.strength = 60;
    this.eyeSight = 150;
    this.turretWidth = 20;
    this.projectileRadius = 15;
    this.radius = 40;
  }
}