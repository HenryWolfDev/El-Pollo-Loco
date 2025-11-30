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
  height = 400;
  speedX = 7;
  speedY = 2.5;
  rX = 0;
  rY = 0;
  rW = 0;
  rH = 0;
  offset = {
    top: 150,
    right: 100,
    bottom: 40,
    left: 85,
  };

  jumpAnim = false;
  isWalking = false;
  s;

  bottleCount = 3;
  coinsCount = 0;

  // Animation timing control
  _lastAnimTime = 0;
  // Sleep snoring state
  _isSnoring = false;
  // Death animation state
  _deadPlayed = false;

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

  // #region Main Loop & Movement
  /** Per-frame tick: movement, jump triggers, animation selection, reset flags. */
  animate = () => {
    this.moveLeftAndRight();
    this.jumpStart();
    this.CharacterAnimations();
    this.resetJumpFlagIfOnGround();
  };

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
  // #endregion Main Loop & Movement

  // #region Animation Dispatcher
  /** Processes the current animation based on state. */
  CharacterAnimations() {
    if (this.handleDead()) return;
    if (this.handleHurt()) return;
    if (this.handleAirborne()) return;
    if (this.handleWalking()) return;
    if (this.handleSleeping()) return;

    this.animateIdle();
  }

  /**
   * Runs once the character is dead; plays death anim and signals handled.
   * @returns {boolean} true when a dead animation was chosen.
   */
  handleDead() {
    if (!this.isdead()) return false;
    this.animateDeadLooping();
    return true;
  }

  /**
   * Runs hurt animation when recently damaged.
   * @returns {boolean} true when a hurt animation was chosen.
   */
  handleHurt() {
    if (!this.isHurt()) return false;
    this.animateHurt();
    return true;
  }

  /**
   * Runs jump/air animation while airborne.
   * @returns {boolean} true when an air animation was chosen.
   */
  handleAirborne() {
    if (!this.charIsJumpingOrInAir()) return false;
    this.animateAirborne();
    return true;
  }

  /**
   * Runs walking animation when moving horizontally.
   * @returns {boolean} true when a walk animation was chosen.
   */
  handleWalking() {
    if (!this.isWalking) return false;
    this.animateWalking();
    return true;
  }

  /**
   * Runs sleep animation after idle timeout.
   * @returns {boolean} true when a sleep animation was chosen.
   */
  handleSleeping() {
    if (!this.charIsSleeping()) return false;
    this.animateSleeping();
    return true;
  }
  // #endregion Animation Dispatcher

  // #region Animation Runners
  animateDead() {
    this.playAnimationThrottled(this.images_Dead, 125); // ~8 fps
    this.isWalking = false;
    this.stopSnoringIfActive();
  }

  animateHurt() {
    this.updateAction();
    this.playAnimationThrottled(this.images_Hurt, 83); // ~12 fps
    this.stopSnoringIfActive();
  }

  animateAirborne() {
    this.isWalking = false;
    this.playAnimationThrottled(this.images_Jumping, 83); // ~12 fps
    this.stopSnoringIfActive();
  }

  animateWalking() {
    this.playAnimationThrottled(this.images_Walking, 100); // ~10 fps
    this.isWalking = false;
    this.stopSnoringIfActive();
  }

  animateSleeping() {
    this.playAnimationThrottled(this.images_Sleep, 200); // ~5 fps
    this.startSnoringIfNeeded();
  }

  animateIdle() {
    this.playAnimationThrottled(this.images_Idle, 150); // ~6-7 fps
    this.stopSnoringIfActive();
  }

  /**
   * Plays the death animation in a loop; marks when at least one full cycle completed.
   */
  animateDeadLooping() {
    const frames = this.images_Dead;
    this.isWalking = false;
    this.stopSnoringIfActive();
    this.playAnimationThrottled(frames, 125); // ~8 fps

    if (!this._deadPlayed) {
      const lastIndex = frames.length - 1;
      if (this.currentImage % frames.length === lastIndex) {
        this._deadPlayed = true;
      }
    }
  }
  // #endregion Animation Runners

  // #region State Checks & Timers
  /**
   * Returns true once the full death animation has been displayed.
   * @returns {boolean}
   */
  hasFinishedDeathAnimation() {
    return this._deadPlayed;
  }

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
  // #endregion State Checks & Timers

  // #region Position & Collision Helpers
  /** Resets the jump flag when the character is back on the ground. */
  resetJumpFlagIfOnGround() {
    if (!this.isAboveGround() && this.jumpAnim) {
      this.jumpAnim = false;
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  getCollisionBox() {
    this.getRealFrame();
    return { x: this.rX, y: this.rY, width: this.rW, height: this.rH };
  }
  // #endregion Position & Collision Helpers

  // #region Animation Helpers
  /** Advance animation frames at a capped rate independent of the 60 Hz update. */
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
  // #endregion Animation Helpers
}
