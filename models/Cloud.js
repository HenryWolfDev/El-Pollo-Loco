import { MoveableObject } from "./MoveableObject.js";
export class Cloud extends MoveableObject {
  constructor() {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");
    this.x = 600 - Math.random() * 200;
    this.y = 20 - Math.random() * 10;
    this.width = 300;
    this.height = 150;
  }
}
