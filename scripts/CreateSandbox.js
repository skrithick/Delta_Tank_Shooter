import { BIGBOY, Enemy, Machiner, Sniper } from "./Enemy.js"; // Adjust path if needed
import { rooms, enemies, ctx, MAX_HEALTH } from "../main.js";
import { Room } from "./Room.js";
import { Barrier } from "./Barrier.js";

export function generateGridMap(rows, cols, roomWidth, roomHeight) {
  rooms.length = 0;
  enemies.length = 0;

  const roomSize = 400; 
  const hallwayLength = 80;
  const padding = 80; 
  const thickness = 10; 

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const thisx = padding + c * (roomSize + hallwayLength);
      const thisy = padding + r * (roomSize + hallwayLength);

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
      
      const newRoom = new Room(thisx, thisy, roomSize, roomSize, entrances);
      rooms.push(newRoom);
      
      if (r !== 0 || c !== 0) {
        const isBIGBOYroom = Math.floor(Math.random() * 10) === 7;
        if (isBIGBOYroom) {
          const randomX = thisx + 50 + Math.random() * (roomSize - 100);
          const randomY = thisy + 50 + Math.random() * (roomSize - 100);
          // console.log(isBIGBOYroom)
          enemies.push(new BIGBOY(randomX, randomY));
          continue;
        }
        const enemyCount = Math.floor(Math.random() * 3) + 1; 
        for (let i = 0; i < enemyCount; i++) {
          const randomX = thisx + 50 + Math.random() * (roomSize - 100);
          const randomY = thisy + 50 + Math.random() * (roomSize - 100);
          const enemyType = Math.floor(Math.random() * 3)
          let enemy;
          if (enemyType === 1) {
            enemy = new Enemy(randomX, randomY);
          } else if (enemyType === 2) {
            enemy = new Sniper(randomX, randomY);
          } else {
            enemy = new Machiner(randomX, randomY);
          }
          enemies.push(enemy);
        }
      }
    }
  }
}