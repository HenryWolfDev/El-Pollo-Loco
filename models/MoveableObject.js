import { DrawableObject } from "./DrawableObject.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { Character } from "./Character.js";

/**
 * Base class for movable game objects (character, enemies, projectiles).
 * Adds movement, gravity, collision checks, and health handling on top of DrawableObject.
 *
 * @class
 * @extends DrawableObject
 *
 * @property {number} speedX - Horizontal movement speed.
 * @property {number} speedY - Vertical movement speed (positive = upward).
 * @property {number} acceleration - Gravity acceleration.
 * @property {number} energy - Hit points of the object (0 = dead).
 * @property {number} lastHit - Timestamp of the last hit (ms since Unix epoch).
 * @property {boolean} otherDirection - True when facing left (used for mirroring).
 * @property {boolean} debugFrame - When true, draws a lime frame around the hitbox.
 * @property {boolean} isWalking  - Whether an enemy is currently walking.
 */
export class MoveabelObject extends DrawableObject {
  speedX = 2.5;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  otherDirection = false;
  debugFrame = false;
  isWalking = false;

  // #region action methods

  /**
   * Reduces energy by given damage and records the hit time.
   *
   * @param {number} damage - Amount of damage to apply.
   * @returns {void}
   */
  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Returns true if the object was hit within the last 0.5 seconds.
   *
   * @returns {boolean} true when recently hurt.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Returns true when the object has no health left.
   *
   * @returns {boolean} true when dead.
   */
  isdead() {
    return this.energy == 0;
  }
  // #endregion action methods

  // #region Moving

  /**
   * Moves the object left if alive; flags walking animation for enemies.
   *
   * @returns {void}
   */
  moveLeft() {
    if (!this.isdead()) {
      this.isWalking = true;
      this.x -= this.speedX;
    }
  }

  /**
   * Moves the character right if alive.
   *
   * @returns {void}
   */
  moveRight() {
    if (!this.isdead()) {
      this.x += this.speedX;
    }
  }

  // #endregion Moving

  /**
   * Checks for an AABB collision against another drawable object.
   *
   * @param {DrawableObject} mo - Other object to test against.
   * @returns {boolean} true when colliding.
   */
  isColliding(mo) {
    const a =
      typeof this.getCollisionBox === "function"
        ? this.getCollisionBox()
        : this.getHitbox();
    const b =
      typeof mo.getCollisionBox === "function"
        ? mo.getCollisionBox()
        : typeof mo.getHitbox === "function"
        ? mo.getHitbox()
        : { x: mo.x, y: mo.y, width: mo.width, height: mo.height };

    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // #region drawing frames

  /**
   * Draws the current hitbox as a rectangle for debugging.
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   * @returns {void}
   */
  drawFrame(ctx) {
    if (this.debugFrame) {
      const box =
        typeof this.getCollisionBox === "function"
          ? this.getCollisionBox()
          : this.getHitbox();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "lime";
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.stroke();
    }
  }
  // #endregion drawing frames

  /**
   * Applies gravity each tick: moves up/down based on speedY and clamps character ground height.
   *
   * @returns {void}
   */
  applyGravity() {
    IntervalHub.startInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this instanceof Character) {
          if (this.y >= 90) {
            this.y = 90;
          }
        }
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    return this.y < 90;
  }

  isFalling() {
    return this.speedY < 0;
  }

  // #region loading images

  /**
   * Plays a frame animation from a list of image paths.
   *
   * @param {string[]} images - Animation frame paths.
   * @returns {void}
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  // #endregion loading images

  /**
   * Returns the active hitbox for collisions/debug frames.
   * Subclasses can override to tighten/loosen bounds.
   * @returns {{x:number,y:number,width:number,height:number}}
   */
  getHitbox() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  getCollisionBox() {
    return this.getHitbox();
  }
}
