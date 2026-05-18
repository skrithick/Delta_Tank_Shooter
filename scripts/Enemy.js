import { Player } from "./Player.js";
import { Projectile } from "./Projectile.js";
import { angleOfThisPoint, rectangleAndCircleCollided } from "./utils.js";
import { projectiles, player, MAX_HEALTH, rooms } from "../main.js";

export class Enemy extends Player {
  constructor(x, y, radius, strength, MAX_HEALTH, eyeSight=100, fireRate=1000) {

    super(x, y, 'crimson', 2);
    this.strength = strength;
    this.lastShotTime = 0;
    this.MAX_HEALTH = MAX_HEALTH;
    this.radius = radius;
    this.color = 'crimson';
    this.health = MAX_HEALTH;
    this.eyeSight = eyeSight;
    this.speed = player.speed * 0.75;
    this.fireRate = fireRate;
    this.state = '';
    
  } 
  rotateTowardsPlayer() {
    this.turretAngle = Math.PI + angleOfThisPoint(this.x, this.y);
  }
  shoot() {
    const theta = this.turretAngle;

    const projectile = new Projectile(this.x + this.radius*Math.cos(theta), this.y + this.radius*Math.sin(theta), 5, "black", {
      x: Math.cos(theta) * 5,
      y: Math.sin(theta) * 5
    }, 5, this);

    projectiles.push(projectile);
  }
  update() {
    const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    
    const attackRange = this.eyeSight;
    const chaseRange = this.eyeSight * 2;

    if (distanceToPlayer < chaseRange) {
      this.rotateTowardsPlayer();

      if (distanceToPlayer >= attackRange) {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime > this.fireRate) {
          this.shoot();
          this.lastShotTime = currentTime; 
        }
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