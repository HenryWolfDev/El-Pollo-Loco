import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";

export class ThrowableObject extends MoveabelObject {
  images_Rotation = imageLoader.SALSABOTTLE.bottleRotation;
  images_Splash = imageLoader.SALSABOTTLE.bottleSplash;

  usable = true;
  splashStart = false;

  bottomY = 350;

  constructor(x, y) {
    super();
    this.loadImage("../assets/img/6_salsa_bottle/salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 80;
    this.loadImages(this.images_Rotation);
    this.loadImages(this.images_Splash);
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    IntervalHub.startInterval(this.throwLoop, 1000 / 25);
  }

  throwLoop = () => {
    if (!this.usable) return; 
    if (this.isAboveGround()) {
      this.x += 10;
      this.playAnimation(this.images_Rotation);
    } else if (!this.isAboveGround()) {
      this.y = this.bottomY;
      this.speedY = 0;

      if (!this.splashStart) {
        this.playAnimation(this.images_Splash);
        this.splashStart = true;
      }
    }
  };

  isAboveGround() {
    return this.y < this.bottomY;
  }

  playSplashAnimation () {
    this.playAnimation(this.images_Splash);
    
  }
}
