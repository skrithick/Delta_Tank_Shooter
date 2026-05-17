import { angleOfThisPoint } from "./utils.js";
import { Projectile } from "./Projectile.js";
import { player, projectiles, keysPressed, mouseX, mouseY, mouse } from "../main.js";

export function Listeners() {
  window.addEventListener('click', (e) => {
    const theta = angleOfThisPoint(e.clientX, e.clientY);
    const projectile = new Projectile(player.x + player.radius*Math.cos(theta), player.y + player.radius*Math.sin(theta), 5, "red", {
      x: Math.cos(theta) * 5,
      y: Math.sin(theta) * 5
    }, 5, player);
    projectiles.push(projectile);
    projectile.draw();
    projectile.update();
  })

  window.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
  });

  window.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
  });

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
}