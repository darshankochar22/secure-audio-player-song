const unlockBtn = document.getElementById("unlock");
const codeInput = document.getElementById("code");
const statusEl = document.getElementById("status");
const playerPanel = document.getElementById("player-panel");

const DEMO_CODE = "song123";

function setStatus(message, isError = true) {
  statusEl.style.color = isError ? "#fda4af" : "#86efac";
  statusEl.textContent = message;
}

unlockBtn.addEventListener("click", () => {
  if (codeInput.value.trim() !== DEMO_CODE) {
    setStatus("Wrong code. Try again.");
    return;
  }

  playerPanel.classList.remove("hidden");
  setStatus("Unlocked. Press play.", false);
});
