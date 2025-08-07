import { MoveableObject } from "./MoveableObject.js";
import { imageLoader } from "../js/imageLoader.js";
import { SpawnXManager } from "../js/SpawnXManager.js";
export class Chicken extends MoveableObject {
  width = 100;
  height = 100;
  y = 340;
  walk = [];

  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = SpawnXManager.getNextSpawnX();

    this.speed = 0.1 + Math.random() * 0.15;
    this.loadWalk();
    this.startIdleAnimation();
  }

  loadWalk() {
    this.loadImages(imageLoader.ENEMIE_CHICKEN.chicken_normal.walk);
  }

  // fix
  startIdleAnimation() {
    this.moveLeft();

    let i = 0;
    setInterval(() => {
      this.image = this.imageCache[i % this.imageCache.length];
      i++;
    }, 1000 / 3.5);
  }
}
