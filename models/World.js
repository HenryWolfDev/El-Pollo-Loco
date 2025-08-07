import { Player } from "./Player.js";
import { Chicken } from "./Chicken.js";
import { Cloud } from "./Cloud.js";
import { BackgroundObject } from "./Background-Object.js";

export class World {
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud(), new Cloud()];
  backgroundLayers = [];

  canvas;
  ctx;
  camera_x = 0;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keys = [];
    this.player = new Player(this);
    console.log("Player methods:", this.player);

    this.generateBackgroundLayers();

    this.setupInput();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.player.movement();
    this.updateCamera();
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToWorld(this.backgroundLayers);
    this.addObjectsToWorld(this.clouds);
    this.addToWorld(this.player);
    this.addObjectsToWorld(this.enemies);

    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
  }

  // #region Add-Objects-To-World
  addObjectsToWorld(objects) {
    objects.forEach((object) => {
      this.addToWorld(object);
    });
  }

  addToWorld(moveObject) {
    // changed direction for object left and right
    if (moveObject.otherDirection) {
      this.ctx.save();
      this.ctx.translate(moveObject.width, 0);
      this.ctx.scale(-1, 1);
      moveObject.x = moveObject.x * -1;
    }
    this.ctx.drawImage(
      moveObject.image,
      moveObject.x,
      moveObject.y,
      moveObject.width,
      moveObject.height
    );
    // reseted changed direction
    if (moveObject.otherDirection) {
      moveObject.x = moveObject.x * -1;
      this.ctx.restore();
    }
  }
  // #endregion Add-Objects-To-World

  generateBackgroundLayers(repeatCount = 10) {
    const backgroundImagePaths1 = [
      "../img/5_background/layers/air.png",
      "../img/5_background/layers/3_third_layer/1.png",
      "../img/5_background/layers/2_second_layer/1.png",
      "../img/5_background/layers/1_first_layer/1.png",
    ];

    const backgroundImagePaths2 = [
      "../img/5_background/layers/air.png",
      "../img/5_background/layers/3_third_layer/2.png",
      "../img/5_background/layers/2_second_layer/2.png",
      "../img/5_background/layers/1_first_layer/2.png",
    ];

    const imageWidth = 719;
    this.backgroundLayers = [];

    for (let i = 0; i < repeatCount; i++) {
      const x = i * imageWidth;
      const paths = i % 2 === 0 ? backgroundImagePaths1 : backgroundImagePaths2;

      for (let path of paths) {
        this.backgroundLayers.push(new BackgroundObject(path, x));
      }
    }
  }

  updateCamera() {
    const offset = 90;
    this.camera_x = -this.player.x + offset;

    // Begrenzung: Nicht über linken Rand hinaus
    this.camera_x = Math.min(this.camera_x, 0);
  }

  // #region INPUT-LISTENER
  setupInput() {
    window.addEventListener("keydown", (e) => {
      if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);

      console.log(this.keys);
    });
    window.addEventListener("keyup", (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
      console.log(this.keys);
    });
  }
  // #endregion INPUT-LISTENER
}
