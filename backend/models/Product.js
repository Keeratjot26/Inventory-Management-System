// backend/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  userId: { type: String, required: true }, // owner (Firebase uid)
  category: { type: String, default: "" },
  sellingPrice: { type: Number, default: 0 },
  purchaseCost: { type: Number, default: 0 },
  supplierName: { type: String, default: "" },
  expiryDate: { type: Date, default: null },
}, { timestamps: true });

// CRITICAL: This prevents the OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);