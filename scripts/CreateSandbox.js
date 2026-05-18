import { Enemy } from "./Enemy.js"; // Adjust path if needed
import { rooms, enemies, ctx } from "../main.js";
import { Room } from "./Room.js";
import { Barrier } from "./Barrier.js";
// Assuming 'rooms' and 'enemies' are your global arrays in main.js

export function generateGridMap(rows, cols, roomWidth, roomHeight) {
  // Empty everything
  rooms.length = 0;
  enemies.length = 0;

  // Configuration
  const roomSize = 400; 
  const hallwayLength = 80;
  const padding = 80; 
  const thickness = 10;     // Must match the one inside your Room class!

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padding + c * (roomSize + hallwayLength);
      const y = padding + r * (roomSize + hallwayLength);

      let doorCount = 0;

      const entrances = {
        top: Math.random() > 0.5,
        bottom: Math.random() > 0.5,
        left: Math.random() > 0.5,
        right: Math.random() > 0.5,
      };

      Object.keys(entrances).forEach(key => entrances[key] ? doorCount++ : NaN)

      if (doorCount === 0)  {
        let chosenDoor = Object.keys(entrances)[Math.floor(Math.random() * 4)]
        entrances[chosenDoor] = true;
        doorCount++;
      }
      
      const newRoom = new Room(x, y, roomSize, roomSize, entrances);
      rooms.push(newRoom);
      
      // Optional: Spawn enemies here, skipping room (0,0) so the player is safe
      if (r !== 0 || c !== 0) {
        const enemyCount = Math.floor(Math.random() * 3) + 1; 
        for (let i = 0; i < enemyCount; i++) {
          const randomX = x + 50 + Math.random() * (roomSize - 100);
          const randomY = y + 50 + Math.random() * (roomSize - 100);
          const enemy = new Enemy(randomX, randomY, 25, 20, 100);
          enemy.color = 'crimson';
          enemies.push(enemy);
        }
      }
    }
  }
}