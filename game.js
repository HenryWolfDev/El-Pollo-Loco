import { World } from "./models/World.js";

function initGame() {
  window.addEventListener("load", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 480;

    const world = new World(canvas);
    console.log(world.player);
  });
}

initGame();
