import { MoveableObject } from "./MoveableObject.js";
export class Cloud extends MoveableObject {
  constructor() {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");
    this.x = 400 - Math.random() * 200;
    this.y = 10 - Math.random() * 10;
    this.width = 400;
    this.height = 250;
  }
}
