import { player } from "../main.js";

export function angleOfThisPoint(x, y) {
  return Math.atan2(y - player.y, x - player.x);
}