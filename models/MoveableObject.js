export class MoveabelObject {
  x = 500;
  y = 230;
  img;
  width = 100;
  height = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {}
  moveLeft() {}
}
