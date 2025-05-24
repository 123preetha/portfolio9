// DOM Elements
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const genreFilter = document.getElementById("genre-filter");
const priceFilter = document.getElementById("price-filter");
const searchInput = document.getElementById("search");
const cartPopup = document.getElementById("cart-popup");

// Sample Products with IDs
const products = [
  { id: 1, name: "Little women", genre: "Mystery", price: 1000, img: "book2.webp" },
  { id: 2, name: "The Book Thief", genre: "fiction", price: 800, img: "book2.png" },
  { id: 3, name: "The Big Deal", genre: "mystery", price: 1200, img: "book3.jpg" },
  { id: 4, name: "The Call of the Wild", genre: "romance", price: 270, img: "book1.jpg" },
  { id: 5, name: "The Great GATSBY", genre: "science", price: 899, img: "book4.jpg" },
  { id: 6, name: "It Ends With Us", genre: "romance", price: 699, img: "book5.png" },
  { id: 7, name: "How To Die Famous", genre: "nonfiction", price: 350, img: "book6.jpg" }
];

let cart = [];

function renderBooks(filtered = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-500">No books found.</p>`;
    return;
  }

  filtered.forEach(product => {
    container.innerHTML += `
      <div class="bg-white p-4 rounded shadow hover:shadow-md transition">
        <div class="w-full h-48 bg-gray-100 flex items-center justify-center mb-2 rounded">
          <img src="${product.img}" alt="${product.name}" class="max-h-full max-w-full object-contain" />
        </div>
        <h3 class="text-lg font-semibold mb-1">${product.name}</h3>
        <p class="text-sm mb-1 capitalize text-gray-600">${product.genre}</p>
        <p class="text-sm text-gray-800 font-medium mb-2">₹${product.price}</p>
        <button class="bg-blue-600 text-white w-full py-1 px-3 rounded hover:bg-blue-700" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

function filterBooks() {
  const genre = genreFilter.value;
  const price = priceFilter.value;
  const search = searchInput ? searchInput.value.toLowerCase() : "";

  let filtered = products;

  if (genre !== "all") {
    filtered = filtered.filter(p => p.genre === genre);
  }

  if (price !== "all") {
    if (price === "0-500") filtered = filtered.filter(p => p.price <= 500);
    else if (price === "500-1000") filtered = filtered.filter(p => p.price > 500 && p.price <= 1000);
    else if (price === "1000+") filtered = filtered.filter(p => p.price > 1000);
  }

  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }

  renderBooks(filtered);
}

function addToCart(productId) {
  const item = products.find(p => p.id === productId);
  const existing = cart.find(c => c.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCartUI();
  showCartPopup();
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItems.innerHTML += `
      <div class="border-b pb-2 mb-2">
        <p>${item.name} × ${item.quantity}</p>
        <p class="text-sm text-gray-500">₹${item.price} each</p>
        <button onclick="removeFromCart(${item.id})" class="text-red-500 text-xs mt-1">Remove</button>
      </div>
    `;
  });

  cartTotal.textContent = total;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function showCartPopup() {
  cartPopup.classList.remove("hidden");
  setTimeout(() => cartPopup.classList.add("hidden"), 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
  genreFilter.addEventListener("change", filterBooks);
  priceFilter.addEventListener("change", filterBooks);
  if (searchInput) {
    searchInput.addEventListener("input", filterBooks);
  }
});

document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = products.filter(book => book.name.toLowerCase().includes(query));
  renderBooks(filtered);
});

function handleCheckout() {
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const deliveryOption = document.getElementById("delivery-option").value;
  const paymentMethod = document.getElementById("payment-method").value;

  if (!address || !email || !mobile) {
    alert("Please fill in all required fields (Address, Email, Phone).");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Calculate total price
  let total = 0;
  cart.forEach(item => total += item.price * item.quantity);

  const deliveryText = deliveryOption === "standard" ? "Standard Delivery (3–5 days)" : "VIP Delivery (1–2 days)";
  const paymentText = paymentMethod === "cod" ? "Cash on Delivery" :
                      paymentMethod === "upi" ? "UPI" : "Credit/Debit Card";

  showOrderConfirmation({
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: total,
    delivery: deliveryText,
    payment: paymentText
  });

  cart.length = 0;
  updateCartUI();
  document.getElementById("address").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("cart").classList.add("hidden");
}

function showOrderConfirmation({ itemCount, totalPrice, delivery, payment }) {
  const confirmation = document.getElementById("order-confirmation");

  confirmation.innerHTML = `
    <div>
      <h3 class="font-bold mb-2">✅ Order Placed Successfully!</h3>
      <p><strong>Items:</strong> ${itemCount}</p>
      <p><strong>Total:</strong> ₹${totalPrice}</p>
      <p><strong>Delivery:</strong> ${delivery}</p>
      <p><strong>Payment:</strong> ${payment}</p>
      <p class="mt-2">Thank you for shopping with us!</p>
    </div>
  `;

  confirmation.classList.remove("hidden");
  setTimeout(() => confirmation.classList.add("hidden"), 6000);
}
