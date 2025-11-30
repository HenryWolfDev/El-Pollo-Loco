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

const OVERLAY_VISIBLE_CLASS = "is-visible";
// Small delay before showing end screens to allow death animations to play.
const OVERLAY_SHOW_DELAY = 1800;

/**
 * Represents the full game world: player, enemies, background, HUD, and logic.
 * Owns the canvas context, camera, and input state.
 */
export class World {
  backgroundLayers = [];
  bgLayer1 = Level.bgLayers1;
  bgLayer2 = Level.bgLayers2;
  clouds = [];
  enemys = [];
  coins = [];
  bottles = [];
  throwableBottles = [];

  canThrow = true;

  bossEventTriggered = false;
  gameOverShown = false;
  winningShown = false;
  gameOverTimer = null;
  winningTimer = null;

  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBarHealth = new StatusbarHealth();
  animationFrameId = null;
  isDestroyed = false;

  // #region Lifecycle & Setup
  /**
   * Sets up rendering, spawns entities/status bars, and starts world loops.
   * @param {HTMLCanvasElement} canvas - Canvas for rendering.
   * @param {object} keyboard - Shared keyboard/touch state.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.generateBackgroundLayers();
    // Create level entities now (after Start clicked)
    this.clouds = Level.createClouds();
    this.enemys = Level.createEnemies();
    this.coins = Level.createCoins();
    this.bottles = Level.createBottles();
    this.character = new Character(this);
    this.statusbarCoins = new StatusbarCoins();
    this.statusbarBottles = new StatusbarBottles();
    this.statusBarBossHealth = null;
    this.statusbarBottles.setPercentage(this.character.bottleCount);
    AudioHub.playOne(AudioHub.Background);
    this.draw();

    IntervalHub.startInterval(this.run, 1000 / 60);
  }

  /**
   * Stops all running loops and audio to cleanly tear down the world.
   */
  destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    IntervalHub.stopAllIntervals();
    AudioHub.stopAll();
    if (this.gameOverTimer) {
      clearTimeout(this.gameOverTimer);
      this.gameOverTimer = null;
    }
    if (this.winningTimer) {
      clearTimeout(this.winningTimer);
      this.winningTimer = null;
    }
  }
  // #endregion Lifecycle & Setup

  // #region Game Loop & Screens
  /**
   * Initializes the endboss event once (HUD + alert audio).
   */
  startBossEvent() {
    if (this.bossEventTriggered) return;
    this.bossEventTriggered = true;
    if (!this.statusBarBossHealth) {
      this.statusBarBossHealth = new StatusbarBossHealth();
    }
    AudioHub.playOne(AudioHub.Chicken_Voice);
  }

  /**
   * Main tick: boss logic, collisions, pickups, and win/lose checks.
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
    if (!this.shouldShowGameOver()) return;
    this.gameOverShown = true;
    this.stopAllAudioAndIntervals();
    AudioHub.playOne(AudioHub.Character_Dead);
    this.showOverlayWithDelay("gameover-screen");
  }

  showWinningScreen() {
    if (!this.shouldShowWinning()) return;
    this.winningShown = true;
    this.stopAllAudioAndIntervals();
    AudioHub.playOne(AudioHub.Winning);
    this.showOverlayWithDelay("winning-screen");
  }
  // #endregion Screens

  // #region Screen helpers
  shouldShowGameOver() {
    if (this.gameOverShown || !this.character.isdead()) return false;
    if (
      typeof this.character.hasFinishedDeathAnimation === "function" &&
      !this.character.hasFinishedDeathAnimation()
    ) {
      return false; // wait until character death animation completes
    }
    return true;
  }

  shouldShowWinning() {
    if (this.winningShown) return false;
    const boss = this.enemys.find((enemy) => enemy instanceof Enbboss);
    if (!boss || !boss.isdead()) return false;
    if (
      typeof boss.hasFinishedDeathAnimation === "function" &&
      !boss.hasFinishedDeathAnimation()
    ) {
      return false; // wait until death animation finished
    }
    return true;
  }

  stopAllAudioAndIntervals() {
    IntervalHub.stopAllIntervals();
    AudioHub.stopAll();
  }

  showOverlayWithDelay(id) {
    const overlay = document.getElementById(id);
    const timer = setTimeout(() => {
      if (this.isDestroyed) return;
      if (overlay) overlay.classList.add(OVERLAY_VISIBLE_CLASS);
    }, OVERLAY_SHOW_DELAY);

    if (id === "gameover-screen") {
      this.gameOverTimer = timer;
    } else if (id === "winning-screen") {
      this.winningTimer = timer;
    }
  }
  // #endregion Screen helpers
  // #endregion Game Loop & Screens

  /**
   * Collects coins the character touches and updates the coin status bar.
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
   * Collects bottles on touch and updates the bottle status bar.
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
   * Triggers the boss event on reaching the zone and drives boss movement/attacks.
   */
  endbossEventHandling() {
    if (this.character.x >= 3300 && !this.bossEventTriggered) {
      this.startBossEvent();
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
   * Starts a melee attack animation when the boss is close enough to the player.
   * @param {Enbboss} enemy - Endboss instance.
   */
  triggerBossAttackEvent(enemy) {
    if (this.character.x > enemy.x - 200) {
      enemy.speedX = 3.2;
      enemy.playAttackAnimation();
    } else {
      enemy.speedX = 3;
    }
  }

  // #endregion Boss Event & Attacks

  // #region Collisions (Character vs Enemies, Bottles)

  /**
   * Runs all collision checks (ground hits, jump kills, bottle hits).
   */
  checkCollisions() {
    this.checkBottomAttack();
    this.checkJumpAttack();
    this.checkBottleAttack();
  }

  /**
   * Handles stomp damage when the player lands on enemies while falling.
   */
  checkJumpAttack() {
    this.enemys.forEach((enemy) => {
      if (
        this.character.isFalling() &&
        this.character.isAboveGround() &&
        this.character.isColliding(enemy)
      ) {
        enemy.hit(100);
        this.character.jump();
        this.removeEnemy(enemy);
      }
    });
  }

  /**
   * Applies damage when the player collides with enemies on the ground and nudges back.
   */
  checkBottomAttack() {
    this.enemys.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !this.character.isAboveGround() &&
        !this.character.isHurt()
      ) {
        if (enemy instanceof Enbboss) {
          this.character.hit(15);
        } else {
          this.character.hit(5);
        }
        AudioHub.playOne(AudioHub.Character_Damage);
        this.character.x -= 15;
        this.checkCharacterXPosition();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Prevents the character from moving left past x=0.
   */
  checkCharacterXPosition() {
    if (this.character.x <= 0) {
      this.character.x = 0;
    }
  }

  /**
   * Checks thrown bottles against enemies and handles splash/removal.
   */
  checkBottleAttack() {
    this.throwableBottles.forEach((bottle, bIndex) => {
      if (bottle.hasDamaged) {
        return;
      }
      const hitEnemy = this.enemys.find((enemy) => bottle.isColliding(enemy));
      if (hitEnemy) {
        this.handleBottleEnemyHit(bottle, bIndex, hitEnemy);
        return;
      }
      if (!bottle.isAboveGround()) {
        this.removeBottle(bIndex);
      }
    });
  }

  handleBottleEnemyHit(bottle, bottleIndex, enemy) {
    bottle.hasDamaged = true;
    bottle.playSplashAnimation();
    this.removeBottle(bottleIndex);

    enemy instanceof Enbboss ? this.handleBossBottleHit(enemy) : enemy.hit(100);

    if (enemy.isdead()) {
      this.removeEnemy(enemy);
    }
  }

  handleBossBottleHit(enemy) {
    this.startBossEvent();
    enemy.hit(25);
    if (!enemy.isdead()) {
      AudioHub.playOne(AudioHub.Chicken_Dead);
    }
    if (this.statusBarBossHealth) {
      this.statusBarBossHealth.setPercentage(enemy.energy);
    }
  }

  /** Removes a bottle after a short delay to allow the splash animation to play. */
  removeBottle(bIndex) {
    setTimeout(() => {
      this.throwableBottles.splice(bIndex, 1);
    }, 300);
  }

  /** Removes an enemy after a short delay so its final state can render. */
  removeEnemy(enemy) {
    if (enemy instanceof Enbboss) return;
    setTimeout(() => {
      const idx = this.enemys.indexOf(enemy);
      if (idx !== -1) {
        this.enemys.splice(idx, 1);
      }
    }, 200);
  }
  // #endregion Collisions (Character vs Enemies, Bottles)

  // #region Throwables
  /**
   * Creates a throwable bottle on input, decreases inventory, and rate-limits throws.
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
  // #endregion Throwables

  // #region Rendering
  /**
   * Renders the full scene for the current frame and schedules the next frame.
   */
  draw() {
    if (this.isDestroyed) return;
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
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  // #endregion Rendering

  // #region Render Helpers (addObjectsToMap & addToMap)

  /**
   * Adds a list of drawable objects to the canvas.
   * @param {object[]} objects - Items to draw.
   */
  addObjectsToMap(objects) {
    objects.forEach((ob) => {
      this.addToMap(ob);
    });
  }

  /**
   * Draws a single object with optional mirroring for facing direction.
   * @param {object} mo - Object to render.
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
   * Mirrors an object horizontally.
   * @param {object} mo - Object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores coordinates after mirroring.
   * @param {object} mo - Object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
  // #endregion Render Helpers (addObjectsToMap & addToMap)

  // #region Background Creation

  /**
   * Generates all background layers, alternating two tile sets across the level length.
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
  // #endregion Background Creation
}
