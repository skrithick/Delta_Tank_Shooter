import { MAX_HEALTH, RECOVERY_RATE, RECOVERY_TIME } from "../main.js";
import { ctx, camera } from "../main.js";
import { rectangleAndCircleCollided } from "./utils.js";

export class Player {
  constructor(x, y, radius, color, speed)
  {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.MAX_HEALTH = MAX_HEALTH;
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
  checkCollisionWithWall(rooms) {
    for (const room of rooms) {
      for (const barrier of room.barriers) {
        if (rectangleAndCircleCollided(barrier, this)) {
          return true;
        }
      }
    }
    return false;
  }
  preventSpriteCollision(sprite, rooms) {
    const deltax = sprite.x - this.x
    const deltay = sprite.y - this.y
    const delta = Math.hypot(deltax, deltay)
    const mindelta = this.radius + sprite.radius

    if (delta < mindelta) {
      const overlap = mindelta - delta;
      const normx = deltax/delta;
      const normy = deltay/delta;

      this.x -= normx * overlap / 2;
      this.checkCollisionWithWall(rooms) ? 
        this.x += normx * overlap / 2 : ``

      this.y -= normy * overlap / 2;
      this.checkCollisionWithWall(rooms) ? 
        this.y += normy * overlap / 2 : ``

      sprite.x += normx * overlap / 2;
      sprite.y += normy * overlap / 2;
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

    const healthPercentage = this.health / this.MAX_HEALTH;
    ctx.fillStyle = '#32cd32';
    ctx.fillRect(topX, topY, 50 * healthPercentage, 6);
    
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.turretAngle);
    ctx.fillStyle = this.color;
    ctx.fillRect(0, -7, this.radius + 10, 15);

    ctx.restore();
  }
  drawFlashLight() {
    const fov = Math.PI / 3; 
    const sightDistance = 300; 
    const startAngle = this.turretAngle - (fov / 2);
    const endAngle = this.turretAngle + (fov / 2);

    ctx.save();
    
    ctx.beginPath();
    ctx.rect(camera.x - 2000, camera.y - 2000, 6000, 6000); 
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, sightDistance, startAngle, endAngle);
    ctx.closePath();

    ctx.filter = "blur(35px)"; 
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)"; 
    ctx.fill("evenodd");
    
    ctx.filter = "none"; 

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, sightDistance, startAngle, endAngle);
    ctx.filter = "blur(10px)"; 
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, sightDistance);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)"); 
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");   

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }
}