import { Character } from "../models/Character.js";
import { ChickenNormal } from "../models/ChickenNormal.js";
import { Cloud } from "./Cloud.js";
import { BackgroundObject } from "./BackgroundObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { Level } from "./Level.js";

export class World {
  enemies = Level.enemies;
  clouds = Level.clouds;
  bgLayers1 = Level.bgLayers1;
  bgLayers2 = Level.bgLayers2;
  backgroundObjects = [];

  canvas;
  ctx;
  keyboard;
  camera_x = -100;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.generateBackgroundLayers();
    this.character = new Character(this);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);

    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  // #region addObjectsToMap & addToMap method
  addObjectsToMap(objects) {
    objects.forEach((ob) => {
      this.addToMap(ob);
    });
  }
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
  // #endregion addObjectsToMap & addToMap method

  // #region Background creation
  generateBackgroundLayers() {
    this.generateBackgroundLayerTwo(-720);
    let count = 6;
    for (let i = 0; i < count; i++) {
      let position = i * 720;
      if (i % 2 === 0) {
        this.generateBackgroundLayerOne(position);
      } else {
        this.generateBackgroundLayerTwo(position);
      }
    }
  }

  generateBackgroundLayerOne(position) {
    for (let i = 0; i < this.bgLayers1.length; i++) {
      this.backgroundObjects.push(
        new BackgroundObject(this.bgLayers1[i], position)
      );
    }
  }
  generateBackgroundLayerTwo(position) {
    for (let i = 0; i < this.bgLayers2.length; i++) {
      this.backgroundObjects.push(
        new BackgroundObject(this.bgLayers2[i], position)
      );
    }
  }
  // #endregion Background creation
}
