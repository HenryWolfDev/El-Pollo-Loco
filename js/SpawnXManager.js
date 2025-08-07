export class SpawnXManager {
  static spawnX = 500;

  static getNextSpawnX() {
    const currentX = this.spawnX;
    this.spawnX += Math.random() * 10 + 100;
    return currentX;
  }
}
