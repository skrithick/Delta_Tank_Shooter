import { Player } from "./Player.js";
import { ctx } from "../main.js";

export class Projectile extends Player {
  constructor(x, y, radius, color, velocity, speed, owner)
  {
    super(x, y, radius, color, velocity);
    this.velocity = velocity;
    this.owner = owner;
  }
  update()
  {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
  draw()
  {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}