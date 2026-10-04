const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: 1000
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },

    image: {
      type: String,
      default: "https://placehold.co/400x300?text=LocalMart"
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    stock: {
      type: Number,
      default: 10,
      min: [0, "Stock cannot be negative"]
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);