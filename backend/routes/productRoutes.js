const express = require("express");
const Product = require("../models/Product");
const { verifyToken } = require("../authMiddleware"); 

const router = express.Router();

// GET /api/products - List all products for the authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    // Filter products by the authenticated user's ID (req.user.uid)
    const products = await Product.find({ userId: req.user.uid }).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/products - Create a new product
router.post("/", verifyToken, async (req, res) => {
  try {
    // Add the user ID from the token to the product data
    const productData = {
      ...req.body,
      userId: req.user.uid,
    };

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err.message);
    // Mongoose validation errors often use status 400
    res.status(400).json({ error: "Failed to create product", details: err.message });
  }
});

// GET /api/products/:id - Get a single product
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching single product:", err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// PUT /api/products/:id - Update an existing product
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true, runValidators: true } // Return the updated document and run schema validation
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found or access denied" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(400).json({ error: "Failed to update product", details: err.message });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found or access denied" });
    }

    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;