import { Player } from "./Player.js";
import { Projectile } from "./Projectile.js";
import { angleOfThisPoint } from "./utils.js";
import { projectiles, player, MAX_HEALTH } from "../main.js";

export class Enemy extends Player {
  constructor(x, y, radius, strength, MAX_HEALTH, eyeSight=200, fireRate=1000) {

    super(x, y, radius=player.radius * 1.5, 'crimson', 2);
    this.strength = strength;
    this.lastShotTime = 0;
    this.MAX_HEALTH = MAX_HEALTH;
    this.eyeSight = eyeSight;
    this.speed = player.speed * 0.75;
    this.fireRate = fireRate;
    
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
    projectile.draw();
    projectile.update();
  }
  update() {
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