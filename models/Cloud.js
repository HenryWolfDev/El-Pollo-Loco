import { MoveabelObject } from "./MoveableObject.js";
import { SpawnManager } from "../game/SpawnManager.js";
import { IntervalHub } from "../game/IntervalHub.js";

/**
 * Parallax cloud layer that slowly drifts left across the background.
 */
export class Cloud extends MoveabelObject {
  width = 550;
  height = 280;
  speedX = 0.25;

  /**
   * Spawns a cloud at a random X/Y from SpawnManager and starts its drift animation.
   */
  constructor() {
    super().loadImage("assets/img/5_background/layers/4_clouds/full.png");
    this.x = SpawnManager.getNextSpawnXForClouds();
    this.y = SpawnManager.getNextSpawnYForClouds();
    IntervalHub.startInterval(this.animate, 1000 / 30);
  }
  animate = () => {
    this.moveLeft();
  };
}
