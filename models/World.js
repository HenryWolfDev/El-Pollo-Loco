import { Player } from "./Player.js";
import { Chicken } from "./Chicken.js";
import { Cloud } from "./Cloud.js";
import { BackgroundObject } from "./Background-Object.js";

export class World {
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
    this.keys = [];
    this.player = new Player(this);
    console.log("Player methods:", this.player);

    this.setupInput();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.player.movement();

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
    // changed direction for object left and right
    if (moveableObject.otherDirection) {
      this.ctx.save();
      this.ctx.translate(moveableObject.width, 0);
      this.ctx.scale(-1, 1);
      moveableObject.x = moveableObject.x * -1;
    }
    this.ctx.drawImage(
      moveableObject.image,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
    // reseted changed direction
    if (moveableObject.otherDirection) {
      moveableObject.x = moveableObject.x * -1;
      this.ctx.restore();
    }
  }
  // #endregion Add-Objects-To-World

  // #region INPUT-LISTENER
  setupInput() {
    window.addEventListener("keydown", (e) => {
      if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);

      console.log(this.keys);
    });
    window.addEventListener("keyup", (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
      console.log(this.keys);
    });
  }
  // #endregion INPUT-LISTENER
}
