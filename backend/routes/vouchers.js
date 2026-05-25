const express = require('express');
const router = express.Router();
const Voucher = require('../models/Voucher');
const Product = require('../models/Product');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// Admin: Get all vouchers
router.get('/admin/vouchers', authenticateAdmin, async (req, res) => {
  try {
    const vouchers = await Voucher.find()
      .populate('freeItem.productId', 'name image')
      .sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create voucher
router.post('/admin/vouchers', authenticateAdmin, async (req, res) => {
  try {
    const {
      code,
      isActive,
      benefitType,
      percentageAmount,
      maxDiscountCap,
      discountAmount,
      freeItem,
      minimumOrderAmount,
      usageCap,
      startDate,
      endDate
    } = req.body;

    // Validate required fields
    if (!code || !benefitType || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if code already exists
    const existing = await Voucher.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(409).json({ message: 'Voucher code already exists' });
    }

    // Validate benefit-specific fields
    if (benefitType === 'percentage' && (!percentageAmount || !maxDiscountCap)) {
      return res.status(400).json({ message: 'Percentage vouchers require percentageAmount and maxDiscountCap' });
    }
    if (benefitType === 'fixed' && !discountAmount) {
      return res.status(400).json({ message: 'Fixed vouchers require discountAmount' });
    }
    if (benefitType === 'free_item' && (!freeItem || !freeItem.productId || !freeItem.variantLabel)) {
      return res.status(400).json({ message: 'Free item vouchers require freeItem details' });
    }

    const voucher = new Voucher({
      code: code.toUpperCase(),
      isActive,
      benefitType,
      percentageAmount: benefitType === 'percentage' ? percentageAmount : null,
      maxDiscountCap: benefitType === 'percentage' ? maxDiscountCap : null,
      discountAmount: benefitType === 'fixed' ? discountAmount : null,
      freeItem: benefitType === 'free_item' ? freeItem : null,
      minimumOrderAmount: minimumOrderAmount || 0,
      usageCap: usageCap || null,
      startDate,
      endDate
    });

    await voucher.save();
    await voucher.populate('freeItem.productId', 'name image');
    res.status(201).json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update voucher
router.put('/admin/vouchers/:id', authenticateAdmin, async (req, res) => {
  try {
    const {
      code,
      isActive,
      benefitType,
      percentageAmount,
      maxDiscountCap,
      discountAmount,
      freeItem,
      minimumOrderAmount,
      usageCap,
      startDate,
      endDate
    } = req.body;

    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Check if code is being changed and if new code already exists
    if (code && code.toUpperCase() !== voucher.code) {
      const existing = await Voucher.findOne({ code: code.toUpperCase(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(409).json({ message: 'Voucher code already exists' });
      }
      voucher.code = code.toUpperCase();
    }

    if (isActive !== undefined) voucher.isActive = isActive;
    if (benefitType) voucher.benefitType = benefitType;
    if (startDate) voucher.startDate = startDate;
    if (endDate) voucher.endDate = endDate;
    if (minimumOrderAmount !== undefined) voucher.minimumOrderAmount = minimumOrderAmount;
    if (usageCap !== undefined) voucher.usageCap = usageCap;

    // Update benefit-specific fields
    if (benefitType === 'percentage') {
      voucher.percentageAmount = percentageAmount;
      voucher.maxDiscountCap = maxDiscountCap;
      voucher.discountAmount = null;
      voucher.freeItem = null;
    } else if (benefitType === 'fixed') {
      voucher.discountAmount = discountAmount;
      voucher.percentageAmount = null;
      voucher.maxDiscountCap = null;
      voucher.freeItem = null;
    } else if (benefitType === 'free_item') {
      voucher.freeItem = freeItem;
      voucher.percentageAmount = null;
      voucher.maxDiscountCap = null;
      voucher.discountAmount = null;
    } else if (benefitType === 'free_delivery') {
      voucher.percentageAmount = null;
      voucher.maxDiscountCap = null;
      voucher.discountAmount = null;
      voucher.freeItem = null;
    }

    await voucher.save();
    await voucher.populate('freeItem.productId', 'name image');
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete voucher
router.delete('/admin/vouchers/:id', authenticateAdmin, async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.json({ message: 'Voucher deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Toggle voucher active status
router.patch('/admin/vouchers/:id/toggle', authenticateAdmin, async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    voucher.isActive = !voucher.isActive;
    await voucher.save();
    await voucher.populate('freeItem.productId', 'name image');
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: Validate voucher
router.post('/vouchers/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code || orderTotal === undefined) {
      return res.status(400).json({ valid: false, message: 'Missing required fields' });
    }

    // 1. Check if voucher exists
    const voucher = await Voucher.findOne({ code: code.toUpperCase() }).populate('freeItem.productId');
    if (!voucher) {
      return res.status(404).json({ valid: false, message: 'Voucher not found' });
    }

    // 2. Check if active
    if (!voucher.isActive) {
      return res.status(400).json({ valid: false, message: 'This voucher is currently inactive' });
    }

    // 3. Check date range
    const now = new Date();
    if (now < voucher.startDate) {
      return res.status(400).json({ valid: false, message: 'Voucher is not yet active' });
    }
    if (now > voucher.endDate) {
      return res.status(400).json({ valid: false, message: 'Voucher has expired' });
    }

    // 4. Check usage cap
    if (voucher.usageCap !== null && voucher.usageCount >= voucher.usageCap) {
      return res.status(400).json({ valid: false, message: 'Voucher redemption limit has been reached' });
    }

    // 5. Check minimum order amount
    if (orderTotal < voucher.minimumOrderAmount) {
      return res.status(400).json({
        valid: false,
        message: `A minimum order of ₱${voucher.minimumOrderAmount.toFixed(2)} is required for this voucher`
      });
    }

    // 6. Calculate discount
    let discountAmount = 0;
    let freeItem = null;
    let message = '';

    if (voucher.benefitType === 'percentage') {
      const rawDiscount = orderTotal * (voucher.percentageAmount / 100);
      discountAmount = Math.min(rawDiscount, voucher.maxDiscountCap);
      message = `${voucher.percentageAmount}% off applied (up to ₱${voucher.maxDiscountCap})!`;
    } else if (voucher.benefitType === 'fixed') {
      discountAmount = Math.min(voucher.discountAmount, orderTotal);
      message = `₱${discountAmount.toFixed(2)} off applied!`;
    } else if (voucher.benefitType === 'free_item') {
      discountAmount = 0;
      freeItem = {
        productId: voucher.freeItem.productId._id,
        name: voucher.freeItem.productId.name,
        image: voucher.freeItem.productId.image,
        variantLabel: voucher.freeItem.variantLabel,
        price: voucher.freeItem.variantPrice
      };
      message = `Free ${voucher.freeItem.productId.name} (${voucher.freeItem.variantLabel}) added!`;
    } else if (voucher.benefitType === 'free_delivery') {
      discountAmount = 0;
      message = 'Free delivery applied!';
    }

    const newTotal = Math.max(0, orderTotal - discountAmount);

    res.json({
      valid: true,
      benefitType: voucher.benefitType,
      discountAmount,
      newTotal,
      freeItem,
      message
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
});

module.exports = router;
