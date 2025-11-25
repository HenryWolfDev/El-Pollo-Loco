/**
 * Attaches global key listeners and toggles flags on the shared keyboard state object.
 * Supports movement, jump, throw (D/F), and escape keys.
 * @param {object} keyboard Mutable keyboard state with boolean direction/action flags.
 */
export function keyboardListeners(keyboard) {
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
    if (e.keyCode == 68 || e.keyCode == 70) {
      // D or F for throwing
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
    if (e.keyCode == 68 || e.keyCode == 70) {
      keyboard.D = false;
    }
    if (e.keyCode == 27) {
      keyboard.ESCAPE = false;
    }
  });
}
