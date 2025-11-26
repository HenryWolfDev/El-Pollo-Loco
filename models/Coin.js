import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

/**
 * Collectible coin that animates in place.
 */
export class Coin extends MoveabelObject {
  x = 400;
  y = 330;
  width = 100;
  height = 100;

  images_Idle = imageLoader.Coins;
  /**
   * Places a coin at the given coordinates and starts its idle animation.
   * @param {number} x - Spawn position on the X axis.
   * @param {number} y - Spawn position on the Y axis.
   */
  constructor(x, y) {
    super().loadImage("assets/img/8_coin/coin_1.png");
    this.loadImages(this.images_Idle);
    this.x = x;
    this.y = y;
    IntervalHub.startInterval(this.animate, 1000 / 5);
  }

  animate = () => {
    this.playAnimation(this.images_Idle);
  };
}
