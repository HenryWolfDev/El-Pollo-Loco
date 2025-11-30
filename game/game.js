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
const OVERLAY_VISIBLE_CLASS = "is-visible";
const BODY_PLAYING_CLASS = "is-playing";

/**
 * Toggles visibility of the mobile general box (start/settings/music/impress).
 * @param {boolean} visible
 */
function setMobileGeneralBoxVisible(visible) {
  const box = document.querySelector(".mobile-buttons .general-box");
  if (!box) return;
  box.style.display = visible ? "flex" : "none";
}

/**
 * Clones the desktop music toggle into the mobile general box so it sits
 * alongside the other quick actions on small screens.
 */
function injectMobileMusicToggle() {
  const generalBox = document.querySelector(".mobile-buttons .general-box");
  const desktopToggle = document.getElementById("music-toggle");
  if (!generalBox || !desktopToggle) return;
  if (document.getElementById("music-toggle-mobile")) return;

  const mobileToggle = desktopToggle.cloneNode(true);
  mobileToggle.id = "music-toggle-mobile";
  mobileToggle.dataset.variant = "mobile";
  generalBox.appendChild(mobileToggle);
}

/**
 * Shows an overlay with an optional delay.
 * @param {HTMLElement|null} el
 * @param {number} delay
 */
function showOverlay(el, delay = 0) {
  if (!el) return;
  if (el.id === "start-screen") {
    // Ensure mobile move buttons stay hidden while on the start menu.
    document.body.classList.remove(BODY_PLAYING_CLASS);
    setMobileGeneralBoxVisible(true);
  }
  if (delay > 0) {
    setTimeout(() => el.classList.add(OVERLAY_VISIBLE_CLASS), delay);
  } else {
    el.classList.add(OVERLAY_VISIBLE_CLASS);
  }
}

/**
 * Hides an overlay by removing the visible class.
 * @param {HTMLElement|null} el
 */
function hideOverlay(el) {
  if (!el) return;
  el.classList.remove(OVERLAY_VISIBLE_CLASS);
}

// #region_______________________region Show-Control Settings______________________
/**
 * Shows the controls overlay and wires the restart button to close it.
 * @returns {void}
 */
function showControlSettings() {
  const overlay = document.getElementById("control-setting-screen");
  showOverlay(overlay);

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
  hideOverlay(overlay);
}
// #endregion_______________________region Show-Control Settings______________________

// #region_______________________Impressum Overlay_______________________
/**
 * Displays the imprint (legal) overlay.
 * @returns {void}
 */
function showImpressum() {
  const overlay = document.getElementById("impressum-screen");
  showOverlay(overlay);
}

/**
 * Hides the imprint overlay.
 * @returns {void}
 */
function closeImpressum() {
  const overlay = document.getElementById("impressum-screen");
  hideOverlay(overlay);
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

  hideOverlay(document.getElementById("start-screen"));
  closeControlSettings();
  document.body.classList.add(BODY_PLAYING_CLASS);
  setMobileGeneralBoxVisible(false);
}

/**
 * Immediately restarts the game (skips main menu) by creating a fresh World.
 * @returns {void}
 */
function restartGame() {
  const canvas = document.getElementById("canvas");

  const gameover = document.getElementById("gameover-screen");
  const winning = document.getElementById("winning-screen");
  hideOverlay(gameover);
  hideOverlay(winning);

  if (world && typeof world.destroy === "function") {
    world.destroy();
  }

  SpawnManager.reset();
  world = new World(canvas, keyboard);
  document.body.classList.add(BODY_PLAYING_CLASS);
  setMobileGeneralBoxVisible(false);
}

/**
 * Returns to the main menu and stops running loops.
 * @returns {void}
 */
function goToMainMenu() {
  const gameover = document.getElementById("gameover-screen");
  const winning = document.getElementById("winning-screen");
  const control = document.getElementById("control-setting-screen");
  hideOverlay(gameover);
  hideOverlay(winning);
  hideOverlay(control);

  const start = document.getElementById("start-screen");
  showOverlay(start);

  if (world && typeof world.destroy === "function") {
    world.destroy();
  }
  document.body.classList.remove(BODY_PLAYING_CLASS);
  setMobileGeneralBoxVisible(true);
}
// #endregion_______________________Game controls_______________________

function initMusicToggle() {
  const toggles = Array.from(document.querySelectorAll(".music-toggle"));
  if (!toggles.length) return;

  const updateToggleUI = () => {
    const enabled = AudioHub.musicEnabled;
    toggles.forEach((toggle) => {
      const iconOn = toggle.querySelector("[data-state='on']");
      const iconOff = toggle.querySelector("[data-state='off']");
      toggle.dataset.state = enabled ? "on" : "off";
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.title = enabled ? "Mute sound" : "Unmute sound";
      if (iconOn && iconOff) {
        iconOn.style.display = enabled ? "block" : "none";
        iconOff.style.display = enabled ? "none" : "block";
      }
    });
  };

  const handleClick = () => {
    const nextState = !AudioHub.musicEnabled;
    AudioHub.setMusicEnabled(nextState);
    if (nextState && world) {
      AudioHub.playOne(AudioHub.Background, false);
    }
    updateToggleUI();
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", handleClick);
    // Prevent spacebar from toggling music when the button is focused.
    toggle.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault();
      }
    });
  });

  updateToggleUI();
}

/** Initializes input listeners and UI buttons after the page loads. */
window.addEventListener("load", () => {
  keyboardListeners(keyboard);
  mobileControls(keyboard);
  injectMobileMusicToggle();
  setMobileGeneralBoxVisible(true);
  initMusicToggle();
  showOverlay(document.getElementById("start-screen"));
  menuAndOverlayListeners({
    startGame,
    showControlSettings,
    showImpressum,
    closeImpressum,
    restartGame,
    goToMainMenu,
  });
});
