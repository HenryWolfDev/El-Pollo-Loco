export class MoveableObject {
  x = 10;
  y = 140;
  width = 150;
  height = 100;
  image;

  loadImage(path) {
    this.image = new Image();
    this.image.src = path;
  }

  moveRight() {}

  moveLeft() {}
}
