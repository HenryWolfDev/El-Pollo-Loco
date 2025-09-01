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
import { Enbboss } from "./Endboss.js";

/**
 * Repräsentiert die komplette Spielwelt (Spielfigur, Gegner, Hintergrund, HUD und Spiellogik).
 *
 * @class
 * @property {BackgroundObject[]} backgroundLayers - Alle aktuell gerenderten Hintergrund-Objekte (parallax).
 * @property {string[]} bgLayer1 - Bildpfade der ersten Hintergrund-Layer-Konfiguration aus dem Level.
 * @property {string[]} bgLayer2 - Bildpfade der zweiten Hintergrund-Layer-Konfiguration aus dem Level.
 * @property {Object[]} clouds - Wolken-Objekte aus dem Level (werden gezeichnet).
 * @property {(Object|Enbboss)[]} enemys - Gegnerliste des Levels (inkl. Endboss).
 * @property {Object[]} coins - Münz-Objekte im Level.
 * @property {Object[]} bottles - Flaschen-Objekte im Level (Pickup).
 * @property {ThrowableObject[]} throwableBottles - Aktive, geworfene Flaschen.
 * @property {boolean} canThrow - Ob der Spieler aktuell eine Flasche werfen darf (Wurf-Rate-Limiter).
 * @property {boolean} bossEventTriggered - Ob das Endboss-Ereignis bereits gestartet wurde.
 * @property {HTMLCanvasElement} canvas - Referenz auf das Canvas.
 * @property {CanvasRenderingContext2D} ctx - 2D-Rendering-Kontext des Canvas.
 * @property {object} keyboard - Zustände der Steuerungstasten.
 * @property {number} camera_x - Aktuelle X-Position der Kamera (negativ = nach links versetzt).
 * @property {StatusbarHealth} statusBarHealth - HUD-Anzeige der Spielerenergie.
 * @property {StatusbarCoins} statusbarCoins - HUD-Anzeige der gesammelten Münzen.
 * @property {StatusbarBottles} statusbarBottles - HUD-Anzeige der verfügbaren Flaschen.
 * @property {StatusbarBossHealth|null} statusBarBossHealth - HUD-Anzeige der Boss-Energie (nur bei Bosskampf).
 * @property {Character} character - Die Spielfigur.
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

  bossEventTriggered = false;

  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBarHealth = new StatusbarHealth();

  /**
   * Erstellt eine neue Spielwelt und initialisiert Rendering, Spielfigur und HUD.
   *
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element für das Rendering.
   * @param {object} keyboard - Objekt mit Tastatureingaben/-zuständen.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.generateBackgroundLayers();
    this.character = new Character(this);
    this.statusbarCoins = new StatusbarCoins();
    this.statusbarBottles = new StatusbarBottles();
    this.statusBarBossHealth = null;
    this.statusbarBottles.setPercentage(this.character.bottleCount);
    AudioHub.playOne(AudioHub.Background);
    this.draw();

    // Hauptspielschleife (Logik)
    IntervalHub.startInterval(this.run, 100);
  }

  /**
   * Zyklische Spiellogik: Event-Handling, Kollisionen und Pickups prüfen.
   * Wird periodisch von der Spielschleife aufgerufen.
   *
   * @returns {void}
   */
  run = () => {
    this.endbossEventHandling();
    this.checkCollisions();
    this.checkThrowableObjects();
    this.checkCoinsPickup();
    this.checkBottlePickup();
    this.showGameOverScreen();
    this.showWinningScreen();
  };

  // #region Screens
  showGameOverScreen() {
    if (this.character.isdead()) {
      IntervalHub.stopAllIntervals();
      AudioHub.stopAll();
      AudioHub.playOne(AudioHub.Character_Dead);
      document.getElementById("gameover-screen").style.display = "flex";

      const restartBtn = document.getElementById("restart-btn");
      restartBtn.addEventListener("click", () => {
        location.reload();
      });
    }
  }

  showWinningScreen() {
    this.enemys.forEach((enemy) => {
      if (enemy instanceof Enbboss) {
        if (enemy.isdead()) {
          IntervalHub.stopAllIntervals();
          AudioHub.stopAll();
          AudioHub.playOne(AudioHub.Winning);
          document.getElementById("winning-screen").style.display = "flex";
          const restartBtn = document.getElementById("restart-btn-winning");
          restartBtn.addEventListener("click", () => {
            location.reload();
          });
        }
      }
    });
  }
  // #endregion Screens

  /**
   * Prüft, ob der Spieler eine Münze berührt, sammelt sie ein
   * und aktualisiert den Münz-Statusbalken.
   *
   * @returns {void}
   */
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

  // #region Pickups

  /**
   * Prüft Flaschen-Pickups des Spielers und aktualisiert den Flaschen-Statusbalken.
   *
   * @returns {void}
   */
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

  // #endregion Pickups

  // #region Boss Event & Attacks

  /**
   * Startet das Endboss-Event, sobald der Spieler die Trigger-Position erreicht,
   * bewegt den Boss und prüft Boss-Angriffe.
   *
   * @returns {void}
   */
  endbossEventHandling() {
    if (this.character.x >= 3500) {
      this.bossEventTriggered = true;
      this.statusBarBossHealth = new StatusbarBossHealth();
      AudioHub.playOne(AudioHub.Chicken_Voice);
    }
    if (this.bossEventTriggered) {
      this.enemys.forEach((enemy) => {
        if (enemy instanceof Enbboss) {
          enemy.moveLeft();
          this.triggerBossAttackEvent(enemy);
        }
      });
    }
  }

  /**
   * Prüft, ob der Boss nah genug ist, um eine Nahkampfangriff-Animation auszulösen.
   *
   * @param {Enbboss} enemy - Referenz auf den Endboss.
   * @returns {void}
   */
  triggerBossAttackEvent(enemy) {
    if (this.character.x > enemy.x - 200) {
      enemy.speedX = 17;
      enemy.playAttackAnimation();
    } else {
      enemy.speedX = 15;
    }
  }

  // #endregion Boss Event & Attacks

  // #region Collisions (Character vs Enemies, Bottles)

  /**
   * Führt alle Kollisionsprüfungen aus (Boden, Sprung, Flasche).
   *
   * @returns {void}
   */
  checkCollisions() {
    this.checkBottomAttack();
    this.checkJumpAttack();
    this.checkBottleAttack();
  }

  /**
   * Sprung-Angriff: Wenn der Spieler im Fallen auf einen Gegner trifft,
   * nimmt der Gegner Schaden und wird ggf. entfernt.
   *
   * @returns {void}
   */
  checkJumpAttack() {
    this.enemys.forEach((enemy, index) => {
      if (
        this.character.isFalling() &&
        this.character.isAboveGround() &&
        this.character.isColliding(enemy)
      ) {
        enemy.hit(100);
        this.character.jump();
        this.removeEnemy(index);
      }
    });
  }

  /**
   * Boden-Kontakt mit Gegnern: Spieler erleidet Schaden je nach Gegnertyp,
   * Position wird leicht zurückgesetzt, HUD aktualisiert.
   *
   * @returns {void}
   */
  checkBottomAttack() {
    this.enemys.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !this.character.isAboveGround()
      ) {
        if (enemy instanceof Enbboss) {
          this.character.hit(15);
        } else {
          this.character.hit(5);
        }
        AudioHub.playOne(AudioHub.Character_Damage);
        this.character.x -= 35;
        this.checkCharacterXPosition();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Verhindert, dass der Charakter über den linken Rand hinaus bewegt wird.
   */
  checkCharacterXPosition() {
    if (this.character.x <= 0) {
      this.x = 0;
    }
  }

  /**
   * Prüft Kollisionen zwischen geworfenen Flaschen und Gegnern,
   * spielt ggf. Splash-Animation, verteilt Schaden und entfernt getroffene Objekte.
   *
   * @returns {void}
   */
  checkBottleAttack() {
    this.throwableBottles.forEach((bottle, bIndex) => {
      if (bottle.hasDamaged) return;
      this.enemys.forEach((enemy, eIndex) => {
        if (bottle.isColliding(enemy)) {
          bottle.hasDamaged = true;
          bottle.playSplashAnimation();
          this.removeBottle(bIndex);
          if (enemy instanceof Enbboss) {
            enemy.hit(25);
            if (!enemy.isdead()) {
              AudioHub.playOne(AudioHub.Chicken_Dead);
            }
            this.statusBarBossHealth.setPercentage(enemy.energy);
          } else {
            enemy.hit(100);
          }
          if (enemy.isdead()) {
            this.removeEnemy(eIndex);
          }
        } else if (!bottle.isAboveGround()) {
          this.removeBottle(bIndex);
        }
      });
    });
  }

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
  // #endregion Collisions (Character vs Enemies, Bottles)

  /**
   * Handhabt das Werfen von Flaschen: erstellt bei Tastendruck ein {@link ThrowableObject},
   * reduziert den Flaschenvorrat und aktualisiert den HUD-Balken.
   *
   * @returns {void}
   */
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
   * Zeichnet die komplette Spielwelt für den aktuellen Frame
   * (Kamera-Offset, World-Objekte, HUD) und plant den nächsten Frame.
   *
   * @returns {void}
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
    if (this.statusBarBossHealth) {
      this.addToMap(this.statusBarBossHealth);
    }

    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  // #region Render Helpers (addObjectsToMap & addToMap)

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
  // #endregion Render Helpers (addObjectsToMap & addToMap)

  // #region Background Creation

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
  // #region Background Creation
}
