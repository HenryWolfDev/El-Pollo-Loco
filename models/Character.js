import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { Level } from "./Level.js";

export class Character extends MoveabelObject {
  x = 0;
  y = 230;
  width = 150;
  height = 200;
  speedX = 20;
  speedY = 0;

  jumpAnim = false;
  isWalking = false;

  images_Idle = imageLoader.PLAYER.idle;
  images_Walking = imageLoader.PLAYER.walk;
  images_Jumping = imageLoader.PLAYER.jump;
  images_Dead = imageLoader.PLAYER.dead;
  images_Hurt = imageLoader.PLAYER.hurt;
  images_Sleep = imageLoader.PLAYER.long_idle;

  constructor(world) {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadingImages();
    this.lastAction = Date.now();
    this.applyGravity();
    IntervalHub.startInterval(this.animate, 1000 / 10);
  }

  loadingImages() {
    this.loadImages(this.images_Idle);
    this.loadImages(this.images_Walking);
    this.loadImages(this.images_Jumping);
    this.loadImages(this.images_Dead);
    this.loadImages(this.images_Hurt);
    this.loadImages(this.images_Sleep);
  }

  animate = () => {
    this.moveLeftAndRight();
    this.jumpStart();
    this.CharacterAnimations();
    this.resetJumpFlagIfOnGround();
  };

  // #region movement
  moveLeftAndRight() {
    if (this.world.keyboard.RIGHT && this.x < Level.level_end_x) {
      this.moveRight();
      this.updateAction();
      this.otherDirection = false;
      this.isWalking = true;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.updateAction();
      this.otherDirection = true;
      this.isWalking = true;
    }
    this.updateCamera();
  }

  jumpStart() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.updateAction();
      this.jumpAnim = true;
      this.currentImage = 0;
    }
  }

  jump() {
    this.speedY = 30;
  }

  // #endregion movement

  // #region Character Animations
  CharacterAnimations() {
    if (this.charIsSleeping()) {
      this.playAnimation(this.images_Sleep);
      return;
    }
    if (this.isWalking && !this.isHurt()) {
      this.playAnimation(this.images_Walking);
      this.isWalking = false;
    } else if (this.isdead()) {
      this.playAnimation(this.images_Dead);
      this.isWalking = false;
    } else if (this.isHurt()) {
      this.x -= 15;
      this.updateAction();
      this.checkXPosition();
      this.playAnimation(this.images_Hurt);
      this.isWalking = true;
    } else if (this.charIsJumpingOrInAir()) {
      this.isWalking = false;
      this.playAnimation(this.images_Jumping);
    } else if (!this.isHurt() && !this.isWalking) {
      this.playAnimation(this.images_Idle);
      this.isWalking = false;
    }
  }

  checkXPosition() {
    if (this.x <= 0) {
      this.x = 0;
    }
  }
  charIsJumpingOrInAir() {
    return this.jumpAnim || this.isAboveGround();
  }

  charIsNotMoving() {
    return this.waitingTime > this.timeToWait;
  }

  charIsSleeping() {
    //  / 1000 = time in seconds
    let timeSinceLastAction = (Date.now() - this.lastAction) / 1000;
    return timeSinceLastAction > 5;
  }
  updateAction() {
    this.lastAction = Date.now();
  }

  resetJumpFlagIfOnGround() {
    if (!this.isAboveGround() && this.jumpAnim) {
      this.jumpAnim = false;
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }
}
