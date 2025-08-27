import { World } from "../models/World.js";

function init() {
  const canvas = document.getElementById("canvas");
  const world = new World(canvas);

  console.log(world.character);
}

init();
