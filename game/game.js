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

/** @type {World|null} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();

// #region_______________________region Show-Control Settings______________________
/**
 * Zeigt das Steuerungs-Overlay und bindet den Zurück-Button zum Schließen.
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
 * Blendet das Steuerungs-Overlay aus.
 * @returns {void}
 */
function closeControlSettings() {
  const overlay = document.getElementById("control-setting-screen");
  overlay.style.display = "none";
}
// #endregion_______________________region Show-Control Settings______________________

// #region_______________________Impressum Overlay_______________________
/**
 * Zeigt das Impressum-Overlay an.
 * @returns {void}
 */
function showImpressum() {
  const overlay = document.getElementById("impressum-screen");
  overlay.style.display = "flex";
}

/**
 * Blendet das Impressum-Overlay aus.
 * @returns {void}
 */
function closeImpressum() {
  const overlay = document.getElementById("impressum-screen");
  overlay.style.display = "none";
}
// #endregion_______________________Impressum Overlay_______________________

// #region_______________________Game controls_______________________

/**
 * Startet eine neue Spielinstanz.
 * - Stoppt ggf. laufende Instanz
 * - Setzt Spawn-Sequenzen zurück
 * - Erzeugt neue World und blendet Startbildschirm aus
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
 * Startet das Spiel direkt neu (ohne Hauptmenü),
 * indem eine frische World erzeugt wird.
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
 * Zurück ins Hauptmenü wechseln und laufende Loops stoppen.
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

/** Initialisiert Eingabe‑Listener und UI‑Buttons nach dem Laden der Seite. */
window.addEventListener("load", () => {
  keyboardListeners(keyboard);
  mobileControls(keyboard);
  menuAndOverlayListeners({
    startGame,
    showControlSettings,
    showImpressum,
    closeImpressum,
    restartGame,
    goToMainMenu,
  });
});
