import { MoveabelObject } from "./MoveableObject.js";
import { SpawnManager } from "../game/SpawnManager.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { imageLoader } from "../game/imageLoader.js";
import { AudioHub } from "../game/AudioHub.js";
export class ChickenNormal extends MoveabelObject {
  x = 700;
  y = 330;
  img;
  width = 75;
  height = 100;

  images_Walking = imageLoader.ENEMIE_CHICKEN.chicken_normal.walk;
  images_Dead = imageLoader.ENEMIE_CHICKEN.chicken_normal.dead;

  speedX = 2.5;

  isDeadSoundPlaying = false;

  constructor() {
    super().loadImage(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.x += SpawnManager.getNextSpawnX();
    this.speedX = this.speedX + Math.random() * 0.5;
    this.loadImages(this.images_Walking);
    this.loadImages(this.images_Dead);
    IntervalHub.startInterval(this.animate, 1000 / 5);
  }

  animate = () => {
    this.moveLeft();
    this.playAnimation(this.images_Walking);
    this.playDeadAnimation();
  };

  playDeadAnimation() {
    if (this.isdead()) {
      if (!this.isDeadSoundPlaying) {
        AudioHub.playOne(AudioHub.Chicken_Dead);
        this.isDeadSoundPlaying = true;
      }
      this.playAnimation(this.images_Dead);
      return;
    }
  }
}
