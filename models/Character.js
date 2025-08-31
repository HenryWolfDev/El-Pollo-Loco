import { MoveabelObject } from "./MoveableObject.js";
import { imageLoader } from "../game/imageLoader.js";
import { IntervalHub } from "../game/IntervalHub.js";
import { Level } from "./Level.js";
import { AudioHub } from "../game/AudioHub.js";

/**
 * Repräsentiert den spielbaren Charakter.
 * Erbt von MoveableObject und enthält Animationen, Bewegungen und Interaktionen.
 *
 * @extends MoveabelObject
 */
export class Character extends MoveabelObject {
  x = 0;
  y = 230;
  width = 150;
  height = 200;
  speedX = 20;
  speedY = 0;

  jumpAnim = false;
  isWalking = false;

  bottleCount = 10;
  coinsCount = 0;

  /**
   * Lädt alle benötigten Animationsbilder des Charakters.
   */
  images_Idle = imageLoader.PLAYER.idle;
  images_Walking = imageLoader.PLAYER.walk;
  images_Jumping = imageLoader.PLAYER.jump;
  images_Dead = imageLoader.PLAYER.dead;
  images_Hurt = imageLoader.PLAYER.hurt;
  images_Sleep = imageLoader.PLAYER.long_idle;

  /**
   * Erstellt eine neue Instanz des Characters.
   * @param {object} world - Das Spielfeld bzw. die Welt, in der sich der Charakter befindet.
   */
  constructor(world) {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadingImages();
    this.lastAction = Date.now();
    this.applyGravity();
    IntervalHub.startInterval(this.animate, 1000 / 10);
  }

  loadingImages() {
    this.loadImages(this.images_Idle);
    this.loadImages(this.images_Walking);
    this.loadImages(this.images_Jumping);
    this.loadImages(this.images_Dead);
    this.loadImages(this.images_Hurt);
    this.loadImages(this.images_Sleep);
  }

  animate = () => {
    this.moveLeftAndRight();
    this.jumpStart();
    this.CharacterAnimations();
    this.resetJumpFlagIfOnGround();
  };

  // #region movement

  /**
   * Bewegt den Charakter nach links oder rechts basierend auf Tasteneingaben.
   */
  moveLeftAndRight() {
    if (this.world.keyboard.RIGHT && this.x < Level.level_end_x) {
      this.moveRight();
      this.updateAction();
      this.otherDirection = false;
      this.isWalking = true;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.updateAction();
      this.otherDirection = true;
      this.isWalking = true;
    }
    this.updateCamera();
  }

  /**
   * Startet den Sprung, wenn SPACE gedrückt wird und der Charakter nicht bereits in der Luft ist.
   */
  jumpStart() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.updateAction();
      this.jumpAnim = true;
      this.currentImage = 0;
    }
  }

  jump() {
    this.speedY = 30;
  }

  // #endregion movement

  // #region Character Animations
  /**
   * Verarbeitet die aktuellen Animationen des Charakters abhängig vom Zustand.
   */
  CharacterAnimations() {
    if (this.charIsSleeping() && !this.isHurt()) {
      this.playAnimation(this.images_Sleep);
      AudioHub.playOne(AudioHub.Character_Snoring);
      return;
    }
    if (this.isWalking && !this.isHurt()) {
      this.playAnimation(this.images_Walking);
      this.isWalking = false;
    } else if (this.isdead()) {
      this.playAnimation(this.images_Dead);
      this.isWalking = false;
    } else if (this.isHurt()) {
      this.x -= 15;
      AudioHub.playOne(AudioHub.Character_Damage);
      this.updateAction();
      this.checkXPosition();
      this.playAnimation(this.images_Hurt);   
      this.isWalking = true;
    } else if (this.charIsJumpingOrInAir()) {
      this.isWalking = false;
      this.playAnimation(this.images_Jumping);
    } else if (!this.isHurt() && !this.isWalking) {
      this.playAnimation(this.images_Idle);
      this.isWalking = false;
    }
  }
  // #endregion Character Animations

  /**
   * Verhindert, dass der Charakter über den linken Rand hinaus bewegt wird.
   */
  checkXPosition() {
    if (this.x <= 0) {
      this.x = 0;
    }
  }

  /**
   * Überprüft, ob der Charakter springt oder sich in der Luft befindet.
   * @returns {boolean} true, wenn Charakter springt oder in der Luft ist
   */
  charIsJumpingOrInAir() {
    return this.jumpAnim || this.isAboveGround();
  }

  charIsNotMoving() {
    return this.waitingTime > this.timeToWait;
  }

  /**
   * Überprüft, ob der Charakter schläft (nach 5 Sekunden Inaktivität).
   * @returns {boolean} true, wenn der Charakter schläft
   */
  charIsSleeping() {
    let timeSinceLastAction = (Date.now() - this.lastAction) / 1000;
    return timeSinceLastAction > 5;
  }

  /**
   * Aktualisiert den Zeitstempel der letzten Aktion (z.B. Bewegung).
   */
  updateAction() {
    this.lastAction = Date.now();
  }

  /**
   * Setzt das Sprung-Flag zurück, wenn der Charakter wieder auf dem Boden ist.
   */
  resetJumpFlagIfOnGround() {
    if (!this.isAboveGround() && this.jumpAnim) {
      this.jumpAnim = false;
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }
}
