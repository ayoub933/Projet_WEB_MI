let cart = [
    { name: "T-Shirt KC", price: 29.99, quantity: 0 },
    { name: "T-Shirt à la plage", price: 29.99, quantity: 0 },
    { name: "T-Shirt distingué", price: 29.99, quantity: 0 }
];

function updateQuantity(index, change) {
    if (cart[index].quantity + change >= 0) {
        cart[index].quantity += change;
        document.getElementById(`quantity-${index}`).textContent = cart[index].quantity;
        updateCartSummary();
        saveCart();
    }
}

function updateCartSummary() {
    let totalItems = 0;
    let totalPrice = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.quantity * item.price;
    });

    document.getElementById("cart-count").textContent = totalItems;
    document.getElementById("cart-total").textContent = totalPrice.toFixed(2) + "€";
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function goToCart() {
    window.location.href = "panier.html";
}

// Charger le panier depuis localStorage
window.onload = function () {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cart.forEach((item, index) => {
            document.getElementById(`quantity-${index}`).textContent = item.quantity;
        });
        updateCartSummary();
    }
};
