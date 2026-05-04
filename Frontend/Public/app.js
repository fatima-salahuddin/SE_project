// Global State
const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    cart: []
};

// DOM Elements
const productList = document.getElementById('product-list');
const authButtons = document.getElementById('auth-buttons');
const cartCount = document.getElementById('cart-count');

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    fetchProducts();
    updateCartCount();
});

// Update Auth UI
function updateAuthUI() {
    if (state.user) {
        authButtons.innerHTML = `
            <span style="margin-right: 1rem; font-weight: 500;">Hi, ${state.user.NAME}</span>
            <button onclick="logout()" class="btn btn-outline">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-primary">Login</a>
        `;
    }
}

// Logout
function logout() {
    localStorage.removeItem('user');
    state.user = null;
    updateAuthUI();
    window.location.reload();
}

// Fetch Products
async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        renderProducts(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        productList.innerHTML = '<p>Failed to load products.</p>';
    }
}

// Render Products
function renderProducts(products) {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.PRODUCT_ID}" style="text-decoration: none; color: inherit;">
                <img src="${product.IMAGE_URL || 'https://via.placeholder.com/300'}" alt="${product.NAME}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.CATEGORY_NAME || 'General'}</div>
                    <h3 class="product-title">${product.NAME}</h3>
                    <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Sold by: ${product.SELLER_NAME}</div>
                    <div class="product-price">$${product.PRICE.toFixed(2)}</div>
                </div>
            </a>
            <div class="product-actions" style="padding: 0 1.5rem 1.5rem;">
                <button onclick="addToCart(${product.PRODUCT_ID})" class="btn btn-primary" style="width: 100%">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to Cart
async function addToCart(productId) {
    if (!state.user) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: state.user.CUSTOMER_ID,
                product_id: productId,
                quantity: 1
            })
        });

        if (res.ok) {
            alert('Added to cart!');
            // Ideally fetch cart count again
            updateCartCount();
        } else {
            alert('Failed to add to cart');
        }
    } catch (err) {
        console.error(err);
    }
}

// Update Cart Count (Mock for now, or fetch from API)
async function updateCartCount() {
    if (!state.user) {
        cartCount.innerText = '(0)';
        return;
    }

    try {
        const res = await fetch(`/api/cart/${state.user.CUSTOMER_ID}`);
        const items = await res.json();
        const count = items.reduce((acc, item) => acc + item.QUANTITY, 0);
        cartCount.innerText = `(${count})`;
    } catch (err) {
        console.error(err);
    }
}
