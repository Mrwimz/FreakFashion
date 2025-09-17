const express = require("express");
const db = require("../models/init");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const router = express.Router();

// Ensure images folder exists
const uploadDir = path.join(__dirname, "../public/images/categories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // use original name but sanitize
    cb(null, file.originalname.toLowerCase().replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage });

// ============================
// Existing routes
// ============================

// Get all categories
router.get("/", (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

// Add category
router.post("/", (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
  const info = stmt.run(name);
  res.json({ id: info.lastInsertRowid, name });
});

// Delete category
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    // 1️⃣ Delete the category from DB
    const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    // 2️⃣ Delete the image file if it exists
    const imageDir = path.join(__dirname, "../public/images/categories");
    const possibleExts = ["png", "jpg"];
    possibleExts.forEach((ext) => {
      const filePath = path.join(imageDir, `${id}.${ext}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete the file
      }
    });

    res.json({ message: "Category and associated image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ============================
// New: Upload category image
// ============================
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "Image uploaded",
    filename: req.file.filename,
    url: `/images/categories/${req.file.filename}`,
  });
});

module.exports = router;
