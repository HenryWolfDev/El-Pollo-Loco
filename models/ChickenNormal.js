import { MoveabelObject } from "./MoveableObject.js";

export class ChickenNormal extends MoveabelObject {
  constructor() {
    super().loadImage(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
  }

  moveLeft() {}
}
