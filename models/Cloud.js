import { MoveableObject } from "./MoveableObject.js";
export class Cloud extends MoveableObject {
  width = 400;
  height = 250;
  speed = 0.25;
  constructor() {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");
    this.x = 400 - Math.random() * 200;
    this.y = 10 - Math.random() * 10;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
