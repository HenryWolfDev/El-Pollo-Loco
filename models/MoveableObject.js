import { IntervalHub } from "../js/IntervalHub.js";
export class MoveableObject {
  x = 10;
  y = 140;
  width = 150;
  height = 100;
  speed = 0.25;
  otherDirection = false;
  image;
  imageCache = [];

  loadImage(path) {
    this.image = new Image();
    this.image.src = path;
  }

  loadImages(arr, onAllImagesLoaded) {
    let loaded = 0;
    this.imageCache = [];

    arr.forEach((path, index) => {
      const img = new Image();
      img.src = path;

      img.onload = () => {
        loaded++;
        if (loaded === arr.length && onAllImagesLoaded) {
          onAllImagesLoaded();
        }
      };

      this.imageCache[index] = img;
    });
  }

  moveRight() {}

  moveLeft() {
    IntervalHub.startInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
