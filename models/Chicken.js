import { MoveableObject } from "./MoveableObject.js";
import { imageLoader } from "../js/imageLoader.js";
import { SpawnXManager } from "../js/SpawnXManager.js";
import { IntervalHub } from "../js/IntervalHub.js";

export class Chicken extends MoveableObject {
  width = 100;
  height = 100;
  y = 340;
  walk = [];
  animationIndex = 0;

  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = SpawnXManager.getNextSpawnX();
    this.speedX = 0.1 + Math.random() * 0.15;

    this.loadWalk(() => {
      this.startAnimation();
    });
  }

  loadWalk(onLoaded) {
    this.loadImages(imageLoader.ENEMIE_CHICKEN.chicken_normal.walk, onLoaded);
  }

  animateIdle = () => {
    const img = this.imageCache[this.animationIndex % this.imageCache.length];
    if (img && img.complete) {
      this.image = img;
      this.animationIndex++;
    }
  };

  startAnimation() {
    this.moveLeft();
    IntervalHub.startInterval(this.animateIdle, 1000 / 3.5);
  }
}
