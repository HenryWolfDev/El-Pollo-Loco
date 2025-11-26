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

  /**
   * Wires a single on-screen button to press/release handlers.
   * @param {HTMLElement|null} buttonEl - The button element (can be null if not found).
   * @param {Function} onPress - Called when the button is pressed.
   * @param {Function} onRelease - Called when the button is released.
   */
  const bindControl = (buttonEl, onPress, onRelease) => {
    const handlePress = (e) => {
      e.preventDefault();
      onPress();
    };

    const handleRelease = (e) => {
      e.preventDefault();
      onRelease();
    };

    buttonEl.addEventListener("pointerdown", handlePress);
    buttonEl.addEventListener("touchstart", handlePress);

    buttonEl.addEventListener("pointerup", handleRelease);
    buttonEl.addEventListener("pointercancel", handleRelease);
    buttonEl.addEventListener("touchend", handleRelease);
  };

  bindControl(
    left,
    () => (keyboard.LEFT = true),
    () => (keyboard.LEFT = false)
  );
  bindControl(
    right,
    () => (keyboard.RIGHT = true),
    () => (keyboard.RIGHT = false)
  );
  bindControl(
    jump,
    () => (keyboard.SPACE = true),
    () => (keyboard.SPACE = false)
  );
  bindControl(
    thrw,
    () => (keyboard.D = true),
    () => (keyboard.D = false)
  );
}
