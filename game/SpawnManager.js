export class SpawnManager {
  static spawnX = 100;
  static spwanYClouds = 20 - Math.random() * 15;
  static spwanXClouds = 100;

  static getNextSpawnX() {
    const currentX = this.spawnX;
    this.spawnX += Math.random() * 120 + 250;
    return currentX;
  }

  static getNextSpawnXForClouds() {
    const currentX = this.spwanXClouds;
    this.spwanXClouds += Math.random() * 220 + 550;
    return currentX;
  }

  static getNextSpawnYForClouds() {
    const currentY = this.spwanYClouds;
    this.spwanYClouds += Math.random() * 1 + 5;
    return currentY;
  }
}
