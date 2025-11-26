import { DrawableObject } from "./DrawableObject.js";
import { imageLoader } from "../game/imageLoader.js";

/**
 * HUD bar tracking how many coins the player has collected.
 */
export class StatusbarCoins extends DrawableObject {
  images_Coins = imageLoader.STATUSBAR.statusbarCoins;
  width = 200;
  height = 50;
  x = 0;
  y = 50;

  constructor() {
    super();
    this.loadImages(this.images_Coins);
    this.setPercentage(0);
  }

  /**
   * Updates the bar sprite based on collected coins.
   * @param {number} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images_Coins[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Draws the bar and overlays the current coin count.
   */
  draw(ctx) {
    super.draw(ctx);
    const centerX = this.x + this.width / 2;
    const centerY = this.y - 15;
    this.drawText(ctx, this.percentage, centerX, centerY);
  }

  /**
   * Resolves which image to show based on coin total.
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
