import { MoveabelObject } from "./MoveableObject.js";
import { SpawnManager } from "../game/SpawnManager.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class Cloud extends MoveabelObject {
  width = 550;
  height = 280;
  speedX = 0.25;

  constructor() {
    super().loadImage("assets/img/5_background/layers/4_clouds/full.png");
    this.x = SpawnManager.getNextSpawnXForClouds();
    this.y = SpawnManager.getNextSpawnYForClouds();
    IntervalHub.startInterval(this.animate, 1000 / 50);
  }
  animate = () => {
    this.moveLeft();
  };
}
