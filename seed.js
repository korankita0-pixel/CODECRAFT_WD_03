require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Fresh Apples",
    description: "Crisp and juicy apples, perfect for everyday snacking.",
    price: 180,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
    category: "Fruits",
    stock: 25,
    featured: true
  },
  {
    name: "Fresh Bananas",
    description: "Naturally sweet bananas, rich in essential nutrients.",
    price: 60,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
    category: "Fruits",
    stock: 30,
    featured: true
  },
  {
    name: "Fresh Tomatoes",
    description: "Fresh red tomatoes for salads, curries and cooking.",
    price: 50,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337",
    category: "Vegetables",
    stock: 35,
    featured: true
  },
  {
    name: "Fresh Potatoes",
    description: "Farm-fresh potatoes suitable for a variety of dishes.",
    price: 45,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
    category: "Vegetables",
    stock: 40,
    featured: false
  },
  {
    name: "Full Cream Milk",
    description: "Fresh full cream milk for your daily nutritional needs.",
    price: 70,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
    category: "Dairy",
    stock: 20,
    featured: true
  },
  {
    name: "Brown Bread",
    description: "Soft and healthy whole wheat bread, freshly packed.",
    price: 55,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    category: "Groceries",
    stock: 15,
    featured: false
  },
  {
    name: "Potato Chips",
    description: "Crunchy and delicious potato chips for snack time.",
    price: 40,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
    category: "Snacks",
    stock: 25,
    featured: true
  },
  {
    name: "Basmati Rice",
    description: "Premium long-grain basmati rice for delicious meals.",
    price: 180,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    category: "Groceries",
    stock: 20,
    featured: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log(`${products.length} products added successfully`);

    await mongoose.connection.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
