// backend/models/Sale.js
const mongoose = require("mongoose");

// Sale Schema
const saleSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    totalProfit: { type: Number, required: true },
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;