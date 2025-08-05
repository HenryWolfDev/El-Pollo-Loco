import { Player } from "./Player.js";
import { Chicken } from "./Chicken.js";
import { Cloud } from "./Cloud.js";

export class World {
  player = new Player();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];

  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.drawImage(
      this.player.image,
      this.player.x,
      this.player.y,
      this.player.height,
      this.player.width
    );
    this.enemies.forEach((enemy) => {
      this.ctx.drawImage(
        enemy.image,
        enemy.x,
        enemy.y,
        enemy.height,
        enemy.width
      );
    });
    this.clouds.forEach((cloud) => {
      this.ctx.drawImage(
        cloud.image,
        cloud.x,
        cloud.y,
        cloud.height,
        cloud.width
      );
    });
    requestAnimationFrame(() => this.draw());
  }
}
