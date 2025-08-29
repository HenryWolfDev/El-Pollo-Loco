export class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 500;
  y = 280;
  width = 100;
  height = 100;

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawText(ctx, text, offsetX = 0, offsetY = 0) {
    ctx.font = "14px Rye";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text), this.x + offsetX, this.y + offsetY);
  }

  drawFrame(ctx) {
    if (this.debugFrame) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "lime";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}
