import { Player } from "./Player.js";
import { ctx, points, /* player, projectiles, enemies */ } from "../main.js";
import { rectangleAndCircleCollided, circlesCollided } from "./utils.js";
import { updateHUD } from "./keyListeners.js";
// import { Sniper } from "./enemy.js";
// import { Enemy } from "./enemy.js";

export class Projectile extends Player {
  constructor(x, y, radius, color, velocity, speed, owner)
  {
    super(x, y, radius, color, velocity);
    this.velocity = velocity;
    this.owner = owner;
    this.bounceCount = 0;
    this.isDead = false;
  }
  draw()
  {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  checkCollisionWithWall(rooms) {
    for (const room of rooms) {
      for (const barrier of room.barriers) {
        if (rectangleAndCircleCollided(barrier, this)) {
          this.bounceCount++;
          if (this.bounceCount >= 5) {
            this.isDead = true;
          }
          return true;
        }
      }
    }
    return false;
  }
  checkCollisionWithSprite(player, enemies, projectiles) {
    if (this.owner !== player) {
      // console.log('boom')
      if (circlesCollided(player, this)) {
        player.damage(this.owner.strength);
        updateHUD();
        const index = projectiles.indexOf(this);
        if (index > -1) {
          projectiles.splice(index, 1);
        }
        return true;
      }
    }
    if (this.owner === player) {
        for (const enemy of enemies) {
          if (circlesCollided(enemy, this)) {
            // console.log(enemy)
            enemy.damage(10);
            if (enemy.health <= 0) {
              const enemyIndex = enemies.indexOf(enemy);
              if (enemyIndex > -1) {
                enemies.splice(enemyIndex, 1);
                points.points += 20;
                updateHUD();
              }
            }
            const index = projectiles.indexOf(this);
            if (index > -1) {
              projectiles.splice(index, 1);
            }
            return true;
          }
        }
    }
    return false;
  }
  update(rooms, player, enemies, projectiles)
  {
    if (this.isDead) {
      const index = projectiles.indexOf(this);
      if (index > -1) {
        projectiles.splice(index, 1);
      }
    }
    this.x += this.velocity.x;
    if (this.checkCollisionWithWall(rooms)) {
      this.x -= this.velocity.x
      this.velocity.x *= (-0.95)
    }

    this.y += this.velocity.y;
    if (this.checkCollisionWithWall(rooms)) {
      this.y -= this.velocity.y
      this.velocity.y *= (-0.95)
    }

    if (!this.checkCollisionWithSprite(player, enemies, projectiles)) {
      this.draw();
    }
  }
}