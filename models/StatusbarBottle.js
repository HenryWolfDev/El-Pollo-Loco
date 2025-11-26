import { DrawableObject } from "./DrawableObject.js";
import { imageLoader } from "../game/imageLoader.js";

/**
 * HUD bar showing how many throwable bottles the player has collected.
 */
export class StatusbarBottles extends DrawableObject {
  images_Bottle = imageLoader.STATUSBAR.statusbarBottle;
  width = 200;
  height = 50;
  x = 0;
  y = 100;

  constructor() {
    super();
    this.loadImages(this.images_Bottle);
    this.setPercentage(0);
  }

  /**
   * Draws the bar and the current bottle count as text above it.
   */
  draw(ctx) {
    super.draw(ctx);
    const centerX = this.x + this.width / 2;
    const centerY = this.y - 65;
    this.drawText(ctx, this.percentage, centerX, centerY);
  }

  /**
   * Updates the bar sprite based on collected bottles.
   * @param {number} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images_Bottle[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves which image to show based on how many bottles are available.
   * @returns {number}
   */
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
