const express = require('express');
const router = express.Router();
const { sendContactFormEmail } = require('../config/mailer');
const validator = require('validator');

// POST - Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Validate name length
    if (!validator.isLength(name, { min: 2, max: 100 })) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 100 characters.'
      });
    }

    // Validate message length
    if (!validator.isLength(message, { min: 10, max: 5000 })) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 5000 characters.'
      });
    }

    // Sanitize inputs to prevent injection
    const sanitizedName = validator.escape(name.trim());
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedMessage = validator.escape(message.trim());

    // Send email to owner
    await sendContactFormEmail(sanitizedName, sanitizedEmail, sanitizedMessage);

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you shortly.'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.'
    });
  }
});

module.exports = router;
