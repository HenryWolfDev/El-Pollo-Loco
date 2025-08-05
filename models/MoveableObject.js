export class MoveableObject {
  x = 10;
  y = 250;
  height = 100;
  width = 150;
  image;

  loadImage(path) {
    this.image = new Image();
    this.image.src = path;
  }

  moveRight() {}

  moveLeft() {}
}
