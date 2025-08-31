import { Character } from "../models/Character.js";
import { BackgroundObject } from "./BackgroundObject.js";
import { Level } from "./Level.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { StatusbarHealth } from "./StatusbarHealth.js";
import { StatusbarCoins } from "./StatusbarCoins.js";
import { StatusbarBottles } from "./StatusbarBottle.js";
import { ThrowableObject } from "./ThrowableObject.js";
import { AudioHub } from "../game/AudioHub.js";
import { StatusbarBossHealth } from "./StatusbarBossHealth.js";

/**
 * Repräsentiert die Spielwelt, inklusive Spielfigur, Hintergrund, Gegnern, Statusanzeigen und Logik.
 */
export class World {
  backgroundLayers = [];
  bgLayer1 = Level.bgLayers1;
  bgLayer2 = Level.bgLayers2;
  clouds = Level.clouds;
  enemys = Level.enemies;
  coins = Level.Coins;
  bottles = Level.Bottle;
  throwableBottles = [];

  canThrow = true;

  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBarHealth = new StatusbarHealth();

  /**
   * Erstellt eine neue Spielwelt.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element für das Rendering
   * @param {object} keyboard - Die Tastatureingaben
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.generateBackgroundLayers();
    this.character = new Character(this);
    this.statusbarCoins = new StatusbarCoins();
    this.statusbarBottles = new StatusbarBottles();
    this.statusBarBossHealth = new StatusbarBossHealth();
    this.statusbarBottles.setPercentage(this.character.bottleCount);
    this.draw();

    IntervalHub.startInterval(this.run, 200);
  }

  run = () => {
    this.checkCollisions();
    this.checkThrowableObjects();
    this.checkCoinsPickup();
    this.checkBottlePickup();
  };

  checkCoinsPickup() {
    this.coins.filter((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.coinsCount++;
        AudioHub.playOne(AudioHub.Collect_Sound);
        this.statusbarCoins.setPercentage(this.character.coinsCount);
        this.coins.splice(index, 1);
      }
    });
  }

  checkBottlePickup() {
    this.bottles.filter((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.bottleCount++;
        AudioHub.playOne(AudioHub.Collect_Sound);
        this.statusbarBottles.setPercentage(this.character.bottleCount);
        this.bottles.splice(index, 1);
      }
    });
  }

  // #region Collision methods
  checkCollisions() {
    this.checkJumpAttack();
    this.checkBottleAttack();
  }

  checkJumpAttack() {
    this.enemys.forEach((enemy, index) => {
      if (
        this.character.isAboveGround() &&
        this.character.isFalling() &&
        this.character.isColliding(enemy)
      ) {
        enemy.energy = 0;
        this.character.jump();
        this.removeEnemy(index);
      } else if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.character.x -= 20;
        this.character.checkXPosition();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }
  // #region Bottle Attack handling
  checkBottleAttack() {
    this.throwableBottles.forEach((bottle, bIndex) => {
      this.enemys.forEach((enemy, eIndex) => {
        if (bottle.isColliding(enemy)) {
          this.setBottleAttackNormalEnemys(bottle, enemy, bIndex, eIndex);
        }
      });
    });
  }

  setBottleAttackNormalEnemys(bottle, enemy, bIndex, eIndex) {
    bottle.playSplashAnimation();
    this.removeBottle(bIndex);
    enemy.energy = 0;
    this.removeEnemy(eIndex);
  }
  // #endregion Bottle Attack handling
  removeBottle(bIndex) {
    setTimeout(() => {
      this.throwableBottles.splice(bIndex, 1);
    }, 300);
  }
  removeEnemy(index) {
    setTimeout(() => {
      this.enemys.splice(index, 1);
    }, 500);
  }
  // #endregion Collision methods

  checkThrowableObjects() {
    if (this.keyboard.D && this.character.bottleCount > 0 && this.canThrow) {
      this.canThrow = false;
      this.character.updateAction();
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 50,
        this
      );
      this.throwableBottles.push(bottle);
      this.character.bottleCount--;
      this.statusbarBottles.setPercentage(this.character.bottleCount);
    }

    if (!this.keyboard.D) {
      this.canThrow = true;
    }
  }

  /**
   * Zeichnet die gesamte Spielwelt pro Frame.
   * Bewegt Kamera, rendert Objekte und HUD.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundLayers);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemys);
    this.addObjectsToMap(this.throwableBottles);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.bottles);

    // Status Bars
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusbarCoins);
    this.addToMap(this.statusbarBottles);
    this.addToMap(this.statusBarBossHealth);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  // #region addObjectsToMap & addToMap method

  /**
   * Fügt eine Liste von Objekten der Zeichenfläche hinzu.
   * @param {object[]} objects - Liste der zu zeichnenden Objekte
   */
  addObjectsToMap(objects) {
    objects.forEach((ob) => {
      this.addToMap(ob);
    });
  }

  /**
   * Zeichnet ein einzelnes Objekt auf das Canvas.
   * Berücksichtigt Richtung (Spiegelung).
   * @param {object} mo - Das darzustellende Objekt
   */
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

  /**
   * Spiegelt ein Objekt horizontal.
   * @param {object} mo - Das Objekt, das gespiegelt werden soll
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Setzt die Spiegelung des Objekts zurück.
   * @param {object} mo - Das Objekt, das zurückgesetzt werden soll
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
  // #endregion addObjectsToMap & addToMap method

  // #region Background creation

  /**
   * Generiert alle Hintergrundebenen im Level.
   * Nutzt zwei verschiedene Layer, abwechselnd angeordnet.
   */
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
    for (let i = 0; i < this.bgLayer1.length; i++) {
      this.backgroundLayers.push(
        new BackgroundObject(this.bgLayer1[i], position)
      );
    }
  }
  generateBackgroundLayerTwo(position) {
    for (let i = 0; i < this.bgLayer2.length; i++) {
      this.backgroundLayers.push(
        new BackgroundObject(this.bgLayer2[i], position)
      );
    }
  }
  // #endregion Background creation
}
