/**
 * Touch/pointer controls for mobile UI that toggle the shared keyboard state.
 * Mirrors keyboard actions for left/right/jump/throw via on-screen buttons.
 * @param {object} keyboard Mutable keyboard state with boolean flags.
 */
export function mobileControls(keyboard) {
  const left = document.getElementById("left-icon");
  const right = document.getElementById("right-icon");
  const jump = document.getElementById("jump-icon");
  const thrw = document.getElementById("throw-icon");

  const bindControl = (el, onPress, onRelease) => {
    if (!el) return;
    const startEvents = ["pointerdown", "touchstart"];
    const endEvents = ["pointerup", "pointercancel", "touchend", "touchcancel", "mouseleave"];

    startEvents.forEach((evt) =>
      el.addEventListener(evt, (e) => {
        e.preventDefault();
        onPress();
      })
    );
    endEvents.forEach((evt) =>
      el.addEventListener(evt, (e) => {
        e.preventDefault();
        onRelease();
      })
    );
  };

  bindControl(left, () => (keyboard.LEFT = true), () => (keyboard.LEFT = false));
  bindControl(right, () => (keyboard.RIGHT = true), () => (keyboard.RIGHT = false));
  bindControl(jump, () => (keyboard.SPACE = true), () => (keyboard.SPACE = false));
  bindControl(thrw, () => (keyboard.D = true), () => (keyboard.D = false));
}
