import { angleOfThisPoint } from "./utils.js";
import { Projectile } from "./Projectile.js";
import { player, projectiles, keysPressed, mouse, camera, currentGameState, debugButtons, points, enemies, resetMap, MAX_HEALTH, starting } from "../main.js";

export function Listeners() {
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

export function updateHUD() {
  document.getElementById('health').innerHTML = Math.round(player.health);
  document.getElementById('points').innerHTML = points.points;
}

export function gameOver() {
  document.getElementById('gameover').style = 'display: flex;';
  document.getElementById('showpoints').innerHTML = `Points: ${points.points}`;
  document.getElementById('btn').addEventListener('click', restartGame)
}

export function restartGame() {
  document.getElementById('gameover').style = 'display: none;';
  for (let key in keysPressed) {
    keysPressed[key] = false; 
  }
  points.points = 0;
  player.health = MAX_HEALTH;
  player.x = starting.x;
  player.y = starting.y;
  enemies.length = 0;
  projectiles.length = 0;
  resetMap();
}