import { Level } from "../models/Level.js";
import { Chicken } from "../models/Chicken.js";
import { Cloud } from "../models/Cloud.js";
import { imageLoader } from "../js/imageLoader.js";
import { Endboss } from "../models/EndBoss.js";

const backgroundLayers1 = [
  imageLoader.BACKGROUND.air,
  imageLoader.BACKGROUND.layer3_1,
  imageLoader.BACKGROUND.layer2_1,
  imageLoader.BACKGROUND.layer1_1,
];

const backgroundLayers2 = [
  imageLoader.BACKGROUND.air,
  imageLoader.BACKGROUND.layer3_2,
  imageLoader.BACKGROUND.layer2_2,
  imageLoader.BACKGROUND.layer1_2,
];

export const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new Endboss()],

  [(new Cloud(), new Cloud())],

  [backgroundLayers1, backgroundLayers2]
);
