import { Character } from "../models/Character.js";
import { BackgroundObject } from "./BackgroundObject.js";
import { Level } from "./Level.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { StatusbarHealth } from "./StatusbarHealth.js";
import { StatusbarCoins } from "./StatusbarCoins.js";
import { StatusbarBottles } from "./StatusbarBottle.js";
import { ThrowableObject } from "./ThrowableObject.js";

export class World {
  enemys = Level.enemies;
  clouds = Level.clouds;
  bgLayers1 = Level.bgLayers1;
  bgLayers2 = Level.bgLayers2;
  coins = Level.Coins;
  backgroundObjects = [];
  throwableObjects = [];

  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBarHealth = new StatusbarHealth();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.generateBackgroundLayers();
    this.character = new Character(this);
    this.statusbarCoins = new StatusbarCoins();
    this.statusbarBottles = new StatusbarBottles();
    this.draw();

    IntervalHub.startInterval(this.run, 200);
  }

  run = () => {
    this.checkCollisions();
    this.checkThrowableObjects();
  };

  removeEnemy(index) {
    setTimeout(() => {
      this.enemys.splice(index, 1);
    }, 500);
  }

  checkCollisions() {
    this.enemys.forEach((enemy, index) => {
      if (
        this.character.isColliding(enemy) &&
        this.character.isAboveGround() &&
        this.character.isFalling()
      ) {
        enemy.energy = 0;
        this.character.jump();
        this.removeEnemy(index);
      } else if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  checkThrowableObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 50
      );
      this.throwableObjects.push(bottle);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemys);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.coins);

    // Status Bars
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusbarCoins);
    this.addToMap(this.statusbarBottles);
    this.ctx.translate(this.camera_x, 0);

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
