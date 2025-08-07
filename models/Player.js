import { MoveableObject } from "./MoveableObject.js";
import { imageLoader } from "../js/imageLoader.js";
import { IntervalHub } from "../js/IntervalHub.js";

export class Player extends MoveableObject {
  width = 150;
  height = 300;
  idle = [];
  walk = [];
  jump = [];

  // JUMP PROPTERTIES
  isJumping = false;
  jumpSpeed = 15;
  gravity = 1;
  velocity = 0;

  speed = 2;

  constructor(world) {
    super().loadImage("../img/2_character_pepe/1_idle/idle/I-1.png");
    this.world = world;

    this.loadIDLE();
    this.loadWALK();
    this.loadJump();

    IntervalHub.startInterval(this.run, 1000 / 60);
    this.idleAnimation();
  }

  // #region LOAD-IMAGES
  loadIDLE() {
    this.idle = imageLoader.PLAYER.idle.map((path) => {
      const img = new Image();
      img.src = path;
      return img;
    });
  }

  loadWALK() {
    imageLoader.PLAYER.walk.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.walk.push(img);
    });
  }

  loadJump() {
    imageLoader.PLAYER.jump.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.jump.push(img);
    });
  }
  // #endregion LOAD-IMAGES

  run = () => {
    this.movement();
    // draw
  };

  idleAnimation() {
    let i = 0;
    let idleTick = 0;
    const idleDelay = 3.5;

    IntervalHub.startInterval(() => {
      const keys = this.world.keys;
      const walking = keys.includes("ArrowLeft") || keys.includes("ArrowRight");
      const frames = walking ? this.walk : this.idle;

      if (frames.length > 0) {
        if (walking) {
          this.image = frames[i % frames.length];
          i++;
        } else {
          idleTick++;
          if (idleTick >= idleDelay) {
            this.image = frames[i % frames.length];
            i++;
            idleTick = 0;
          }
        }
      }
    }, 1000 / 20);
  }

  movement() {
    const keys = this.world.keys;

    if (keys.includes("ArrowLeft")) {
      this.x -= this.speed;
      this.otherDirection = true;
    }
    if (keys.includes("ArrowRight")) {
      this.x += this.speed;
      this.otherDirection = false;
    }

    if (keys.includes("ArrowUp")) {
      this.y -= this.jumpSpeed;
    }
  }

  jump() {}
}
