import { MoveabelObject } from "./MoveableObject.js";
import { SpawnManager } from "../game/SpawnManager.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { imageLoader } from "../game/imageLoader.js";
import { AudioHub } from "../game/AudioHub.js";

/**
 * Smaller chicken enemy variant with its own walk and death animations.
 */
export class ChickenSmall extends MoveabelObject {
  x = 1000;
  y = 340;
  width = 60;
  height = 80;

  images_Walking = imageLoader.ENEMIE_CHICKEN.chicken_small.walk;
  images_Dead = imageLoader.ENEMIE_CHICKEN.chicken_small.dead;

  isDeadSoundPlaying = false;

  speedX = 1.5;

  /**
   * Initializes the small chicken, randomizes its spawn offset, and starts the walk loop.
   */
  constructor() {
    super().loadImage(
      "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png"
    );
    this.x += SpawnManager.getNextSpawnX();
    this.speedX = this.speedX + Math.random() * 0.5;
    this.loadImages(this.images_Walking);
    this.loadImages(this.images_Dead);
    IntervalHub.startInterval(this.animate, 1000 / 30);
  }

  animate = () => {
    this.moveLeft();
    this.playAnimation(this.images_Walking);
    this.playDeadAnimation();
  };

  /**
   * Plays the small chicken's death animation and triggers its sound once.
   */
  playDeadAnimation() {
    if (this.isdead()) {
      if (!this.isDeadSoundPlaying) {
        AudioHub.playOne(AudioHub.Chicken_Dead2);
        this.isDeadSoundPlaying = true;
      }
      this.playAnimation(this.images_Dead);
      return;
    }
  }
}
