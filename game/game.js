/**
 * Game bootstrap and UI wiring for El Pollo Loco.
 * Wires keyboard/touch/menu listeners and manages starting/restarting games.
 * @module game/game
 */
import { World } from "../models/World.js";
import { Keyboard } from "../models/Keyboard.js";
import { SpawnManager } from "./SpawnManager.js";
import { keyboardListeners } from "./keyboardListeners.js";
import { mobileControls } from "./mobileControls.js";
import { menuAndOverlayListeners } from "./menuListeners.js";
import { AudioHub } from "./AudioHub.js";

/** @type {World|null} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();

// #region_______________________region Show-Control Settings______________________
/**
 * Shows the controls overlay and wires the restart button to close it.
 * @returns {void}
 */
function showControlSettings() {
  document.getElementById("control-setting-screen").style.display = "flex";

  const restartBtn = document.getElementById("restart-btn-control");

  if (restartBtn) {
    restartBtn.onclick = closeControlSettings;
  }
}

/**
 * Hides the controls overlay.
 * @returns {void}
 */
function closeControlSettings() {
  const overlay = document.getElementById("control-setting-screen");
  overlay.style.display = "none";
}
// #endregion_______________________region Show-Control Settings______________________

// #region_______________________Impressum Overlay_______________________
/**
 * Displays the imprint (legal) overlay.
 * @returns {void}
 */
function showImpressum() {
  const overlay = document.getElementById("impressum-screen");
  overlay.style.display = "flex";
}

/**
 * Hides the imprint overlay.
 * @returns {void}
 */
function closeImpressum() {
  const overlay = document.getElementById("impressum-screen");
  overlay.style.display = "none";
}
// #endregion_______________________Impressum Overlay_______________________

// #region_______________________Game controls_______________________

/**
 * Starts a new game session.
 * - Stops an existing session if present
 * - Resets spawn sequences
 * - Instantiates a fresh World and hides the start screen
 * @returns {void}
 */
function startGame() {
  const canvas = document.getElementById("canvas");
  if (world && typeof world.destroy === "function") {
    world.destroy();
  }
  SpawnManager.reset();
  world = new World(canvas, keyboard);

  document.getElementById("start-screen").style.display = "none";
  closeControlSettings();
}

/**
 * Immediately restarts the game (skips main menu) by creating a fresh World.
 * @returns {void}
 */
function restartGame() {
  const canvas = document.getElementById("canvas");

  const gameover = document.getElementById("gameover-screen");
  const winning = document.getElementById("winning-screen");
  if (gameover) gameover.style.display = "none";
  if (winning) winning.style.display = "none";

  if (world && typeof world.destroy === "function") {
    world.destroy();
  }

  SpawnManager.reset();
  world = new World(canvas, keyboard);
}

/**
 * Returns to the main menu and stops running loops.
 * @returns {void}
 */
function goToMainMenu() {
  const gameover = document.getElementById("gameover-screen");
  const winning = document.getElementById("winning-screen");
  const control = document.getElementById("control-setting-screen");
  if (gameover) gameover.style.display = "none";
  if (winning) winning.style.display = "none";
  if (control) control.style.display = "none";

  const start = document.getElementById("start-screen");
  if (start) start.style.display = "flex";

  if (world && typeof world.destroy === "function") {
    world.destroy();
  }
}
// #endregion_______________________Game controls_______________________

function initMusicToggle() {
  const toggle = document.getElementById("music-toggle");
  if (!toggle) return;
  const iconOn = toggle.querySelector("[data-state='on']");
  const iconOff = toggle.querySelector("[data-state='off']");

  const updateToggleUI = () => {
    const enabled = AudioHub.musicEnabled;
    toggle.dataset.state = enabled ? "on" : "off";
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.title = enabled ? "Mute sound" : "Unmute sound";
    if (iconOn && iconOff) {
      iconOn.style.display = enabled ? "block" : "none";
      iconOff.style.display = enabled ? "none" : "block";
    }
  };

  toggle.addEventListener("click", () => {
    const nextState = !AudioHub.musicEnabled;
    AudioHub.setMusicEnabled(nextState);
    if (nextState && world) {
      AudioHub.playOne(AudioHub.Background);
    }
    updateToggleUI();
  });

  // Prevent spacebar from toggling music when the button is focused.
  toggle.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.keyCode === 32) {
      e.preventDefault();
    }
  });

  updateToggleUI();
}

/** Initializes input listeners and UI buttons after the page loads. */
window.addEventListener("load", () => {
  keyboardListeners(keyboard);
  mobileControls(keyboard);
  initMusicToggle();
  menuAndOverlayListeners({
    startGame,
    showControlSettings,
    showImpressum,
    closeImpressum,
    restartGame,
    goToMainMenu,
  });
});
