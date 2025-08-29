import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class Coin extends MoveabelObject {
  x = 400;
  y = 330;
  width = 100;
  height = 100;

  images_Idle = imageLoader.Coins;
  constructor(x) {
    super().loadImage("../assets/img/8_coin/coin_1.png");
    this.loadImages(this.images_Idle);
    this.x = x;
    IntervalHub.startInterval(this.animate, 1000 / 5);
  }

  animate = () => {
    this.playAnimation(this.images_Idle);
  };
}
