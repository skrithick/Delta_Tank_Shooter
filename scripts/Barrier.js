import { ctx } from "../main.js";

export class Barrier {
  constructor(x, y, width, height, color='#004400') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw() {
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#1558109c";
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}