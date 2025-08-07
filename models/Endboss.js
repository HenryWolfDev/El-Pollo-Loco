import { MoveableObject } from "./MoveableObject.js";
import { imageLoader } from "../js/imageLoader.js";
import { IntervalHub } from "../js/IntervalHub.js";

export class Endboss extends MoveableObject {
  width = 350;
  height = 350;
  y = 95;
  animationIndex = 0;

  constructor() {
    super().loadImage("../img/4_enemie_boss_chicken/1_walk/G1.png");
    this.x = 2400; // Endboss erscheint weiter hinten im Level
    this.speed = 0.05;

    this.loadIdle(() => {
      this.startIdleAnimation();
    });
  }

  loadIdle(onload) {
    this.loadImages(imageLoader.ENEMIE_BOSS_CHICKEN.alert, onload);
  }

  loadWalk(onLoaded) {
    this.loadImages(imageLoader.ENEMIE_BOSS_CHICKEN.walk, onLoaded);
  }

  animateIdle = () => {
    const img = this.imageCache[this.animationIndex % this.imageCache.length];
    if (img && img.complete) {
      this.image = img;
      this.animationIndex++;
    }
  };

  startIdleAnimation() {
    IntervalHub.startInterval(this.animateIdle, 1000 / 3);
  }
}
