require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const ACCESS_CODE = process.env.ACCESS_CODE || "change-me-now";
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const TOKEN_COOKIE = "audio_auth";
const AUDIO_FILE = process.env.AUDIO_FILE || "Aadhi Aadhi_FINAL_MASTER_48Khz_16BIt_07_.wav";
const AUDIO_PATH = path.join(__dirname, AUDIO_FILE);

if (!fs.existsSync(AUDIO_PATH)) {
  throw new Error(`Audio file not found at: ${AUDIO_PATH}`);
}

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "media-src": ["'self'"],
        "connect-src": ["'self'"]
      }
    }
  })
);

function authRequired(req, res, next) {
  const token = req.cookies[TOKEN_COOKIE];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
}

app.post("/api/login", (req, res) => {
  const { code } = req.body || {};
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" });
  }

  if (code !== ACCESS_CODE) {
    return res.status(401).json({ error: "Invalid code" });
  }

  const token = jwt.sign({ scope: "audio:play" }, JWT_SECRET, { expiresIn: "2h" });
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 60 * 60 * 1000
  });

  return res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie(TOKEN_COOKIE);
  return res.json({ ok: true });
});

app.get("/api/session", authRequired, (_, res) => {
  res.json({ authenticated: true });
});

app.get("/api/audio", authRequired, (req, res) => {
  const stat = fs.statSync(AUDIO_PATH);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/wav",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store"
    });
    fs.createReadStream(AUDIO_PATH).pipe(res);
    return;
  }

  const [startText, endText] = range.replace(/bytes=/, "").split("-");
  const start = Number.parseInt(startText, 10);
  const end = endText ? Number.parseInt(endText, 10) : fileSize - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start >= fileSize || end >= fileSize) {
    res.status(416).set("Content-Range", `bytes */${fileSize}`).end();
    return;
  }

  const chunkSize = end - start + 1;
  const file = fs.createReadStream(AUDIO_PATH, { start, end });
  const head = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "audio/wav",
    "Cache-Control": "private, no-store"
  };

  res.writeHead(206, head);
  file.pipe(res);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Secure audio app running on http://localhost:${PORT}`);
});
