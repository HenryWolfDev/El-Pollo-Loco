import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";
export class Enbboss extends MoveabelObject {
  width = 350;
  height = 350;
  y = 95;
  speedX = 5;

  endbossAttacking = false;

  images_ALERT = imageLoader.ENEMIE_BOSS_CHICKEN.alert;
  images_Hurt = imageLoader.ENEMIE_BOSS_CHICKEN.hurt;
  images_Dead = imageLoader.ENEMIE_BOSS_CHICKEN.dead;
  images_Walk = imageLoader.ENEMIE_BOSS_CHICKEN.walk;
  images_Attack = imageLoader.ENEMIE_BOSS_CHICKEN.attack;

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
    if (!this.isWalking) {
      this.playAnimation(this.images_ALERT);
    } else if (this.isHurt()) {
      this.playAnimation(this.images_Hurt);
    } else if (this.isWalking) {
      this.playAnimation(this.images_Walk);
    }
  }

  playAttackAnimation() {
    if (this.endbossAttacking) return;
    IntervalHub.startInterval(
      this.playAnimation(this.images_Attack),
      1000 / 10
    );
  }
}
