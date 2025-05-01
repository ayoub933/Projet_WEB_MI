const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  money: { type: Number, default: 100 }
});
// Option 1: Tableau d'items (le plus probable/simple)
cart: [{
    productId: { type: String, required: true }, // Ou mongoose.Schema.Types.ObjectId si tu référence Product
    name: String,
    price: Number,
    image: String,
    quantity: { type: Number, required: true, min: 1, default: 1 }
}]
module.exports = mongoose.model('User', userSchema);
