import { Character } from "../models/Character.js";
import { ChickenNormal } from "../models/ChickenNormal.js";

export class World {
  character = new Character();
  enemies = [new ChickenNormal(), new ChickenNormal(), new ChickenNormal()];

  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    );
    this.enemies.forEach((enemie) => {
      this.ctx.drawImage(
        enemie.img,
        enemie.x,
        enemie.y,
        enemie.width,
        enemie.height
      );
    });
    requestAnimationFrame(() => this.draw());
  }
}
