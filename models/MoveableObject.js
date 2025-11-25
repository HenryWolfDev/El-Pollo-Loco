import { DrawableObject } from "./DrawableObject.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { Character } from "./Character.js";

/**
 * Basisklasse für bewegliche Objekte in der Spielwelt.
 * Erweitert {@link DrawableObject} um Eigenschaften wie Bewegung, Schwerkraft,
 * Kollisionserkennung und Energieverwaltung.
 *
 * @class
 * @extends DrawableObject
 *
 * @property {number} speedX - Horizontale Bewegungsgeschwindigkeit.
 * @property {number} speedY - Vertikale Bewegungsgeschwindigkeit (positiv = nach oben).
 * @property {number} acceleration - Beschleunigung für die Gravitation.
 * @property {number} energy - Lebensenergie des Objekts (0 = tot).
 * @property {number} lastHit - Zeitstempel des letzten Treffers (ms seit Unix-Epoch).
 * @property {boolean} otherDirection - Gibt an, ob das Objekt nach links schaut (für Spiegelung).
 * @property {boolean} debugFrame - Wenn true, wird ein grüner Rahmen um das Objekt gezeichnet.
 * @property {boolean} isWalking  - Gibt an, ob ein Gegner aktuell läuft.
 */
export class MoveabelObject extends DrawableObject {
  speedX = 2.5;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  otherDirection = false;
  debugFrame = false;
  isWalking = false;

  // #region action methods

  /**
   * Verringert die Energie des Objekts um den angegebenen Schaden.
   * Setzt {@link MoveabelObject#lastHit} auf den aktuellen Zeitpunkt.
   *
   * @param {number} damage - Schadenshöhe.
   * @returns {void}
   */
  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Prüft, ob das Objekt kürzlich getroffen wurde.
   * Wird als "verwundet" betrachtet, wenn der letzte Treffer < 0.5 Sekunden zurückliegt.
   *
   * @returns {boolean} true, wenn Objekt verwundet ist.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Prüft, ob das Objekt keine Energie mehr hat.
   *
   * @returns {boolean} true, wenn das Objekt tot ist.
   */
  isdead() {
    return this.energy == 0;
  }
  // #endregion action methods

  // #region Moving

  /**
   * Bewegt das Objekt nach links, solange es nicht tot ist.
   * Aktiviert zusätzlich die Walking-Animation für Endboss.
   *
   * @returns {void}
   */
  moveLeft() {
    if (!this.isdead()) {
      this.isWalking = true;
      this.x -= this.speedX;
    }
  }

  /**
   * Bewegt Character nach rechts, solange es nicht tot ist.
   *
   * @returns {void}
   */
  moveRight() {
    if (!this.isdead()) {
      this.x += this.speedX;
    }
  }

  // #endregion Moving

  /**
   * Prüft, ob dieses Objekt mit einem anderen kollidiert.
   *
   * @param {DrawableObject} mo - Das andere zu prüfende Objekt.
   * @returns {boolean} true, wenn die Objekte kollidieren.
   */
  isColliding(mo) {
    return (
      this.x < mo.x + mo.width &&
      this.x + this.width > mo.x &&
      this.y < mo.y + mo.height &&
      this.y + this.height > mo.y
    );
  }

  // #region drawing frames

  /**
   * Zeichnet ein Rechteck um das Objekt (Debugging der Hitbox).
   *
   * @param {CanvasRenderingContext2D} ctx - Der Canvas-Rendering-Kontext.
   * @returns {void}
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
  // #endregion drawing frames

  /**
   * Wendet Schwerkraft auf das Objekt an.
   * Lässt das Objekt fallen oder steigen, abhängig von {@link MoveabelObject#speedY}.
   * Für den {@link Character} wird die Bodenhöhe bei y=230 begrenzt.
   *
   * @returns {void}
   */
  applyGravity() {
    IntervalHub.startInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this instanceof Character) {
          if (this.y >= 180) {
            this.y = 130;
          }
        }
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    return this.y < 130;
  }

  isFalling() {
    return this.speedY < 0;
  }

  // #region loading images

  /**
   * Spielt eine Frame-Animation basierend auf einem Array von Bildpfaden ab.
   *
   * @param {string[]} images - Array mit Bildpfaden für die Animation.
   * @returns {void}
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  // #endregion loading images
}
