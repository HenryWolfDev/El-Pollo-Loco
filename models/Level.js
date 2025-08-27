import { ChickenNormal } from "./ChickenNormal.js";
import { Cloud } from "./Cloud.js";
import { imageLoader } from "../game/imageLoader.js";

export class Level {
  static level_end_x = 3600;
  static enemies = [
    new ChickenNormal(),
    new ChickenNormal(),
    new ChickenNormal(),
  ];
  static clouds = [
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
  ];

  static bgLayers1 = imageLoader.BACKGROUND_Layer1;
  static bgLayers2 = imageLoader.BACKGROUND_Layer2;
}
