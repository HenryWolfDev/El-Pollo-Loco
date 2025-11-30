import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

/**
 * Final boss chicken with multiple animation states (alert, walk, attack, hurt, dead).
 */
export class Enbboss extends MoveabelObject {
  width = 350;
  height = 350;
  x = 3800;
  y = 95;
  speedX = 0.7;

  endbossAttacking = false;
  _deadPlayed = false;
  _deadLoopCounter = 0;
  _deadFrameTime = 0;

  images_ALERT = imageLoader.ENEMIE_BOSS_CHICKEN.alert;
  images_Hurt = imageLoader.ENEMIE_BOSS_CHICKEN.hurt;
  images_Dead = imageLoader.ENEMIE_BOSS_CHICKEN.dead;
  images_Walk = imageLoader.ENEMIE_BOSS_CHICKEN.walk;
  images_Attack = imageLoader.ENEMIE_BOSS_CHICKEN.attack;

  // Animation timing control
  _lastAnimTime = 0;

  /**
   * Preloads animations and starts the boss animation loop.
   */
  constructor() {
    super().loadImage("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadingImages();
    IntervalHub.startInterval(this.animate, 1000 / 30);
  }

  /**
   * Preloads all boss animation sets.
   */
  loadingImages() {
    this.loadImages(this.images_Walk);
    this.loadImages(this.images_ALERT);
    this.loadImages(this.images_Hurt);
    this.loadImages(this.images_Dead);
    this.loadImages(this.images_Attack);
  }

  animate = () => {
    this.BossAnimations();
  };

  /**
   * Chooses the correct animation based on boss state (attack, alert, hurt, walk).
   */
  BossAnimations() {
    if (this.isdead()) {
      this.animateDeadLooping();
    } else if (this.endbossAttacking) {
      this.playAnimationThrottled(this.images_Attack, 100); // ~10 fps
    } else if (!this.isWalking) {
      this.playAnimationThrottled(this.images_ALERT, 150); // ~6-7 fps
    } else if (this.isHurt()) {
      this.playAnimationThrottled(this.images_Hurt, 83); // ~12 fps
    } else if (this.isWalking) {
      this.playAnimationThrottled(this.images_Walk, 100); // ~10 fps
    }
  }

  /**
   * Plays the death animation in a loop; marks when at least one full cycle completed.
   */
  animateDeadLooping() {
    const frames = this.images_Dead;
    const now = Date.now();
    if (now - this._deadFrameTime < 125) return;

    const index = this._deadLoopCounter % frames.length;
    this.img = this.imageCache[frames[index]];

    this._deadLoopCounter++;
    this._deadFrameTime = now;

    if (!this._deadPlayed && this._deadLoopCounter >= frames.length) {
      this._deadPlayed = true;
    }
  }

  /**
   * Returns true once the full death animation has been displayed.
   * @returns {boolean}
   */
  hasFinishedDeathAnimation() {
    return this._deadPlayed;
  }

  /**
   * Triggers a short attack animation sequence.
   */
  playAttackAnimation() {
    if (this.endbossAttacking) return;
    this.endbossAttacking = true;
    setTimeout(() => {
      this.endbossAttacking = false;
    }, 600);
  }

  // Advance animation frames at a capped rate
  playAnimationThrottled(images, intervalMs) {
    const now = Date.now();
    if (now - this._lastAnimTime >= intervalMs) {
      super.playAnimation(images);
      this._lastAnimTime = now;
    }
  }
}
