import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class Character extends MoveabelObject {
  x = 0;
  y = 230;
  width = 150;
  height = 200;

  images_Walking = imageLoader.PLAYER.walk;
  constructor() {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadingImages();
    IntervalHub.startInterval(this.animate, 1000 / 10);
  }

  loadingImages() {
    this.loadImages(this.images_Walking);
  }

  animate = () => {
    let i = this.currentImage % this.images_Walking.length;
    let path = this.images_Walking[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  };

  jump() {}
}
