import { DrawableObject } from "./DrawabelObject.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class MoveabelObject extends DrawableObject {
  speedX = 0.15;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  otherDirection = false;
  debugFrame = true;

  // #region action methods
  hit() {
    this.energy -= 10;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  isdead() {
    return this.energy == 0;
  }
  // #endregion action methods

  // #region Moving
  moveLeft() {
    if (!this.isdead()) {
      this.x -= this.speedX;
    }
  }

  moveRight() {
    this.x += this.speedX;
  }

  // #endregion Moving

  isColliding(mo) {
    return (
      this.x < mo.x + mo.width &&
      this.x + this.width > mo.x &&
      this.y < mo.y + mo.height &&
      this.y + this.height > mo.y
    );
  }

  // #region drawing frames

  drawFrame(ctx) {
    if (this.debugFrame) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "lime";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
  // #endregion drawing frames

  applyGravity() {
    // speedY > 0 - moving up
    IntervalHub.startInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        console.log(this.isFalling());
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 230;
  }

  isFalling() {
    return this.speedY < 0;
  }

  // #region loading images

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  // #endregion loading images
}
