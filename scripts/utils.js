import { player } from "../main.js";

export function angleOfThisPoint(x, y) {
  return Math.atan2(y - player.y, x - player.x);
}

export function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}