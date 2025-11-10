import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";
export class Enbboss extends MoveabelObject {
  width = 350;
  height = 350;
  y = 95;
  // Base patrol speed (~42 px/s at 60 Hz)
  speedX = 0.7;

  endbossAttacking = false;

  images_ALERT = imageLoader.ENEMIE_BOSS_CHICKEN.alert;
  images_Hurt = imageLoader.ENEMIE_BOSS_CHICKEN.hurt;
  images_Dead = imageLoader.ENEMIE_BOSS_CHICKEN.dead;
  images_Walk = imageLoader.ENEMIE_BOSS_CHICKEN.walk;
  images_Attack = imageLoader.ENEMIE_BOSS_CHICKEN.attack;

  // Animation timing control
  _lastAnimTime = 0;

  constructor() {
    super().loadImage("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.x = 3800;
    this.loadingImages();
    IntervalHub.startInterval(this.animate, 1000 / 30);
  }

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

  BossAnimations() {
    if (this.endbossAttacking) {
      this.playAnimationThrottled(this.images_Attack, 100); // ~10 fps
    } else if (!this.isWalking) {
      this.playAnimationThrottled(this.images_ALERT, 150); // ~6-7 fps
    } else if (this.isHurt()) {
      this.playAnimationThrottled(this.images_Hurt, 83); // ~12 fps
    } else if (this.isWalking) {
      this.playAnimationThrottled(this.images_Walk, 100); // ~10 fps
    }
  }

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
