const jwt = require("jsonwebtoken");

const TOKEN_COOKIE = "audio_auth";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function getEnv() {
  return {
    ACCESS_CODE: process.env.ACCESS_CODE || "change-me-now",
    JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
    AUDIO_FILE: process.env.AUDIO_FILE || "Aadhi Aadhi_FINAL_MASTER_48Khz_16BIt_07_.wav",
    IS_PROD: process.env.NODE_ENV === "production"
  };
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = {};
  for (const item of cookieHeader.split(";")) {
    const [rawKey, ...rest] = item.trim().split("=");
    if (!rawKey) continue;
    cookies[rawKey] = decodeURIComponent(rest.join("="));
  }
  return cookies;
}

function createAuthCookie(token, isProd) {
  const parts = [
    `${TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${TWO_HOURS_MS / 1000}`
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

function clearAuthCookie(isProd) {
  const parts = [
    `${TOKEN_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0"
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

function signToken(secret) {
  return jwt.sign({ scope: "audio:play" }, secret, { expiresIn: "2h" });
}

function verifyFromRequest(req, secret) {
  const cookies = parseCookies(req);
  const token = cookies[TOKEN_COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

module.exports = {
  TOKEN_COOKIE,
  getEnv,
  createAuthCookie,
  clearAuthCookie,
  signToken,
  verifyFromRequest
};
