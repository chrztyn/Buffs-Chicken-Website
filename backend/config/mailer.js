const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Order Verification OTP - Buffs Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Verification</h2>
          <p>Hi,</p>
          <p>Your One-Time Password (OTP) for order verification is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #e74c3c; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Do not share this OTP with anyone.</p>
          <br>
          <p>Best regards,<br><strong>Buffs Restaurant Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP');
  }
};

const sendOrderNotification = async (email, orderNumber, status) => {
  try {
    const statusMessages = {
      pending: 'Your order has been received and is pending confirmation.',
      preparing: 'Your order is being prepared.',
      'out for delivery': 'Your order is out for delivery.',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Update - ${orderNumber} - Buffs Restaurant`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Hi,</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Status:</strong> <span style="color: #e74c3c; text-transform: uppercase;">${status}</span></p>
          <p>${statusMessages[status]}</p>
          <br>
          <p>Thank you for your order!<br><strong>Buffs Restaurant Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send notification');
  }
};

const sendContactFormEmail = async (name, email, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name} - Buffs Restaurant`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A4189;">New Contact Form Submission</h2>
          <div style="background-color: #f9f5ed; padding: 20px; border-radius: 8px; border-left: 4px solid #1A4189;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
          </div>
          <br>
          <p style="color: #666; font-size: 12px;">This is an automated message from your Buffs Restaurant website.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send contact form email');
  }
};

module.exports = { sendOTP, sendOrderNotification, sendContactFormEmail, transporter };
