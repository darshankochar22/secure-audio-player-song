const fs = require("fs");
const path = require("path");
const { getEnv, verifyFromRequest } = require("../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { JWT_SECRET, AUDIO_FILE } = getEnv();
  const payload = verifyFromRequest(req, JWT_SECRET);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const audioPath = path.join(process.cwd(), AUDIO_FILE);
  if (!fs.existsSync(audioPath)) {
    return res.status(404).json({ error: "Audio file not found" });
  }

  const stat = fs.statSync(audioPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", "audio/wav");

  if (!range) {
    res.statusCode = 200;
    res.setHeader("Content-Length", String(fileSize));
    fs.createReadStream(audioPath).pipe(res);
    return;
  }

  const [startText, endText] = range.replace(/bytes=/, "").split("-");
  const start = Number.parseInt(startText, 10);
  const end = endText ? Number.parseInt(endText, 10) : fileSize - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start >= fileSize || end >= fileSize || end < start) {
    res.statusCode = 416;
    res.setHeader("Content-Range", `bytes */${fileSize}`);
    return res.end();
  }

  const chunkSize = end - start + 1;
  res.statusCode = 206;
  res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
  res.setHeader("Content-Length", String(chunkSize));
  fs.createReadStream(audioPath, { start, end }).pipe(res);
};
