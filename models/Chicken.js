import { MoveableObject } from "./MoveableObject.js";
export class Chicken extends MoveableObject {
  width = 100;
  height = 100;
  y = 340;
  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 550 - Math.random() * 200;
  }
}
