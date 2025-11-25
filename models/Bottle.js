/**
 * Collectible salsa bottle that extends MoveableObject with fixed size/position.
 * Randomly chooses a left/right ground sprite on creation.
 * @module models/Bottle
 */
import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";

export class Bottle extends MoveabelObject {
  y = 330;
  width = 100;
  height = 100;

  images_bottles = imageLoader.SALSABOTTLE;

  constructor(x) {
    super().loadImage(
      Math.random() < 0.5
        ? this.images_bottles.salsaBottleLeft
        : this.images_bottles.salsaBottleRight
    );
    this.x = x;
  }
}
