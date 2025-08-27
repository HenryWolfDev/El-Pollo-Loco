import { MoveabelObject } from "./MoveableObject.js";

export class Character extends MoveabelObject {
  constructor() {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
  }

  jump() {}
}
