const loginForm = document.getElementById("login-form");
const codeInput = document.getElementById("code");
const statusEl = document.getElementById("status");
const playerPanel = document.getElementById("player-panel");
const logoutBtn = document.getElementById("logout");
const player = document.getElementById("player");

function setStatus(message, isError = true) {
  statusEl.style.color = isError ? "#fda4af" : "#86efac";
  statusEl.textContent = message;
}

function setAuthenticated(authenticated) {
  playerPanel.classList.toggle("hidden", !authenticated);
  loginForm.classList.toggle("hidden", authenticated);
  if (!authenticated) {
    player.pause();
    player.currentTime = 0;
  }
}

async function checkSession() {
  try {
    const res = await fetch("/api/session", { credentials: "include" });
    if (res.ok) {
      setAuthenticated(true);
      setStatus("Unlocked. Press play.", false);
      return;
    }
  } catch {
    // keep default locked state
  }
  setAuthenticated(false);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Checking code...", false);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code: codeInput.value })
    });

    if (!res.ok) {
      const data = await res.json();
      setStatus(data.error || "Access denied");
      return;
    }

    setAuthenticated(true);
    setStatus("Unlocked. Press play.", false);
    codeInput.value = "";
  } catch {
    setStatus("Network error. Try again.");
  }
});

logoutBtn.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  setAuthenticated(false);
  setStatus("Locked.");
});

checkSession();
