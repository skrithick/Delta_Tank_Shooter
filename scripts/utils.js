import { player } from "../main.js";

export function angleOfThisPoint(x, y) {
  return Math.atan2(y - player.y, x - player.x);
}

export function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

/** Somehow checking for collisions */

export function collisionDetectedBetween(sprite1, sprite2, type=[]) {

}

export function circlesCollided(circle1, circle2) {
  const deltax = circle2.x - circle1.x; // Hehe Delta
  const deltay = circle2.y - circle1.y;
  return Math.hypot(deltax, deltay) < (circle1.radius + circle2.radius);
}

export function rectangleAndCircleCollided(rect, circle) {
  const contactX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const contactY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  const distanceX = circle.x - contactX;
  const distanceY = circle.y - contactY;
  
  return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY)) < circle.radius;
}