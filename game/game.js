import { World } from "../models/World.js";
import { Keyboard } from "../models/Keyboard.js";

let world;
let keyboard = new Keyboard();

function startGame() {
  const canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  document.getElementById("start-screen").style.display = "none";
  closeControlSettings();
}

window.addEventListener("load", () => {
  document.getElementById("start-button").addEventListener("click", startGame);
  document.getElementById("start-icon").addEventListener("click", startGame);
  document
    .getElementById("control-button")
    .addEventListener("click", showControlSettings);
  document
    .getElementById("settings-icon")
    .addEventListener("click", showControlSettings);

  // #region Mobile Controls
  document
    .getElementById("left-icon")
    .addEventListener("touchstart", () => (keyboard.LEFT = true));
  document
    .getElementById("left-icon")
    .addEventListener("touchend", () => (keyboard.LEFT = false));

  document
    .getElementById("right-icon")
    .addEventListener("touchstart", () => (keyboard.RIGHT = true));
  document
    .getElementById("right-icon")
    .addEventListener("touchend", () => (keyboard.RIGHT = false));

  document
    .getElementById("jump-icon")
    .addEventListener("touchstart", () => (keyboard.SPACE = true));
  document
    .getElementById("jump-icon")
    .addEventListener("touchend", () => (keyboard.SPACE = false));

  document
    .getElementById("throw-icon")
    .addEventListener("touchstart", () => (keyboard.D = true));
  document
    .getElementById("throw-icon")
    .addEventListener("touchend", () => (keyboard.D = false));
  // #endregion Mobile Controls
});

// #region Show-Control Settings
function showControlSettings() {
  document.getElementById("control-setting-screen").style.display = "flex";

  const restartBtn = document.getElementById("restart-btn-control");
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

function closeControlSettings() {
  const overlay = document.getElementById("control-setting-screen");
  overlay.style.display = "none";
}
// #endregion Show-Control Settings

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
