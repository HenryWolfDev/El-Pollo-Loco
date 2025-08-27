import { World } from "../models/World.js";

let world = new World();

function init() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  console.log(world.character);
}

init();
