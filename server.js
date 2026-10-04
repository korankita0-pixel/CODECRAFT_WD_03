require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

// Get featured products
app.get("/api/products/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch featured products"
    });
  }
});

// Add a product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product"
    });
  }
});

// Create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, phone, address, items, totalAmount } = req.body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({
        message: "Please provide all required order details"
      });
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      items,
      totalAmount
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`LocalMart server running at http://localhost:${PORT}`);
});