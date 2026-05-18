import { Barrier } from "./Barrier.js";
import { ctx } from '../main.js'

export class Room {
  constructor(x, y, width, height, entrances={}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.entrances = entrances;
    this.barriers = []

    this.buildRoom();
  }

  buildRoom() {
    const thickness = this.width / 40, entranceWidth = 80;
    const p = (this.height + entranceWidth) / 2;
    const q = (this.width + entranceWidth) / 2;
    const halfWallHorizontal = (this.width - entranceWidth) / 2;
    const halfWallVertical = (this.height - entranceWidth) / 2;
    const barriers = [];

    // Logic to locate the length and starting location of barriers
    // Took way longer than required
    
    if (this.entrances.top) {
      this.barriers.push(new Barrier(this.x, this.y, halfWallHorizontal, thickness));
      this.barriers.push(new Barrier(this.x + q, this.y, halfWallHorizontal, thickness));
    } else {
      this.barriers.push(new Barrier(this.x, this.y, this.width, thickness));
    }
    if (this.entrances.bottom) {
      this.barriers.push(new Barrier(this.x, this.y + this.height - thickness, halfWallHorizontal, thickness));
      this.barriers.push(new Barrier(this.x + q, this.y + this.height - thickness, halfWallHorizontal, thickness));
    } else {
      this.barriers.push(new Barrier(this.x, this.y + this.height - thickness, this.width, thickness));
    }
    if (this.entrances.left) {
      this.barriers.push(new Barrier(this.x, this.y, thickness, halfWallVertical));
      this.barriers.push(new Barrier(this.x, this.y + p, thickness, halfWallVertical));
    } else {
      this.barriers.push(new Barrier(this.x, this.y, thickness, this.height));
    }
    if (this.entrances.right) {
      this.barriers.push(new Barrier(this.x + this.width - thickness, this.y, thickness, halfWallVertical));
      this.barriers.push(new Barrier(this.x + this.width - thickness, this.y + p, thickness, halfWallVertical));
    } else {
      this.barriers.push(new Barrier(this.x + this.width - thickness, this.y, thickness, this.height));
    }
  }

  draw() {
    this.barriers.forEach(barrier => barrier.draw(ctx));
  }
}