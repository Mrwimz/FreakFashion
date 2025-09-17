const express = require("express");
const db = require("../models/init");
const router = express.Router();

// Get all users 
router.get("/", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all(); // Lösenord med i svaret - inte bra i produktion ( Bör hashas och tas bort från svaret )
  res.json(users);
});

// Get specific user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare("SELECT id, email, admin, liked_products FROM users WHERE id = ?").get(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add user
router.post("/", (req, res) => {
  const { email, password, admin, liked_products } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO users (email, password, admin, liked_products)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(email, password, admin, liked_products || 0);

    res.json({ id: info.lastInsertRowid, email, admin: admin || 0 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Like a product
router.post("/:userId/like/:productId", (req, res) => {
  const { userId, productId } = req.params;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // liked_products stored as comma-separated string, or empty string
  let liked = user.liked_products ? user.liked_products.split(",").map(Number) : [];

  const prodId = parseInt(productId);
  if (!liked.includes(prodId)) liked.push(prodId);

  db.prepare("UPDATE users SET liked_products = ? WHERE id = ?")
    .run(liked.join(","), userId);

  res.json(liked);
});

// Unlike a product
router.post("/:userId/unlike/:productId", (req, res) => {
  const { userId, productId } = req.params;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  let liked = user.liked_products ? user.liked_products.split(",").map(Number) : [];

  const prodId = parseInt(productId);
  liked = liked.filter((id) => id !== prodId);

  db.prepare("UPDATE users SET liked_products = ? WHERE id = ?")
    .run(liked.join(","), userId);

  res.json(liked);
});

module.exports = router;
