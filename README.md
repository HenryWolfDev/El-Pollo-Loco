![Start screen](assets/img/9_intro_outro_screens/start/startscreen_1.png)

# El Pollo Loco – Browser Game

A small, fast 2D jump-and-run for the browser. Guide the character through a side-scrolling world, dodge enemies, collect coins, and defeat the end boss. Built for portfolio purposes: clean code structure, responsive UI, and clear audio/animation logic.

## Highlights

- Smooth rendering via `requestAnimationFrame` and consistent logic loops
- Responsive layout (desktop and mobile, including landscape phones)
- Mobile touch controls and desktop keyboard support
- Clean restart/reset: restart without page reload, tidy teardown
- Endboss event: triggers on approach or early hit with a thrown object
- Audio hub with central start/stop and snoring loop/stop logic

## Controls

- Move: Arrow keys left/right
- Jump: Space
- Throw: F
- Mobile: On-screen buttons (left/right/jump/throw)

## Project Structure (excerpt)

- `game/game.js` – bootstrap, UI wiring, start/restart/main menu
- `game/keyboardListeners.js` – keyboard events (desktop)
- `game/mobileControls.js` – touch controls (mobile UI)
- `game/menuListeners.js` – menu/overlay buttons
- `game/AudioHub.js` – audio management (play/stop/loop)
- `game/IntervalHub.js` – central interval management
- `game/SpawnManager.js` – deterministic spawning, including `reset()`
- `models/World.js` – world, collisions, rendering, boss event
- `models/Character.js` – player logic, animations with FPS throttling
- `models/Endboss.js` – end boss logic, attack throttling
- `models/*` – enemies, collectibles, background, status bars

## Tech

- Vanilla JS (ES modules), HTML5 Canvas, CSS
- Structured modules and clear responsibilities
- Animation throttling for consistent frame rates (smooth display)

## Run Locally

1. Clone or unzip the repository.
2. Start a local web server (e.g., VS Code Live Server or `npx serve`).
3. Open `index.html` in the browser.

Note: Some browsers block local audio autoplay. A click on “Start” enables the needed interactions.

## Responsive Behavior

- Desktop scales up to `720x480` and keeps a 3:2 aspect ratio.
- Mobile UI activates on narrow viewports and landscape phones with low height.

## Shortcuts/Features

- Restart via “Neustarten” instantly starts a new game (no reload).
- “Hauptmenü” stops loops/audio and shows the start screen.
- Impressum available from the start menu.

## Assets & Credits

- Graphics/sounds are course/demo assets. Rights remain with their respective owners.
- Project is a learning and portfolio project from Developer Akademie.

## License

This project is for demonstration and learning purposes. No commercial use of the bundled assets.
