import { Character } from "../models/Character.js";
import { ChickenNormal } from "../models/ChickenNormal.js";

export class World {
  character = new Character();
  enemies = [new ChickenNormal(), new ChickenNormal(), new ChickenNormal()];
  draw() {}
}
