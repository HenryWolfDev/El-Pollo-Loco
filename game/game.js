import { World } from "../models/World.js";
import { Keyboard } from "../models/Keyboard.js";

let keyboard = new Keyboard();

function init() {
  const canvas = document.getElementById("canvas");
  const world = new World(canvas, keyboard);

  console.log(world.character);
}

// #region Keyboard-Listener
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
  if (e.keyCode == 27) {
    keyboard.ESCAPE = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
  if (e.keyCode == 27) {
    keyboard.ESCAPE = false;
  }
});
// #endregion Keyboard-Listener

init();
