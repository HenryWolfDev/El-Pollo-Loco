import { MoveabelObject } from "./MoveableObject.js";
import { SpawnManager } from "../game/SpawnManager.js";

export class ChickenNormal extends MoveabelObject {
  y = 230;
  img;
  width = 100;
  height = 100;
  constructor() {
    super().loadImage(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.x = SpawnManager.getNextSpawnX();
  }

  moveLeft() {}
}
