import { Player } from "./Player.js";
import { BackgroundObject } from "./Background-Object.js";
import { level1 } from "../level/level1.js";

export class World {
  level = level1;
  backgroundLayers = [];
  canvas;
  ctx;
  camera_x = 0;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keys = [];
    this.player = new Player(this);

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
    this.addObjectsToWorld(this.level.clouds);
    this.drawWithDirection(this.player);
    this.addObjectsToWorld(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
  }

  // #region Add-Objects-To-World
  addObjectsToWorld(objects) {
    objects.forEach((object) => {
      this.drawWithDirection(object);
    });
  }

  drawWithDirection(moveObject) {
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

  // #region Background-Layer
  generateBackgroundLayers(repeatCount = 10) {
    const [paths1, paths2] = level1.backgroundLayers;
    const imageWidth = 719;
    this.backgroundLayers = [];

    for (let i = 0; i < repeatCount; i++) {
      const x = i * imageWidth;
      const paths = i % 2 === 0 ? paths1 : paths2;

      paths.forEach((path) =>
        this.backgroundLayers.push(new BackgroundObject(path, x))
      );
    }
  }
  // #endregion Background-Layer

  updateCamera() {
    const offset = 90;
    this.camera_x = -this.player.x + offset;

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
