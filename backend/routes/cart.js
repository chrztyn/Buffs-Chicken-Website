const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate item total
const calculateItemTotal = (product, selectedAddons, selectedSauces) => {
  let total = product.price;
  if (selectedAddons) {
    total += selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  }
  if (selectedSauces) {
    total += selectedSauces.reduce((sum, sauce) => sum + sauce.price, 0);
  }
  return total;
};

// Get cart
router.get('/:cartId', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId)
      .populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/:cartId/items', async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity, selectedVariants, selectedAddons, selectedSauces } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.itemTotal = calculateItemTotal(product, selectedAddons, selectedSauces) * existingItem.quantity;
    } else {
      const itemTotal = calculateItemTotal(product, selectedAddons, selectedSauces) * quantity;
      cart.items.push({
        product: productId,
        quantity,
        selectedVariants,
        selectedSauces,
        selectedAddons,
        itemTotal
      });
    }

    // Recalculate cart total
    cart.cartTotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item in cart
router.put('/:cartId/items/:itemId', async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity, selectedVariants, selectedAddons, selectedSauces } = req.body;

    const cart = await Cart.findById(cartId).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product._id);

    if (quantity !== undefined) item.quantity = quantity;
    if (selectedVariants) item.selectedVariants = selectedVariants;
    if (selectedSauces) item.selectedSauces = selectedSauces;

    item.itemTotal = calculateItemTotal(product, item.selectedAddons, item.selectedSauces) * item.quantity;

    // Recalculate cart total
    cart.cartTotal = cart.items.reduce((sum, cartItem) => sum + cartItem.itemTotal, 0);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:cartId/items/:itemId', async (req, res) => {
  try {
    const { cartId, itemId } = req.params;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.id(itemId).deleteOne();

    // Recalculate cart total
    cart.cartTotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear entire cart
router.delete('/:cartId/clear', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.cartTotal = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
