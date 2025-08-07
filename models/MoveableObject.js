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

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache.push(img);
    });
  }

  moveRight() {}

  // fix
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
