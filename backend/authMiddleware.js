const admin = require("firebase-admin");

/**
 * Middleware to verify Firebase ID token and attach user data (req.user) to the request.
 */
async function verifyToken(req, res, next) {
  if (!admin.apps.length) {
    console.error("CRITICAL: Firebase Admin not initialized.");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { verifyToken };