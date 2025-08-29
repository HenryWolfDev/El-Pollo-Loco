import { imageLoader } from "../game/imageLoader.js";
import { DrawableObject } from "./DrawableObject.js";

export class StatusbarBossHealth extends DrawableObject {
  images_Health = imageLoader.STATUSBAR.statusbarEndboss;

  constructor() {
    super();
    this.loadImages(this.images_Health);
    this.x = 510;
    this.y = 55;
    this.width = 200;
    this.height = 70;
    this.setPercentage(100);
  }

  draw(ctx) {
    super.draw(ctx);
    const centerX = this.width / 2;
    const centerY = this.height / 1.75;
    this.drawText(ctx, this.percentage, centerX, centerY);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images_Health[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage > 80) {
      return 5;
    } else if (this.percentage > 60) {
      return 4;
    } else if (this.percentage > 40) {
      return 3;
    } else if (this.percentage > 20) {
      return 2;
    } else if (this.percentage > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}
