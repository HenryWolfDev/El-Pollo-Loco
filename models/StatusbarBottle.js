import { DrawableObject } from "./DrawableObject.js";
import { imageLoader } from "../game/imageLoader.js";
export class StatusbarBottles extends DrawableObject {
  images_Bottle = imageLoader.STATUSBAR.statusbarBottle;

  constructor() {
    super();
    this.loadImages(this.images_Bottle);
    this.x = 0;
    this.y = 100;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
  }

  draw(ctx) {
    super.draw(ctx);
    const centerX = this.x + this.width / 2;
    const centerY = this.y - 65;
    this.drawText(ctx, this.percentage, centerX, centerY);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images_Bottle[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage >= 5) {
      return 5;
    } else if (this.percentage >= 4) {
      return 4;
    } else if (this.percentage >= 3) {
      return 3;
    } else if (this.percentage >= 2) {
      return 2;
    } else if (this.percentage >= 1) {
      return 1;
    } else {
      return 0;
    }
  }
}
