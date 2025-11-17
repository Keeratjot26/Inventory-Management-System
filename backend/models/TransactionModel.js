// backend/models/TransactionModel.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  quantitySold: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true } // link to logged-in user
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;