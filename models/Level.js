import { ChickenNormal } from "./ChickenNormal.js";
import { Enbboss } from "./Endboss.js";
import { Cloud } from "./Cloud.js";
import { Coin } from "./Coin.js";
import { Bottle } from "./Bottle.js";
import { imageLoader } from "../game/imageLoader.js";

export class Level {
  static level_end_x = 3600;
  static enemies = [
    new ChickenNormal(),
    new ChickenNormal(),
    new ChickenNormal(),
    new Enbboss(),
  ];
  static clouds = [
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
  ];
  static Coins = [new Coin(400, 250), new Coin(1000, 150)];

  static Bottle = [new Bottle(400)];

  static bgLayers1 = imageLoader.BACKGROUND_Layer1;
  static bgLayers2 = imageLoader.BACKGROUND_Layer2;
}
