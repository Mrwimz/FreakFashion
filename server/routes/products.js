const express = require("express");
const db = require("../models/init");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  filename: (req, file, cb) => {
    // filename will be set dynamically after product is created
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ---------------------
// Get all products
// ---------------------
router.get("/", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

// Get /:id
router.get("/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Get /sku/:sku
router.get("/sku/:sku", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE sku = ?").get(req.params.sku);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Get /slug/:slug
router.get("/slug/:slug", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Get /category/:categoryId
router.get("/category/:categoryId", (req, res) => {
  const products = db.prepare("SELECT * FROM products WHERE category_id = ?").all(req.params.categoryId);
  res.json(products);
});

// ---------------------
// Add product (without image column handling)
// ---------------------
router.post("/", (req, res) => {
  const { name, brand, description, price, publish_date, sku, slug, category_id } = req.body;

  const stmt = db.prepare(`
    INSERT INTO products 
      (name, brand, description, price, publish_date, sku, slug, category_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(name, brand, description, price, publish_date, sku, slug, category_id);
    res.json({ id: info.lastInsertRowid, name, brand, description, price, publish_date, sku, slug, category_id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------
// Upload product image
// ---------------------
router.post("/upload/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Rename uploaded file to match [id].ext
  const ext = req.file.originalname.split(".").pop().toLowerCase();
  const targetPath = path.join(__dirname, "../public/images/products", `${id}.${ext}`);
  fs.renameSync(req.file.path, targetPath);

  res.json({ message: "Image uploaded successfully" });
});

// ---------------------
// Delete product and its image
// ---------------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    // Delete DB entry
    const stmt = db.prepare("DELETE FROM products WHERE id = ?");
    const result = stmt.run(id);
    if (result.changes === 0) return res.status(404).json({ error: "Product not found" });

    // Delete image files
    const imageDir = path.join(__dirname, "../public/images/products");
    ["png", "jpg"].forEach((ext) => {
      const filePath = path.join(imageDir, `${id}.${ext}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    res.json({ message: "Product and image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
