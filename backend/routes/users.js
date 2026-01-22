const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendOTP } = require('../config/mailer');
const bcrypt = require('bcryptjs');

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user email
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, phone, location } = req.body;

    if (!email || !name || !phone || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists, if not create new user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        name,
        email,
        phone,
        location,
        isVerified: false
      });
    } else {
      // Update user info
      user.name = name;
      user.phone = phone;
      user.location = location;
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    await sendOTP(email, otp);

    res.json({
      message: 'OTP sent to email',
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: error.message || 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Compare OTP
    const isOTPValid = await bcrypt.compare(otp, user.otpHash);

    if (!isOTPValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: error.message || 'Failed to verify OTP' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
