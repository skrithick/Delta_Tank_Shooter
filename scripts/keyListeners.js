import { angleOfThisPoint } from "./utils.js";
import { Projectile } from "./Projectile.js";
import { player, projectiles, keysPressed, mouse, camera, currentGameState, debugButtons } from "../main.js";

export function Listeners(rooms) {
  window.addEventListener('click', (e) => {
    const theta = player.turretAngle;
    const projectile = new Projectile(player.x + player.radius*Math.cos(theta), player.y + player.radius*Math.sin(theta), 5, "red", {
      x: Math.cos(theta) * 5,
      y: Math.sin(theta) * 5
    }, 5, player);
    projectiles.push(projectile);
  })

  window.addEventListener('keydown', (e) => {
    /** DEBUGGING THINGS */
    if (e.key === '\\') {
      e.preventDefault();
      debugButtons["cntrl-shadow"] = !debugButtons["cntrl-shadow"];
    }

    keysPressed[e.key] = true;

    if (e.key === ' ') {
      e.preventDefault(); 

      currentGameState.PAUSED = !currentGameState.PAUSED
    }
  });

  window.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
  });

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
}