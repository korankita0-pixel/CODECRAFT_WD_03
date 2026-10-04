let products = [];
let cart = [];

// Load products
async function loadProducts(category = "all", search = "") {
  try {
    let url = "/api/products";
    const params = new URLSearchParams();

    if (category !== "all") {
      params.append("category", category);
    }

    if (search.trim()) {
      params.append("search", search.trim());
    }

    if (params.toString()) {
      url += "?" + params.toString();
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    products = await response.json();
    displayProducts(products);

  } catch (error) {
    console.error(error);

    document.getElementById("productsContainer").innerHTML = `
      <div class="loading">
        Unable to load products. Please try again.
      </div>
    `;
  }
}

// Display products
function displayProducts(productList) {
  const container = document.getElementById("productsContainer");
  const count = document.getElementById("productCount");

  count.textContent =
    `${productList.length} product${productList.length !== 1 ? "s" : ""}`;

  if (productList.length === 0) {
    container.innerHTML = `
      <div class="loading">
        No products found.
      </div>
    `;
    return;
  }

  container.innerHTML = productList.map(product => `
    <div class="product-card">

      <img
        src="${product.image}"
        alt="${product.name}"
        class="product-image"
        onerror="this.src='https://placehold.co/400x300?text=LocalMart'"
      >

      <div class="product-info">

        <span class="product-category">
          ${product.category}
        </span>

        <h3 class="product-name">
          ${product.name}
        </h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">

          <span class="product-price">
            ₹${Number(product.price).toLocaleString("en-IN")}
          </span>

          <button
            class="add-btn"
            onclick="addToCart('${product._id}')"
            ${product.stock <= 0 ? "disabled" : ""}
          >
            ${product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

        </div>

      </div>

    </div>
  `).join("");
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(item => item._id === productId);

  if (!product) return;

  const existingItem = cart.find(item => item._id === productId);

  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
    } else {
      alert("Maximum available stock reached.");
      return;
    }
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCartCount();

  alert(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = totalItems;
}

// Display cart
function displayCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p style="text-align:center; padding:30px;">
        Your cart is empty.
      </p>
    `;

    cartTotal.textContent = "0";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">

      <div>
        <h4>${item.name}</h4>
        <p>
          ₹${Number(item.price).toLocaleString("en-IN")}
          × ${item.quantity}
        </p>
      </div>

      <button
        class="remove-btn"
        onclick="removeFromCart('${item._id}')"
      >
        Remove
      </button>

    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartTotal.textContent = total.toLocaleString("en-IN");
}

// Remove item
function removeFromCart(productId) {
  cart = cart.filter(item => item._id !== productId);

  updateCartCount();
  displayCart();
}

// Search
document.getElementById("searchBtn").addEventListener("click", () => {
  const search = document.getElementById("searchInput").value;

  const activeCategory =
    document.querySelector(".category-btn.active")?.dataset.category || "all";

  loadProducts(activeCategory, search);
});

// Enter key search
document
  .getElementById("searchInput")
  .addEventListener("keydown", event => {
    if (event.key === "Enter") {
      document.getElementById("searchBtn").click();
    }
  });

// Category buttons
document.querySelectorAll(".category-btn").forEach(button => {
  button.addEventListener("click", () => {

    document
      .querySelectorAll(".category-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const category = button.dataset.category;
    const search = document.getElementById("searchInput").value;

    loadProducts(category, search);
  });
});

// Open cart
document.getElementById("cartBtn").addEventListener("click", () => {
  displayCart();

  document.getElementById("checkoutForm").style.display = "none";

  document.getElementById("cartModal").classList.add("show");
});

// Close cart
document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartModal").classList.remove("show");
});

// Close modal outside content
document.getElementById("cartModal").addEventListener("click", event => {
  if (event.target.id === "cartModal") {
    document.getElementById("cartModal").classList.remove("show");
  }
});

// Open checkout form
document.getElementById("checkoutBtn").addEventListener("click", () => {

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  document.getElementById("checkoutForm").style.display = "block";
});

// Place order
document.getElementById("placeOrderBtn").addEventListener("click", async () => {

  const customerName =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();

  const address =
    document.getElementById("customerAddress").value.trim();

  if (!customerName || !phone || !address) {
    alert("Please fill in all delivery details.");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  if (address.length < 10) {
    alert("Please enter a complete delivery address.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderItems = cart.map(item => ({
    productId: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  try {

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerName,
        phone,
        address,
        items: orderItems,
        totalAmount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Order failed");
    }

    alert(
      `Order placed successfully! 🎉\n\nOrder ID: ${data.order._id}\nTotal: ₹${totalAmount.toLocaleString("en-IN")}`
    );

    cart = [];

    updateCartCount();

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";

    document.getElementById("checkoutForm").style.display = "none";

    displayCart();

  } catch (error) {
    console.error(error);

    alert(
      "Unable to place order. Please try again."
    );
  }
});

// Scroll to products
function scrollToProducts() {
  document.getElementById("productsSection").scrollIntoView({
    behavior: "smooth"
  });
}

// Load products on startup
loadProducts();