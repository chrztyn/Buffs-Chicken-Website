const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendOTP } = require('../config/mailer');
const bcrypt = require('bcryptjs');

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if user exists by email
router.post('/check-email', async (req, res) => {
  try {
    const { email, name, phone, location } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('📧 Check-email request received:', { email, name, phone, location });

    let user = await User.findOne({ email });

    if (user) {
      // User exists - update info if provided from the form
      const updatedFields = {};

      user.isVerified = true;

      if (name) {
        user.name = name;
        updatedFields.name = name;
      }
      if (phone) {
        user.phone = phone;
        updatedFields.phone = phone;
      }
      if (location) {
        user.location = location;
        updatedFields.location = location;
      }
      
      await user.save();

      console.log('✅ Returning user updated with form values:', updatedFields);

      return res.json({
        exists: true,
        userId: user._id,
        name: user.name,
        phone: user.phone,
        location: user.location,
        message: 'User found. Profile updated. Proceeding to checkout without OTP.'
      });
    } else {
      // New user - OTP needed
      return res.json({
        exists: false,
        message: 'New user. OTP verification required.'
      });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: error.message || 'Failed to check email' });
  }
});

// Send OTP to user email (only for new users)
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, phone, location } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Returning customer - update info and return without OTP
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.location = location || user.location;
      await user.save();

      console.log('✅ Returning user updated:', { name: user.name, phone: user.phone, location: user.location });

      return res.json({
        message: 'Returning user. Updated info. No OTP needed.',
        userId: user._id,
        email: user.email,
        isReturning: true,
        requiresOTP: false,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location
        }
      });
    }

    // New user - requires OTP
    if (!name || !phone || !location) {
      return res.status(400).json({ message: 'All fields are required for new users' });
    }

    user = new User({
      name,
      email,
      phone,
      location,
      isVerified: false
    });

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
      email: user.email,
      isReturning: false,
      requiresOTP: true
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

// Update user by email (for updating returning customer info)
router.put('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, phone, location } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message || 'Failed to update user' });
  }
});

module.exports = router;
