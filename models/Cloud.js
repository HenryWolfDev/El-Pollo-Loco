import { MoveabelObject } from "./MoveableObject.js";
import { SpawnManager } from "../game/SpawnManager.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class Cloud extends MoveabelObject {
  width = 550;
  height = 200;
  speedX = 2;

  constructor() {
    super().loadImage("../assets/img/5_background/layers/4_clouds/full.png");
    this.x = SpawnManager.getNextSpawnXForClouds();
    this.y = SpawnManager.getNextSpawnYForClouds();
    IntervalHub.startInterval(this.animate, 1000 / 5);
  }
  animate = () => {
    this.moveLeft();
  };

  moveLeft() {
    this.x -= this.speedX;
  }
}
