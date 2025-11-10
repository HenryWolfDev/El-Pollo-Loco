import { DrawableObject } from "./DrawableObject.js";
import { imageLoader } from "../game/imageLoader.js";

export class StatusbarHealth extends DrawableObject {
  images_Health = imageLoader.STATUSBAR.statusbarHealth;
  width = 200;
  height = 50;
  x = 0;
  y = 0;
  constructor() {
    super();
    this.loadImages(this.images_Health);
    this.setPercentage(100);
  }

  draw(ctx) {
    super.draw(ctx);
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 1.45;
    this.drawText(ctx, this.percentage, centerX, centerY);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images_Health[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
