export class MoveabelObject {
  x = 500;
  y = 280;
  img;
  width = 100;
  height = 100;

  imageCache = {};
  currentImage = 0;

  speedX = 0.15;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft() {
    this.x -= this.speedX;
  }
}
