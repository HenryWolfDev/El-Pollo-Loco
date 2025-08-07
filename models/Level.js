export class Level {
  enemies;
  clouds;
  backgroundLayers;

  constructor(enemies, clouds, backgroundLayers) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
  }
}
