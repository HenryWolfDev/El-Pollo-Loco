import { DrawableObject } from "./DrawabelObject.js";

export class MoveabelObject extends DrawableObject {
  speedX = 0.15;
  speedY = 0;
  energy = 100;
  lastHit = 0;
  otherDirection = false;
  debugFrame = true;

  // #region action methods
  hit() {
    this.energy -= 5;
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
    this.x -= this.speedX;
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

  // #region loading images

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  // #endregion loading images
}
