import { MoveabelObject } from "./MoveableObject.js";

export class Character extends MoveabelObject {
  x = 0;
  y = 230;
  width = 150;
  height = 200;
  constructor() {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
  }

  jump() {}
}
