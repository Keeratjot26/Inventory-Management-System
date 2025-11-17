// server.js (FINAL)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Correct Token Middleware Path (your file is directly under backend/)
const { verifyToken } = require("./authMiddleware");

// Routes
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ========================
// FIREBASE INITIALIZATION
// ========================

const SERVICE_ACCOUNT_FILE = "serviceAccountKey.json";
const projectRoot = path.join(__dirname, "..");
const serviceAccountPath = path.join(projectRoot, SERVICE_ACCOUNT_FILE);

if (fs.existsSync(serviceAccountPath) && !admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log(`✅ Firebase Admin initialized`);
  } catch (err) {
    console.error(
      `❌ ERROR reading/parsing ${SERVICE_ACCOUNT_FILE}:`,
      err.message
    );
    process.exit(1);
  }
} else {
  console.error(
    `❌ Missing ${SERVICE_ACCOUNT_FILE}. Expected at: ${serviceAccountPath}`
  );
  process.exit(1);
}

// ========================
// MONGO CONNECTION
// ========================

mongoose
  .connect(process.env.MONGO_URI, { dbName: "InventoryDB" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========================
// ROUTES
// ========================

app.use("/api/products", verifyToken, productRoutes);
app.use("/api/sales", verifyToken, saleRoutes);

// ========================
// SERVER START
// ========================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});