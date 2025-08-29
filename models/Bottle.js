import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

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
