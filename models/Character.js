import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { Level } from "./Level.js";
import { AudioHub } from "../game/AudioHub.js";

/**
 * Playable character controller handling movement, physics, animations, and interactions.
 * Extends MoveableObject and manages state (jumping, walking, sleeping) plus related audio.
 * @extends MoveabelObject
 */
export class Character extends MoveabelObject {
  x = 0;
  y = 230;
  width = 300;
  height = 300;
  speedX = 7;
  speedY = 2.5;

  jumpAnim = false;
  isWalking = false;
  s;

  bottleCount = 3;
  coinsCount = 0;

  // Animation timing control
  _lastAnimTime = 0;
  // Sleep snoring state
  _isSnoring = false;

  /** Preloaded animation frames for the character. */
  images_Idle = imageLoader.PLAYER.idle;
  images_Walking = imageLoader.PLAYER.walk;
  images_Jumping = imageLoader.PLAYER.jump;
  images_Dead = imageLoader.PLAYER.dead;
  images_Hurt = imageLoader.PLAYER.hurt;
  images_Sleep = imageLoader.PLAYER.long_idle;

  /**
   * Creates a new character instance.
   * @param {object} world - World instance the character belongs to.
   */
  constructor(world) {
    super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadingImages();
    this.lastAction = Date.now();
    this.applyGravity();
    IntervalHub.startInterval(this.animate, 1000 / 60);
  }

  /** Loads all animation frame sequences into memory. */
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

  /** Moves the character left/right based on keyboard input. */
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

  /**
   * Starts a jump when SPACE is pressed and the character is on the ground.
   */
  jumpStart() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.updateAction();
      this.jumpAnim = true;
      this.currentImage = 0;
    }
  }

  jump() {
    this.speedY = 28;
  }

  // #endregion movement

  // #region Character Animations
  /** Processes the current animation based on state. */
  CharacterAnimations() {
    if (this.isdead()) {
      this.playAnimationThrottled(this.images_Dead, 125); // ~8 fps
      this.isWalking = false;
      this.stopSnoringIfActive();
      return;
    }
    if (this.isHurt()) {
      this.updateAction();
      this.playAnimationThrottled(this.images_Hurt, 83); // ~12 fps
      this.stopSnoringIfActive();
      return;
    }
    if (this.charIsJumpingOrInAir()) {
      this.isWalking = false;
      this.playAnimationThrottled(this.images_Jumping, 83); // ~12 fps
      this.stopSnoringIfActive();
      return;
    }
    if (this.isWalking) {
      this.playAnimationThrottled(this.images_Walking, 100); // ~10 fps
      this.isWalking = false;
      this.stopSnoringIfActive();
      return;
    }
    if (this.charIsSleeping()) {
      this.playAnimationThrottled(this.images_Sleep, 200); // ~5 fps
      this.startSnoringIfNeeded();
      return;
    }

    this.playAnimationThrottled(this.images_Idle, 150); // ~6-7 fps
    this.stopSnoringIfActive();
  }

  // #endregion Character Animations

  /**
   * Checks whether the character is jumping or airborne.
   * @returns {boolean} true if jumping or in the air.
   */
  charIsJumpingOrInAir() {
    return this.jumpAnim || this.isAboveGround();
  }

  charIsNotMoving() {
    return this.waitingTime > this.timeToWait;
  }

  /**
   * Checks if the character is sleeping (after 5 seconds of inactivity).
   * @returns {boolean} true if the character is sleeping.
   */
  charIsSleeping() {
    let timeSinceLastAction = (Date.now() - this.lastAction) / 1000;
    return timeSinceLastAction > 5;
  }

  /** Updates the timestamp of the last action (e.g., movement). */
  updateAction() {
    this.lastAction = Date.now();
  }

  /** Resets the jump flag when the character is back on the ground. */
  resetJumpFlagIfOnGround() {
    if (!this.isAboveGround() && this.jumpAnim) {
      this.jumpAnim = false;
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  // Advance animation frames at a capped rate independent of the 60 Hz update
  playAnimationThrottled(images, intervalMs) {
    const now = Date.now();
    if (now - this._lastAnimTime >= intervalMs) {
      super.playAnimation(images);
      this._lastAnimTime = now;
    }
  }

  startSnoringIfNeeded() {
    if (!this._isSnoring) {
      AudioHub.Character_Snoring.sound.loop = true;
      AudioHub.playOne(AudioHub.Character_Snoring);
      this._isSnoring = true;
    }
  }

  stopSnoringIfActive() {
    if (this._isSnoring) {
      AudioHub.Character_Snoring.sound.loop = false;
      AudioHub.stopOne(AudioHub.Character_Snoring);
      this._isSnoring = false;
    }
  }
}
