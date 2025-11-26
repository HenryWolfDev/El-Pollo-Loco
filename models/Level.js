import { ChickenNormal } from "./ChickenNormal.js";
import { ChickenSmall } from "./ChickenSmall.js";
import { Enbboss } from "./Endboss.js";
import { Cloud } from "./Cloud.js";
import { Coin } from "./Coin.js";
import { Bottle } from "./Bottle.js";
import { imageLoader } from "../game/imageLoader.js";

/**
 * Static factory/registry for level content (enemies, collectibles, backgrounds).
 * Keeps creation logic centralized so starting a new game stays lightweight.
 */
export class Level {
  static level_end_x = 3600;
  // Lazily create entities on game start to avoid background activity before clicking Start
  static createEnemies() {
    return [
      new ChickenNormal(),
      new ChickenSmall(),
      new ChickenSmall(),
      new ChickenNormal(),
      new ChickenSmall(),
      new ChickenNormal(),
      new ChickenNormal(),
      new ChickenSmall(),
      new Enbboss(),
    ];
  }

  static createClouds() {
    return [
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
    ];
  }

  static createCoins() {
    return [
      new Coin(1000, 150),
      new Coin(2600, 150),
      new Coin(3600, 330),
      new Coin(3650, 230),
      new Coin(3700, 330),
    ];
  }

  static createBottles() {
    return [
      new Bottle(400),
      new Bottle(1600),
      new Bottle(2900),
      new Bottle(3400),
    ];
  }

  static bgLayers1 = imageLoader.BACKGROUND_Layer1;
  static bgLayers2 = imageLoader.BACKGROUND_Layer2;
}
