const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
