import { Player } from "./Player.js";
import { Chicken } from "./Chicken.js";
import { Cloud } from "./Cloud.js";
import { BackgroundObject } from "./Background-Object.js";

export class World {
  player = new Player();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  backgroundObjects = [
    new BackgroundObject("../img/5_background/layers/air.png", 0),
    new BackgroundObject("../img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/1_first_layer/1.png", 0),
  ];

  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.addObjectsToWorld(this.backgroundObjects);
    this.addObjectsToWorld(this.clouds);
    this.addToWorld(this.player);
    this.addObjectsToWorld(this.enemies);

    requestAnimationFrame(() => this.draw());
  }

  // #region Add-Objects-To-World
  addObjectsToWorld(objects) {
    objects.forEach((object) => {
      this.addToWorld(object);
    });
  }

  addToWorld(moveableObject) {
    this.ctx.drawImage(
      moveableObject.image,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
  }
  // #endregion Add-Objects-To-World
}
