const { clearAuthCookie, getEnv } = require("../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { IS_PROD } = getEnv();
  res.setHeader("Set-Cookie", clearAuthCookie(IS_PROD));
  return res.status(200).json({ ok: true });
};
