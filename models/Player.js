import { MoveableObject } from "./MoveableObject.js";
import { imageLoader } from "../js/imageLoader.js";

export class Player extends MoveableObject {
  width = 150;
  height = 300;
  idle = [];

  constructor() {
    super().loadImage("../img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadIDLE();
    this.startIdleAnimation();
  }

  loadIDLE() {
    this.loadImages(imageLoader.PLAYER.idle);
  }

  startIdleAnimation() {
    let i = 0;
    setInterval(() => {
      this.image = this.imageCache[i % this.imageCache.length];
      i++;
    }, 1000 / 3.5);
  }

  jump() {}
}
