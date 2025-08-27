import { MoveabelObject } from "./MoveableObject.js";

export class BackgroundObject extends MoveabelObject {
  width = 720;
  height = 480;
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
