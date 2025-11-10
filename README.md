![Startmenü](assets/img/9_intro_outro_screens/start/startscreen_1.png)

# El Pollo Loco — Browser Game

Ein kleines, schnelles 2D‑Jump‑and‑Run für den Browser. Du steuerst den Charakter durch eine horizontale Welt, weichst Gegnern aus, sammelst Coins und bekämpfst den Endboss. Das Projekt ist für Portfolio‑Zwecke aufbereitet: sauber strukturierter Code, responsive UI und klare Audio/Animation‑Logik.

## Highlights

- Geschmeidiges Rendering via `requestAnimationFrame` und konsistente Logik‑Loops
- Responsives Layout (Desktop und Mobile, inkl. Landscape‑Phones)
- Mobile‑Touch‑Controls und Desktop‑Keyboard‑Support (inkl. F/D zum Werfen)
- Sauberes Restart/Reset: Neustart ohne Seitenreload, sauberer Teardown
- Endboss‑Event: automatisch beim Nähern oder frühem Treffer durch Wurfobjekt
- Audio‑Hub mit zentralem Start/Stop, Schlaf‑Schnarchen mit Loop/Stop‑Logik

## Steuerung

- Bewegen: Pfeiltasten links/rechts
- Springen: Leertaste
- Werfen: F oder D
- Mobile: On‑Screen‑Buttons (links/rechts/springen/werfen)

## Projekt Struktur (Auszug)

- `game/game.js` – Bootstrap, UI‑Wiring, Start/Restart/Main‑Menu
- `game/keyboardListeners.js` – Keyboard‑Events (Desktop)
- `game/mobileControls.js` – Touch‑Controls (Mobile UI)
- `game/menuListeners.js` – Menü‑/Overlay‑Buttons
- `game/AudioHub.js` – Audio Management (play/stop/loop)
- `game/IntervalHub.js` – Zentrale Verwaltung von Intervals
- `game/SpawnManager.js` – Deterministisches Spawning, inkl. `reset()`
- `models/World.js` – Welt, Kollisionen, Rendering, Boss‑Event
- `models/Character.js` – Player‑Logik, Animationen mit FPS‑Throttling
- `models/Endboss.js` – Endboss‑Logik, Attack‑Throttling
- `models/*` – Enemies, Collectibles, Hintergrund, Statusleisten

## Technik

- Vanilla JS (ES Modules), HTML5 Canvas, CSS
- Strukturierte Module und klare Zuständigkeiten
- Animations‑Throttling für konsistente Bildraten (flüssige Darstellung)

## Lokal starten

1. Repository klonen oder entpacken
2. Mit einem lokalen Webserver starten (z. B. VS Code Live Server oder `npx serve`)
3. `index.html` im Browser öffnen

Hinweis: Einige Browser blockieren lokale Audio‑Autoplay‑Rechte. Ein Klick auf „Start“ aktiviert die nötigen Interaktionen.

## Responsive Verhalten

- Desktop passt sich bis `720x480` an und behält 3:2‑Seitenverhältnis
- Mobile‑UI aktiviert sich bei schmalen Viewports und auch bei Landscape‑Phones mit geringer Höhe

## Bekannte Shortcuts/Features

- Neustart über „Neustarten“ startet sofort ein neues Spiel (kein Reload)
- „Hauptmenü“ beendet Loops/Audios und zeigt den Startbildschirm
- Impressum im Startmenü verfügbar

## Assets & Credits

- Grafiken/Sounds sind Kurs‑/Demo‑Assets. Rechte verbleiben bei den jeweiligen Inhabern.
- Projekt ist ein Lern‑ und Portfolio‑Projekt der Developer Akademie.

## Lizenz

Dieses Projekt dient Demonstrations‑ und Lernzwecken. Keine kommerzielle Nutzung der beigefügten Assets.
