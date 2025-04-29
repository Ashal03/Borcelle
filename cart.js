// Initialize cart array from localStorage or create empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(item) {
    console.log("Adding to cart:", item); // Debug log
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Item doesn't exist, add to cart with quantity 1
        cart.push({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image: item.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Show confirmation message
    alert(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            removeFromCart(itemId);
        } else {
            // Update quantity
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            renderCart();
        }
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
}

// Render cart items on cart page
function renderCart() {
    console.log("Rendering cart with items:", cart); // Debug log
    
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer) {
        console.log("Cart container not found - not on cart page"); // Debug log
        return; // Not on cart page
    }
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message, hide summary
        cartEmptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        console.log("Cart is empty"); // Debug log
    } else {
        // Hide empty cart message, show summary
        cartEmptyMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        
        // Create HTML for each cart item
        cart.forEach(item => {
            console.log("Creating element for item:", item); // Debug log
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update total price
        cartTotalPrice.textContent = `$${calculateTotal()}`;
        
        // Add event listeners to the quantity and remove buttons
        addCartButtonListeners();
    }
}

// Add event listeners to cart buttons
function addCartButtonListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item) {
                updateQuantity(itemId, item.quantity - 1);
            }
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item) {
                updateQuantity(itemId, item.quantity + 1);
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeFromCart(itemId);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Thank you for your purchase! This is a demo checkout process.');
            // Clear cart after checkout
            cart = [];
            saveCart();
            renderCart();
        });
    }
}

// Modified: Event listener for "Add to Cart" buttons on computer parts page
function setupAddToCartButtons() {
    console.log("Setting up Add to Cart buttons"); // Debug log
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log(`Found ${addToCartButtons.length} Add to Cart buttons`); // Debug log
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Modified: Using part-item instead of peripheral
            const parentElement = this.closest('.part-item');
            
            // Get data attributes
            const itemId = parentElement.getAttribute('data-id');
            const itemName = parentElement.getAttribute('data-name');
            const itemPrice = parentElement.getAttribute('data-price');
            // Modified: Get the image source directly from the img element
            const itemImage = parentElement.querySelector('.part-image').src;
            
            console.log("Item data:", { id: itemId, name: itemName, price: itemPrice, image: itemImage }); // Debug log
            
            const item = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                image: itemImage
            };
            
            addToCart(item);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded"); // Debug log
    
    // First, update the cart count
    updateCartCount();
    
    // Check if we're on the cart page
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        console.log("On cart page, rendering cart"); // Debug log
        renderCart();
    }
    
    // Check if we're on the computer parts page
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        console.log("On computer parts page, setting up buttons"); // Debug log
        setupAddToCartButtons();
    }
});

// For debugging - log cart contents on load
console.log("Initial cart contents:", cart);