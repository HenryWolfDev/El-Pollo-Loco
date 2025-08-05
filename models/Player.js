import { MoveableObject } from "./MoveableObject.js";

export class Player extends MoveableObject {
  width = 150;
  height = 300;
  constructor() {
    super().loadImage("../img/2_character_pepe/1_idle/idle/I-1.png");
  }
  jump() {}
}
