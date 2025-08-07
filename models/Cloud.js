import { MoveableObject } from "./MoveableObject.js";
import { SpawnXManager } from "../js/SpawnXManager.js";
export class Cloud extends MoveableObject {
  width = 400;
  height = 250;

  constructor() {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");
    this.x = 400 - Math.random() * 400;
    this.y = 10 - Math.random() * 10;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
