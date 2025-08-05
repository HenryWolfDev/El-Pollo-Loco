import { MoveableObject } from "./MoveableObject.js";
import { imageLoader } from "../js/imageLoader.js";
export class Chicken extends MoveableObject {
  width = 100;
  height = 100;
  y = 340;
  walk = [];
  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 550 - Math.random() * 200;
    this.loadWalk();
    this.startIdleAnimation();
  }

  loadWalk() {
    this.loadImages(imageLoader.ENEMIE_CHICKEN.chicken_normal.walk);
  }

  startIdleAnimation() {
    let i = 0;
    setInterval(() => {
      this.image = this.imageCache[i % this.imageCache.length];
      i++;
    }, 1000 / 3.5);
  }
}
