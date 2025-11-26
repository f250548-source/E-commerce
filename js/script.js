// Get the current cart from localStorage
function getCart() {
  const cart = localStorage.getItem('fitzoneCart');
  return cart ? JSON.parse(cart) : [];
}

// Save the cart array to localStorage
function saveCart(cart) {
  localStorage.setItem('fitzoneCart', JSON.stringify(cart));
}

// Add an item to the cart (or increase quantity if it exists)
function addToCart(name, price, image) {
  const cart = getCart();
  const existingItem = cart.find(item => item.name === name && item.price === price);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  showNotification(name + ' added to cart!');
}

// Remove an item from the cart
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCheckout();
}

// Update quantity of an item (+1 or -1)
function updateQuantity(index, change) {
  const cart = getCart();
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCount();
  renderCheckout();
}

// Calculate the total price of all items in cart
function calculateTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get total number of items in cart
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}
// Update the cart count display in the header
function updateCartCount() {
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    const count = getCartItemCount();
    countElement.textContent = count;
    countElement.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// Show a notification message
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Open the checkout modal
function openCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderCheckout();
  }
}

// Close the checkout modal
function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Render the checkout cart items and total
function renderCheckout() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');

  if (!cartItemsContainer || !totalElement) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    totalElement.textContent = 'Rs. 0';
    return;
  }

  // Create HTML for each cart item
  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';

    const formattedPrice = formatPrice(item.price);
    const itemTotal = formatPrice(item.price * item.quantity);

    itemElement.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-image">' +
      '<div class="cart-item-details">' +
        '<h4>' + item.name + '</h4>' +
        '<p class="cart-item-price">Rs. ' + formattedPrice + '</p>' +
        '<div class="quantity-controls">' +
          '<button class="qty-btn" onclick="updateQuantity(' + index + ', -1)">-</button>' +
          '<span class="qty-value">' + item.quantity + '</span>' +
          '<button class="qty-btn" onclick="updateQuantity(' + index + ', 1)">+</button>' +
        '</div>' +
        '<p class="cart-item-total">Subtotal: Rs. ' + itemTotal + '</p>' +
      '</div>' +
      '<button class="remove-btn" onclick="removeFromCart(' + index + ')">×</button>';

    cartItemsContainer.appendChild(itemElement);
  });

  totalElement.textContent = 'Rs. ' + formatPrice(calculateTotal());
}

// Format a number as price with commas
function formatPrice(price) {
  return price.toLocaleString('en-PK');
}

// Handle checkout completion
function completeCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }

  localStorage.removeItem('fitzoneCart');
  updateCartCount();
  renderCheckout();
  showNotification('Order placed successfully! Thank you for shopping with Fitzone!');
  setTimeout(() => closeCheckout(), 1500);
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem('fitzoneCart');
  updateCartCount();
  renderCheckout();
  showNotification('Cart cleared');
}

// Initialize cart functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
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
