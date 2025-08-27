import { Character } from "../models/Character.js";
import { ChickenNormal } from "../models/ChickenNormal.js";
import { Cloud } from "./Cloud.js";
import { BackgroundObject } from "./BackgroundObject.js";
import { imageLoader } from "../game/imageLoader.js";

export class World {
  enemies = [new ChickenNormal(), new ChickenNormal(), new ChickenNormal()];
  clouds = [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];

  bgLayers1 = imageLoader.BACKGROUND_Layer1;
  bgLayers2 = imageLoader.BACKGROUND_Layer2;
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
  addObjectsToMap(objects) {
    objects.forEach((ob) => {
      this.addToMap(ob);
    });
  }
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  generateBackgroundLayers() {
    let count = 8;
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
}
