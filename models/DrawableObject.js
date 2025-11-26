/**
 * Base class for anything drawable on the canvas (sprites, HUD elements).
 * Provides image loading, basic drawing helpers, and a debug frame.
 */
export class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 500;
  y = 280;
  width = 100;
  height = 100;

  /**
   * Loads a single image into `img` for rendering.
   * @param {string} path - Image source path.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads multiple images into the cache for animations.
   * @param {string[]} arr - List of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current image onto the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Helper to draw centered text relative to the object position.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string|number} text
   * @param {number} [offsetX=0]
   * @param {number} [offsetY=0]
   */
  drawText(ctx, text, offsetX = 0, offsetY = 0) {
    ctx.font = "14px Rye";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text), this.x + offsetX, this.y + offsetY);
  }

  /**
   * Renders a debug rectangle around the object when `debugFrame` is true.
   * @param {CanvasRenderingContext2D} ctx
   */
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
