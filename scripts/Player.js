import { MAX_HEALTH, RECOVERY_RATE, RECOVERY_TIME } from "../main.js";
import { ctx } from "../main.js";

export class Player {
  constructor(x, y, radius, color, speed)
  {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.health = MAX_HEALTH;
    this.speed = speed;
    this.takingDamage = false;
    this.turretAngle = 0;
  }

  damage(amount)
  {
    this.takingDamage = true;
    this.health -= amount;
  }

  regen(rate)
  {
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

  draw()
  {
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