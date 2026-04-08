const { getEnv, verifyFromRequest } = require("../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { JWT_SECRET } = getEnv();
  const payload = verifyFromRequest(req, JWT_SECRET);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ authenticated: true });
};
