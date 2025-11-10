// Centralize menu and overlay button listeners
export function menuAndOverlayListeners({
  startGame,
  showControlSettings,
  showImpressum,
  closeImpressum,
  restartGame,
  goToMainMenu,
}) {
  // Start
  const startBtn = document.getElementById("start-button");
  if (startBtn) startBtn.addEventListener("click", startGame);
  const startIcon = document.getElementById("start-icon");
  if (startIcon) startIcon.addEventListener("click", startGame);

  // Control settings
  const controlBtn = document.getElementById("control-button");
  if (controlBtn) controlBtn.addEventListener("click", showControlSettings);
  const settingsIcon = document.getElementById("settings-icon");
  if (settingsIcon) settingsIcon.addEventListener("click", showControlSettings);

  // Impressum
  const impressBtn = document.getElementById("impress-button");
  if (impressBtn) impressBtn.addEventListener("click", showImpressum);
  const impressClose = document.getElementById("impressum-close-btn");
  if (impressClose) impressClose.addEventListener("click", closeImpressum);

  // Restart buttons
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) restartBtn.addEventListener("click", restartGame);
  const restartWinBtn = document.getElementById("restart-btn-winning");
  if (restartWinBtn) restartWinBtn.addEventListener("click", restartGame);

  // Main menu buttons
  const mainMenuBtn = document.getElementById("main-menu-btn");
  if (mainMenuBtn) mainMenuBtn.addEventListener("click", goToMainMenu);
  const mainMenuBtnWin = document.getElementById("main-menu-btn-winning");
  if (mainMenuBtnWin) mainMenuBtnWin.addEventListener("click", goToMainMenu);
}
