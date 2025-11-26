/**
 * Fitzone E-commerce Cart & Checkout System
 * 
 * This script handles all cart and checkout functionality:
 * - Adding items to cart
 * - Removing items from cart
 * - Updating cart count in header
 * - Calculating total prices
 * - Displaying checkout modal
 */

// ===== CART DATA STORAGE =====
// We use localStorage to persist cart data across page refreshes
// Cart is stored as an array of objects with product info

/**
 * Get the current cart from localStorage
 * Returns an empty array if no cart exists
 */
function getCart() {
    const cart = localStorage.getItem('fitzoneCart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Save the cart array to localStorage
 * @param {Array} cart - Array of cart items
 */
function saveCart(cart) {
    localStorage.setItem('fitzoneCart', JSON.stringify(cart));
}

// ===== CART OPERATIONS =====

/**
 * Add an item to the cart
 * If item already exists, increase quantity
 * @param {string} name - Product name
 * @param {number} price - Product price (numeric)
 * @param {string} image - Product image URL
 */
function addToCart(name, price, image) {
    const cart = getCart();
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name && item.price === price);
    
    if (existingItem) {
        // Increase quantity if item exists
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Save updated cart
    saveCart(cart);
    
    // Update the cart count display
    updateCartCount();
    
    // Show confirmation message
    showNotification(`${name} added to cart!`);
}

/**
 * Remove an item from the cart completely
 * @param {number} index - Index of item to remove
 */
function removeFromCart(index) {
    const cart = getCart();
    
    // Remove the item at the specified index
    cart.splice(index, 1);
    
    // Save updated cart
    saveCart(cart);
    
    // Update displays
    updateCartCount();
    renderCheckout();
}

/**
 * Update quantity of an item in cart
 * @param {number} index - Index of item
 * @param {number} change - Amount to change quantity by (+1 or -1)
 */
function updateQuantity(index, change) {
    const cart = getCart();
    
    // Update quantity
    cart[index].quantity += change;
    
    // Remove item if quantity is 0 or less
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    // Save updated cart
    saveCart(cart);
    
    // Update displays
    updateCartCount();
    renderCheckout();
}

/**
 * Calculate the total price of all items in cart
 * @returns {number} Total price
 */
function calculateTotal() {
    const cart = getCart();
    
    // Sum up price * quantity for each item
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get total number of items in cart
 * @returns {number} Total item count
 */
function getCartItemCount() {
    const cart = getCart();
    
    // Sum up all quantities
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// ===== UI UPDATE FUNCTIONS =====

/**
 * Update the cart count display in the header
 */
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const count = getCartItemCount();
        countElement.textContent = count;
        
        // Show/hide the count badge
        countElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== CHECKOUT MODAL FUNCTIONS =====

/**
 * Open the checkout modal
 */
function openCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
        renderCheckout();
    }
}

/**
 * Close the checkout modal
 */
function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Render the checkout cart items and total
 */
function renderCheckout() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !totalElement) return;
    
    const cart = getCart();
    
    // Clear current content
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalElement.textContent = 'Rs. 0';
        return;
    }
    
    // Create HTML for each cart item
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        // Format price with commas
        const formattedPrice = formatPrice(item.price);
        const itemTotal = formatPrice(item.price * item.quantity);
        
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">Rs. ${formattedPrice}</p>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <p class="cart-item-total">Subtotal: Rs. ${itemTotal}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Update total
    totalElement.textContent = 'Rs. ' + formatPrice(calculateTotal());
}

/**
 * Format a number as price with commas
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return price.toLocaleString('en-PK');
}

/**
 * Handle checkout completion
 */
function completeCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Clear the cart
    localStorage.removeItem('fitzoneCart');
    
    // Update displays
    updateCartCount();
    renderCheckout();
    
    // Show success message
    showNotification('Order placed successfully! Thank you for shopping with Fitzone!');
    
    // Close modal after delay
    setTimeout(() => closeCheckout(), 1500);
}

/**
 * Clear entire cart
 */
function clearCart() {
    localStorage.removeItem('fitzoneCart');
    updateCartCount();
    renderCheckout();
    showNotification('Cart cleared');
}

// ===== INITIALIZATION =====

/**
 * Initialize cart functionality when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Close modal when clicking outside of it
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCheckout();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCheckout();
        }
    });
});
