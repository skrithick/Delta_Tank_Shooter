import { Enemy } from "./Enemy.js"; // Adjust path if needed
import { rooms, enemies, ctx } from "../main.js";
import { Room } from "./Room.js";
import { Barrier } from "./Barrier.js";
// Assuming 'rooms' and 'enemies' are your global arrays in main.js

export function generateGridMap(rows, cols, roomWidth, roomHeight) {
  // Clear the map
  rooms.length = 0;
  enemies.length = 0;

  // Configuration (Adjust these to fit your exact canvas size!)
  const roomSize = 300; 
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
        const enemy = new Enemy(x + 200, y + 100, 25, 20, 100)
        enemies.push(enemy)
      }
    }
  }
}