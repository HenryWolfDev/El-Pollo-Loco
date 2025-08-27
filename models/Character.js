import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class Character extends MoveabelObject {
  x = 0;
  y = 230;
  width = 150;
  height = 200;

  speedX = 10;

  images_Walking = imageLoader.PLAYER.walk;
  constructor(world) {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadingImages();
    IntervalHub.startInterval(this.animate, 1000 / 10);
  }

  loadingImages() {
    this.loadImages(this.images_Walking);
  }

  animate = () => {
    if (this.world.keyboard.RIGHT) {
      this.moveRight();
      this.otherDirection = false;
      this.playAnimation(this.images_Walking);
    }
    if (this.world.keyboard.LEFT) {
      this.moveLeft();
      this.otherDirection = true;
      this.playAnimation(this.images_Walking);
    }
    this.world.camera_x = -this.x;
  };

  jump() {}
}
