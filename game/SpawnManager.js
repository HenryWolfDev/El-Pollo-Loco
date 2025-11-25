/**
 * Utility for generating varied spawn coordinates for enemies and clouds.
 * Holds mutable state to space spawns apart and supports resetting between games.
 * @module game/SpawnManager
 */
export class SpawnManager {
  static spawnX = 100;
  static spwanYClouds = 20 - Math.random() * 15;
  static spwanXClouds = 300;

  /** Resets spawn positions to their initial offsets. */
  static reset() {
    SpawnManager.spawnX = 100;
    SpawnManager.spwanYClouds = 20 - Math.random() * 15;
    SpawnManager.spwanXClouds = 300;
  }

  /**
   * Returns the next X coordinate for ground spawns and increments spacing randomly.
   * @returns {number} spawn x-position.
   */
  static getNextSpawnX() {
    const currentX = this.spawnX;
    this.spawnX += Math.random() * 120 + 250;
    return currentX;
  }

  /**
   * Returns the next X coordinate for clouds with randomized spacing.
   * @returns {number} cloud spawn x-position.
   */
  static getNextSpawnXForClouds() {
    const currentX = this.spwanXClouds;
    this.spwanXClouds += Math.random() * 220 + 550;
    return currentX;
  }

  /**
   * Returns the next Y coordinate for clouds with gentle vertical drift.
   * @returns {number} cloud spawn y-position.
   */
  static getNextSpawnYForClouds() {
    const currentY = this.spwanYClouds;
    this.spwanYClouds += Math.random() * 1 + 5;
    return currentY;
  }
}
