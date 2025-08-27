import { Character } from "../models/Character.js";
import { ChickenNormal } from "../models/ChickenNormal.js";

export class World {
  character = new Character();
  enemies = [new ChickenNormal(), new ChickenNormal(), new ChickenNormal()];

  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    );
  }
}
