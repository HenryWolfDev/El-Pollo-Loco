/**
 * Touch controls for mobile UI that toggle the shared keyboard state.
 * Mirrors keyboard actions for left/right/jump/throw via on-screen buttons.
 * @param {object} keyboard Mutable keyboard state with boolean flags.
 */
export function mobileControls(keyboard) {
  const left = document.getElementById("left-icon");
  const right = document.getElementById("right-icon");
  const jump = document.getElementById("jump-icon");
  const thrw = document.getElementById("throw-icon");

  if (left) {
    left.addEventListener("touchstart", () => (keyboard.LEFT = true));
    left.addEventListener("touchend", () => (keyboard.LEFT = false));
  }
  if (right) {
    right.addEventListener("touchstart", () => (keyboard.RIGHT = true));
    right.addEventListener("touchend", () => (keyboard.RIGHT = false));
  }
  if (jump) {
    jump.addEventListener("touchstart", () => (keyboard.SPACE = true));
    jump.addEventListener("touchend", () => (keyboard.SPACE = false));
  }
  if (thrw) {
    thrw.addEventListener("touchstart", () => (keyboard.D = true));
    thrw.addEventListener("touchend", () => (keyboard.D = false));
  }
}
