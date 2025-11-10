import { World } from "../models/World.js";
import { Keyboard } from "../models/Keyboard.js";
import { SpawnManager } from "./SpawnManager.js";

let world;
let keyboard = new Keyboard();

function startGame() {
  const canvas = document.getElementById("canvas");
  if (world && typeof world.destroy === "function") {
    world.destroy();
  }
  // Reset spawn sequences for enemies/clouds
  SpawnManager.reset();
  world = new World(canvas, keyboard);

  document.getElementById("start-screen").style.display = "none";
  closeControlSettings();
}

function restartGame() {
  const canvas = document.getElementById("canvas");
  // Hide overlays
  const gameover = document.getElementById("gameover-screen");
  const winning = document.getElementById("winning-screen");
  if (gameover) gameover.style.display = "none";
  if (winning) winning.style.display = "none";

  // Recreate world with existing keyboard
  if (world && typeof world.destroy === "function") {
    world.destroy();
  }
  // Reset spawns for a fresh level layout
  SpawnManager.reset();
  world = new World(canvas, keyboard);
}

function goToMainMenu() {
  // Hide any overlays
  const gameover = document.getElementById("gameover-screen");
  const winning = document.getElementById("winning-screen");
  const control = document.getElementById("control-setting-screen");
  if (gameover) gameover.style.display = "none";
  if (winning) winning.style.display = "none";
  if (control) control.style.display = "none";

  // Show start screen
  const start = document.getElementById("start-screen");
  if (start) start.style.display = "flex";

  // Stop any running game loops/audio
  if (world && typeof world.destroy === "function") {
    world.destroy();
  }
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
  // Impressum
  const impressBtn = document.getElementById("impress-button");
  if (impressBtn) {
    impressBtn.addEventListener("click", showImpressum);
  }
  const impressClose = document.getElementById("impressum-close-btn");
  if (impressClose) {
    impressClose.addEventListener("click", closeImpressum);
  }

  // Restart buttons
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }
  const restartWinBtn = document.getElementById("restart-btn-winning");
  if (restartWinBtn) {
    restartWinBtn.addEventListener("click", restartGame);
  }

  // Main menu buttons
  const mainMenuBtn = document.getElementById("main-menu-btn");
  if (mainMenuBtn) {
    mainMenuBtn.addEventListener("click", goToMainMenu);
  }
  const mainMenuBtnWin = document.getElementById("main-menu-btn-winning");
  if (mainMenuBtnWin) {
    mainMenuBtnWin.addEventListener("click", goToMainMenu);
  }

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
  // Behave like Impressum: simply close overlay without reloading
  if (restartBtn) {
    restartBtn.onclick = closeControlSettings;
  }
}

function closeControlSettings() {
  const overlay = document.getElementById("control-setting-screen");
  overlay.style.display = "none";
}
// #endregion Show-Control Settings

// #region Impressum Overlay
function showImpressum() {
  const overlay = document.getElementById("impressum-screen");
  overlay.style.display = "flex";
}

function closeImpressum() {
  const overlay = document.getElementById("impressum-screen");
  overlay.style.display = "none";
}
// #endregion Impressum Overlay

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
  // Support F for throwing as labeled in controls
  if (e.keyCode == 70) {
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
  if (e.keyCode == 70) {
    keyboard.D = false;
  }
  if (e.keyCode == 27) {
    keyboard.ESCAPE = false;
  }
});
// #endregion Keyboard-Listener
