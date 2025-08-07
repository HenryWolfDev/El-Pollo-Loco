export class Level {
  enemies;
  clouds;
  backgroundLayers;
  level_end_x = 2100;

  constructor(enemies, clouds, backgroundLayers) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
  }
}
