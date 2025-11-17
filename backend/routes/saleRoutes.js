const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

const { verifyToken } = require("../authMiddleware"); 

const router = express.Router();

// POST /api/sales  -- record a sale and decrement stock
router.post("/", verifyToken, async (req, res) => {
  try {
    const { product, quantity: quantitySold, sellingPrice, purchaseCost } = req.body;
    
    console.log("Incoming Sale Data:", req.body); 

    if (!product || !quantitySold) {
      return res.status(400).json({ error: "Product name and quantitySold required" });
    }

    const numericQuantitySold = Number(quantitySold);

    // TEMPORARY FIX REMAINS: No userId check to allow old data to be sold.
    const foundProduct = await Product.findOne({ 
        name: { $regex: new RegExp(`^${product}$`, 'i') }
        // userId: req.user.uid 
    });
    
    if (!foundProduct) {
        console.error("Sale Error: Product not found by name.");
        return res.status(404).json({ error: `Product not found: ${product}` });
    }

    if (foundProduct.quantity < numericQuantitySold) {
      return res.status(400).json({ error: `Not enough stock for ${foundProduct.name}. Available: ${foundProduct.quantity}` });
    }

    const sp = typeof sellingPrice === "number" ? sellingPrice : (foundProduct.sellingPrice || 0);
    const pc = typeof purchaseCost === "number" ? purchaseCost : (foundProduct.purchaseCost || 0);
    const profit = (sp - pc) * numericQuantitySold;

    const sale = new Sale({
      productId: foundProduct._id,
      productName: foundProduct.name,
      quantitySold: numericQuantitySold,
      totalProfit: profit,
      userId: req.user.uid
    });

    // Save sale and update product atomically using session
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("LOG 1: Transaction started.");
    try {
      await sale.save({ session });
      console.log("LOG 2: Sale saved to session (pre-commit).");

      foundProduct.quantity = foundProduct.quantity - numericQuantitySold;
      await foundProduct.save({ session });
      console.log("LOG 3: Product stock updated (pre-commit).");

      await session.commitTransaction();
      console.log("LOG 4: Transaction committed successfully.");
    } catch (innerErr) {
      await session.abortTransaction();
      console.error("CRITICAL TRANSACTION FAILURE:", innerErr.message);
      throw innerErr; // Re-throw to hit the outer catch block
    } finally {
      session.endSession();
    }

    // Success response
    res.json({ message: "Sale recorded successfully", sale });
  } catch (err) {
    console.error("Sale route error:", err.message);
    res.status(500).json({ error: "Failed to record sale", details: err.message });
  }
});

// GET /api/sales -- list user's sales
router.get("/", verifyToken, async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user.uid }).sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    console.error("Failed to fetch sales:", err.message);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

module.exports = router;