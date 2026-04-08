const { createAuthCookie, getEnv, signToken } = require("../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ACCESS_CODE, JWT_SECRET, IS_PROD } = getEnv();
  const { code } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" });
  }

  if (code !== ACCESS_CODE) {
    return res.status(401).json({ error: "Invalid code" });
  }

  const token = signToken(JWT_SECRET);
  res.setHeader("Set-Cookie", createAuthCookie(token, IS_PROD));
  return res.status(200).json({ ok: true });
};
