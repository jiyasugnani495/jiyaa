
// Select HTML Elements
const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");


// Store Products and Cart
let products = [];
let cart = [];


// Load Products Using Fetch API
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productContainer.innerHTML = `
            <p class="no-products">
                Failed to load products. Please run the website
                using a local server.
            </p>
        `;

        console.error("Error:", error);

    }

}


// Display Products Dynamically
function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML = `
            <p class="no-products">
                No products found!
            </p>
        `;

        return;

    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-rating">
                    ${"★".repeat(Math.round(product.rating))}
                    ${"☆".repeat(5 - Math.round(product.rating))}
                    <span>(${product.rating}/5)</span>
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                    >
                        Add to Cart +
                    </button>

                </div>

            </div>

        `;

        productContainer.appendChild(card);

    });

}


// Add Product to Cart
function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}


// Update Cart Display
function updateCart() {

    cartItems.innerHTML = "";

    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty!
            </p>
        `;

    }

    cart.forEach(item => {

        totalQuantity += item.quantity;

        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-details">

                <h4>${item.name}</h4>

                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                </p>

                <div class="cart-item-controls">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                    >+</button>

                    <button
                        class="remove-item"
                        data-action="remove"
                        data-id="${item.id}"
                    >✕</button>

                </div>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });


    // Update Cart Counter
    cartCount.textContent = totalQuantity;

    // Update Total Price
    cartTotal.textContent =
        "₹" + totalPrice.toLocaleString("en-IN");

}


// Change Cart Quantity
function changeQuantity(id, action) {

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(product => product.id !== id);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(product => product.id !== id);

    }

    updateCart();

}


// Search Products
function searchProducts() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);

}


// Open Cart
function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

}


// Close Cart
function hideCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}


// Product Button Click
productContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart");

    if (button) {

        const id = Number(button.dataset.id);

        addToCart(id);

        button.textContent = "Added ✓";

        setTimeout(() => {

            button.textContent = "Add to Cart +";

        }, 1000);

    }

});


// Cart Quantity and Remove Buttons
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    changeQuantity(id, action);

});


// Search Button
searchBtn.addEventListener("click", searchProducts);


// Search While Typing
searchInput.addEventListener("input", searchProducts);


// Open Cart Button
cartButton.addEventListener("click", openCart);


// Close Cart Button
closeCart.addEventListener("click", hideCart);


// Close Cart When Clicking Outside
cartOverlay.addEventListener("click", hideCart);


// Checkout Button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping at ShopZone!\n" +
        "Your total amount is " + cartTotal.textContent +
        "\nThis is a demo checkout. No payment was made."
    );

});


// Start Website
loadProducts();


// Initialize Cart
updateCart();
