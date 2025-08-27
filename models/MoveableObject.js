export class MoveabelObject {
  x = 130;
  y = 20;
  img;
  width = 150;
  height = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {}
  moveLeft() {}
}
