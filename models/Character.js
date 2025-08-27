import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { Level } from "./Level.js";

export class Character extends MoveabelObject {
  x = 3400;
  y = 230;
  width = 150;
  height = 200;

  speedX = 50;

  images_Walking = imageLoader.PLAYER.walk;
  constructor(world) {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadingImages();
    IntervalHub.startInterval(this.movement, 1000 / 10);
  }

  loadingImages() {
    this.loadImages(this.images_Walking);
  }

  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  movement = () => {
    if (this.world.keyboard.RIGHT && this.x < Level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.playAnimation(this.images_Walking);
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.playAnimation(this.images_Walking);
    }
    this.updateCamera();
  };

  jump() {}
}
